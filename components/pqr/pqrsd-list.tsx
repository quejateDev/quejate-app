"use client";

import { PQRCard } from "./PQRCard";
import { PQR } from "@/types/pqrsd";
import { UserBasic } from "@/types/user-basic";
import { useEffect, useMemo, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { PQRSkeleton } from "./pqr-skeleton";
import { WallFiltersBar, type WallOptionsStatus } from "./wall-filters";
import { entityFilterOptions } from "@/components/filters/entity-filter";
import { useWholeWall } from "@/hooks/useWholeWall";
import {
  EMPTY_WALL_FILTERS,
  applyWallFilters,
  cityFilterOptions,
  hasWallFilters,
  writeWallFilters,
  type WallFilters,
} from "@/lib/wall-filters";
import { toSearchable } from "@/lib/wall-search";

interface PQRListProps {
  initialPqrs: PQR[];
  currentUser: UserBasic | null;
  /** Los filtros que trae la dirección al cargar la página. */
  initialFilters: WallFilters;
}

/** Espera antes de llevar los filtros a la dirección: no se reescribe en cada tecla. */
const URL_SYNC_DELAY_MS = 300;

export default function PQRList({ initialPqrs, currentUser, initialFilters }: PQRListProps) {
  const [pqrs, setPqrs] = useState<PQR[]>(initialPqrs);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  // Con texto o con un filtro se busca en el muro entero, y no en las páginas
  // que lleva cargadas «Mostrar más»: filtrado sobre esas, el muro diría «sin
  // resultados» de PQRSD que están más abajo. Sin filtros, el muro es el de
  // siempre y no se pide nada más.
  const [filters, setFilters] = useState<WallFilters>(initialFilters);
  const filtering = hasWallFilters(filters);
  const wholeWall = useWholeWall();
  const { load: loadWholeWall } = wholeWall;

  useEffect(() => {
    if (filtering) loadWholeWall();
  }, [filtering, loadWholeWall]);

  // Los filtros van en la dirección, para que un enlace copiado abra el muro
  // igual. `replaceState` no recarga la página ni deja una entrada en el
  // historial por cada cambio.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const { pathname, search, hash } = window.location;
      const next = writeWallFilters(search, filters);
      if (next !== search) {
        window.history.replaceState(null, "", `${pathname}${next}${hash}`);
      }
    }, URL_SYNC_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [filters]);

  // El texto de cada PQRSD se prepara una vez por muro, no en cada tecla.
  const rows = useMemo(() => wholeWall.pqrs.map(toSearchable), [wholeWall.pqrs]);
  const results = useMemo(
    () => applyWallFilters(rows, filters, wholeWall.places),
    [rows, filters, wholeWall.places],
  );
  const entityOptions = useMemo(() => entityFilterOptions(wholeWall.pqrs), [wholeWall.pqrs]);
  const cityOptions = useMemo(
    () => cityFilterOptions(wholeWall.pqrs, wholeWall.places),
    [wholeWall.pqrs, wholeWall.places],
  );

  const wallReady = wholeWall.wallStatus === "complete" || wholeWall.wallStatus === "truncated";
  const wallFailed = wholeWall.wallStatus === "failed";
  const placesReady = wholeWall.placesStatus === "ready";
  const placesFailed = wholeWall.placesStatus === "failed";

  const entityOptionsStatus: WallOptionsStatus = wallReady
    ? "ready"
    : wallFailed
      ? "failed"
      : "loading";
  const cityOptionsStatus: WallOptionsStatus =
    wallReady && placesReady ? "ready" : wallFailed || placesFailed ? "failed" : "loading";

  // El catálogo de entidades solo hace falta para filtrar por ciudad.
  const needsPlaces = filters.municipalityId !== null;
  const resultsFailed = wallFailed || (needsPlaces && placesFailed);
  const resultsReady = wallReady && (!needsPlaces || placesReady);

  const loadMorePqrs = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/pqr?page=${page}&limit=10`);
      const data = await response.json();

      if (data.pqrs && data.pqrs.length > 0) {
        setPqrs(prev => [...prev, ...data.pqrs]);
        setPage(prev => prev + 1);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more PQRS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (resultsFailed) {
      return (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p>No se pudo cargar todo el muro. Sin él, los resultados estarían incompletos.</p>
          <Button variant="outline" size="sm" onClick={loadWholeWall}>
            Reintentar
          </Button>
        </div>
      );
    }

    // También antes de empezar a pedir: hasta que llega el muro entero no se
    // puede decir que no hay resultados.
    if (!resultsReady) {
      return (
        <div className="space-y-4" role="status">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando todo el muro…
          </p>
          {[0, 1, 2].map((index) => (
            <PQRSkeleton key={index} />
          ))}
        </div>
      );
    }

    return (
      <>
        {wholeWall.wallStatus === "truncated" && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              El muro tiene más de {wholeWall.pqrs.length} PQRSD. La búsqueda y los filtros
              miran solo las {wholeWall.pqrs.length} más recientes.
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              {results.length === 1
                ? "1 PQRSD encontrada"
                : `${results.length} PQRSD encontradas`}
            </p>
            {results.map((pqr) => (
              <PQRCard
                key={pqr.id}
                pqr={pqr}
                initialLiked={pqr.likes?.length > 0}
                user={currentUser || null}
                isUserProfile={false}
              />
            ))}
          </>
        ) : (
          <div className="space-y-4 py-12 text-center">
            <p className="text-muted-foreground">
              Ninguna PQRSD del muro coincide con la búsqueda y los filtros.
            </p>
            <Button variant="outline" onClick={() => setFilters(EMPTY_WALL_FILTERS)}>
              Quitar filtros
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <WallFiltersBar
        filters={filters}
        onChange={setFilters}
        entityOptions={entityOptions}
        entityOptionsStatus={entityOptionsStatus}
        cityOptions={cityOptions}
        cityOptionsStatus={cityOptionsStatus}
        onNeedOptions={loadWholeWall}
      />

      {filtering ? renderResults() : (
        <>
          {pqrs.map((pqr) => (
            <PQRCard
              key={pqr.id}
              pqr={pqr}
              initialLiked={pqr.likes?.length > 0}
              user={currentUser || null}
              isUserProfile={false}
            />
          ))}

          {pqrs.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay PQRSD para mostrar</p>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMorePqrs}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Mostrar más'
                )}
              </Button>
            </div>
          )}

          {!hasMore && pqrs.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay más PQRSD para mostrar</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
