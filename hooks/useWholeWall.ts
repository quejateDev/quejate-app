"use client";

import { useCallback, useRef, useState } from "react";
import type { EntityPlace, PlacesByEntity } from "@/lib/wall-filters";
import type { PQR } from "@/types/pqrsd";

/** El `limit` más alto que acepta `GET /pqr`: por encima responde 400. */
const WALL_PAGE_SIZE = 50;

/**
 * Tope de páginas del muro entero, es decir, 500 PQRSD. El 14/10/2026 el muro
 * tenía 24 y basta una petición; el tope acota la descarga si crece antes de
 * que filtre el servidor. Es el mismo que el del buscador del muro de la app.
 */
const WALL_MAX_PAGES = 10;

/**
 * `"truncated"`: se llegó al tope y el servidor decía que había más; la lista
 * trae las más recientes. `"failed"`: falló una página y no se publicó nada.
 */
export type WholeWallStatus = "idle" | "loading" | "complete" | "truncated" | "failed";

export type PlacesStatus = "idle" | "loading" | "ready" | "failed";

/** Lo que se lee de cada entidad de `GET /entities`. */
interface CatalogEntity {
  id?: string;
  municipalityId?: string | null;
  municipality?: string | null;
  department?: string | null;
}

/**
 * Pide el muro de 50 en 50 hasta que el servidor dice que no hay más, o hasta
 * el tope.
 *
 * O devuelve todas las páginas o falla: si una no llega, no se publica ninguna.
 * Con media lista, el muro diría «sin resultados» de PQRSD que existen.
 */
async function fetchWholeWall(): Promise<{ pqrs: PQR[]; truncated: boolean }> {
  const byId = new Map<string, PQR>();
  let serverHasMore = true;
  for (let page = 1; serverHasMore && page <= WALL_MAX_PAGES; page++) {
    const response = await fetch(`/api/pqr?page=${page}&limit=${WALL_PAGE_SIZE}`);
    if (!response.ok) {
      throw new Error(`GET /api/pqr respondió ${response.status}`);
    }
    const data = await response.json();
    // Una respuesta sin lista no es una página vacía: darla por buena cerraría
    // la búsqueda con «sin resultados» sin haber leído el muro.
    if (!Array.isArray(data?.pqrs)) {
      throw new TypeError("GET /api/pqr respondió sin la lista de PQRSD");
    }
    // La paginación es por desplazamiento: si se radica una entre dos páginas,
    // la última de una vuelve al principio de la siguiente.
    for (const item of data.pqrs as PQR[]) {
      if (item?.id && !byId.has(item.id)) byId.set(item.id, item);
    }
    serverHasMore = data.hasMore === true;
  }
  return { pqrs: Array.from(byId.values()), truncated: serverHasMore };
}

/**
 * El municipio de cada entidad, del catálogo público. Las PQRSD del muro no
 * traen la ciudad.
 */
async function fetchPlaces(): Promise<PlacesByEntity> {
  const response = await fetch("/api/entities");
  if (!response.ok) {
    throw new Error(`GET /api/entities respondió ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new TypeError("GET /api/entities no respondió una lista");
  }
  const places: PlacesByEntity = new Map();
  for (const entity of data as CatalogEntity[]) {
    if (entity?.id && entity.municipalityId && entity.municipality) {
      places.set(entity.id, {
        municipalityId: entity.municipalityId,
        municipality: entity.municipality,
        department: entity.department ?? null,
      } satisfies EntityPlace);
    }
  }
  return places;
}

/**
 * El muro entero y el municipio de cada entidad, para buscar y filtrar en el
 * navegador. No pide nada hasta que se llama a `load`: sin filtros, el muro
 * sigue con su paginación.
 *
 * Cada cosa se pide una vez por visita a la página. `load` vuelve a pedir lo
 * que falló, así que sirve también para «Reintentar».
 *
 * Con `withPlaces` en `false`, `load` no pide el catálogo y `placesStatus` se
 * queda en `"idle"`: solo lo usa el filtro de ciudad, y con los filtros del
 * muro escondidos una búsqueda no lo necesita.
 */
export function useWholeWall({ withPlaces }: { withPlaces: boolean }) {
  const [wall, setWall] = useState<{ status: WholeWallStatus; pqrs: PQR[] }>({
    status: "idle",
    pqrs: [],
  });
  const [places, setPlaces] = useState<{ status: PlacesStatus; places: PlacesByEntity }>({
    status: "idle",
    places: new Map(),
  });
  // En un ref y no en el estado: dos llamadas seguidas, antes de que React
  // pinte, no pueden lanzar dos descargas.
  const wallRequested = useRef(false);
  const placesRequested = useRef(false);

  const load = useCallback(() => {
    if (!wallRequested.current) {
      wallRequested.current = true;
      setWall({ status: "loading", pqrs: [] });
      fetchWholeWall()
        .then(({ pqrs, truncated }) =>
          setWall({ status: truncated ? "truncated" : "complete", pqrs }),
        )
        .catch((error: unknown) => {
          console.error("[muro] no se pudo cargar el muro entero:", error);
          wallRequested.current = false;
          setWall({ status: "failed", pqrs: [] });
        });
    }

    if (withPlaces && !placesRequested.current) {
      placesRequested.current = true;
      setPlaces((prev) => ({ ...prev, status: "loading" }));
      fetchPlaces()
        .then((loaded) => setPlaces({ status: "ready", places: loaded }))
        .catch((error: unknown) => {
          console.error("[muro] no se pudo cargar el catálogo de entidades:", error);
          placesRequested.current = false;
          setPlaces({ status: "failed", places: new Map() });
        });
    }
  }, [withPlaces]);

  return {
    wallStatus: wall.status,
    pqrs: wall.pqrs,
    placesStatus: places.status,
    places: places.places,
    load,
  };
}
