"use client";

import { getPQRSById, getPQRSByUser } from "@/services/api/pqr.service";
import { useState } from "react";
import { getGetPQRDTO } from "@/dto/pqr.dto";

export default function usePQR() {
  const [pqr, setPqr] = useState<getGetPQRDTO>();
  const [pqrs, setPqrs] = useState<getGetPQRDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSingleLoading, setIsSingleLoading] = useState(false);

  async function fetchPQR(id: string) {
    setIsSingleLoading(true);
    try {
      const data = await getPQRSById(id);
      setPqr(data);
    } catch (error) {
      console.error("Error fetching PQR:", error);
    } finally {
      setIsSingleLoading(false);
    }
  }

  async function fetchUserPQRS(id: string) {
    setIsLoading(true);
    try {
      const response = await getPQRSByUser(id);
      setPqrs(response);
    } catch (error) {
      console.error("Error fetching user PQRs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    fetchPQR,
    fetchUserPQRS,
    pqr,
    pqrs,
    isLoading, 
    isSingleLoading 
  };
}