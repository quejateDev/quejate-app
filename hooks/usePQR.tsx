"use client";

import { getPQRSById, getPQRSByUser } from "@/services/api/pqr.service";
import { useState } from "react";
import { getGetPQRDTO } from "@/dto/pqr.dto";

export default function usePQR() {
  const [pqr, setPqr] = useState<getGetPQRDTO>();
  const [pqrs, setPqrs] = useState<getGetPQRDTO[]>([]);

  async function fetchPQR(id: string) {
    try {
      const data = await getPQRSById(id);
      setPqr(data);
    } catch (error) {
      console.error("Error fetching PQR:", error);
    }
  }

  async function fetchUserPQRS(id: string) {
    try {
      const response = await getPQRSByUser(id);
      setPqrs(response);
    } catch (error) {
      console.error("Error fetching user PQRs:", error);
    }
  }

  return {
    fetchPQR,
    fetchUserPQRS,
    pqr,
    pqrs
  };
}
