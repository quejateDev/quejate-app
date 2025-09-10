"use client";

import { getPQRSById, getPQRSByUser } from "@/services/api/pqr.service";
import { useState, useCallback } from "react";
import { PQR } from "@/types/pqrsd";

export default function usePQR() {
  const [pqr, setPqr] = useState<PQR>();
  const [pqrs, setPqrs] = useState<PQR[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSingleLoading, setIsSingleLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    updatePQRStatus,
    pqr,
    pqrs,
    isLoading, 
    isLoadingMore,
    isSingleLoading,
    hasMore,
    page
  };
}