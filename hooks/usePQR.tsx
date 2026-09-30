"use client";

import { getPQRSById, getPQRSByUser } from "@/services/api/pqr.service";
import { useState, useCallback } from "react";
import { PQR } from "@/types/pqrsd";

/**
 * Tamaño de página de `fetchAllUserPQRS`: el mayor que acepta
 * `GET /pqr/user/:id` (`PQR_MAX_PAGE_SIZE` en el backend; por encima, 400).
 */
const ALL_PQRS_PAGE_SIZE = 50;

/**
 * Tope de páginas de `fetchAllUserPQRS`, es decir, 500 PQRSD. La cuenta con
 * más tenía 30 el 30/09/2026: hoy basta una petición.
 */
const ALL_PQRS_MAX_PAGES = 10;

/**
 * Estado de `fetchAllUserPQRS`. `"truncated"`: el usuario tiene más de las que
 * se piden, y la lista trae las más recientes. `"failed"`: falló una página y
 * no se publicó nada.
 */
export type AllPQRSStatus = "idle" | "loading" | "complete" | "truncated" | "failed";

export default function usePQR() {
  const [pqr, setPqr] = useState<PQR>();
  const [pqrs, setPqrs] = useState<PQR[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSingleLoading, setIsSingleLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allPQRSStatus, setAllPQRSStatus] = useState<AllPQRSStatus>("idle");

  const fetchPQR = useCallback(async function(id: string) {
    setIsSingleLoading(true);
    try {
      const data = await getPQRSById(id);
      setPqr(data);
    } catch (error) {
      console.error("Error fetching PQR:", error);
    } finally {
      setIsSingleLoading(false);
    }
  }, []);

  const fetchUserPQRS = useCallback(async function(id: string, pageNum: number = 1, limit: number = 10) {
    const loadingState = pageNum === 1 ? setIsLoading : setIsLoadingMore;
    
    loadingState(true);
    try {
      const response = await getPQRSByUser(id, pageNum, limit);
      if (pageNum === 1) {
        setPqrs(response.pqrs);
      } else {
        setPqrs(prev => [...prev, ...response.pqrs]);
      }
      setHasMore(response.hasMore);
      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error fetching user PQRs:", error);
    } finally {
      loadingState(false);
    }
  }, []);

  /**
   * Todas las PQRSD de un usuario, para filtrarlas en el navegador (P-09).
   *
   * Un filtro en el cliente solo es correcto sobre la lista completa (A-31),
   * así que se piden páginas hasta `hasMore: false` y la lista se publica de
   * una vez, al final. Si falla una página no se publica nada: filtrada a
   * medias, la pantalla diría «no tienes» de lo que sí hay.
   *
   * `fetchUserPQRS` sigue como estaba: la usa el perfil público.
   */
  const fetchAllUserPQRS = useCallback(async function(id: string) {
    setAllPQRSStatus("loading");
    try {
      const byId = new Map<string, PQR>();
      let serverHasMore = true;
      for (let pageNum = 1; serverHasMore && pageNum <= ALL_PQRS_MAX_PAGES; pageNum++) {
        const response = await getPQRSByUser(id, pageNum, ALL_PQRS_PAGE_SIZE);
        // La paginación es por desplazamiento: si se radica una entre dos
        // páginas, la última de una vuelve al principio de la siguiente.
        for (const item of response.pqrs as PQR[]) {
          if (!byId.has(item.id)) byId.set(item.id, item);
        }
        serverHasMore = response.hasMore;
      }
      setPqrs(Array.from(byId.values()));
      setAllPQRSStatus(serverHasMore ? "truncated" : "complete");
    } catch (error) {
      console.error("Error fetching all user PQRs:", error);
      setAllPQRSStatus("failed");
    }
  }, []);

  const updatePQRStatus = useCallback(function(pqrId: string, newStatus: keyof typeof import("@/constants/pqrMaps").statusMap) {
    setPqrs(prev => 
      prev.map(pqr => 
        pqr.id === pqrId 
          ? { ...pqr, status: newStatus }
          : pqr
      )
    );
  }, []);

  return {
    fetchPQR,
    fetchUserPQRS,
    fetchAllUserPQRS,
    updatePQRStatus,
    pqr,
    pqrs,
    isLoading, 
    isLoadingMore,
    isSingleLoading,
    hasMore,
    page,
    allPQRSStatus
  };
}