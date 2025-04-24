"use client";

import useAuthStore from "@/store/useAuthStore";
import { PQRCard } from "./PQRCard";
import { PQR } from "@/types/pqrsd";

interface PQRListProps {
  pqrs: PQR[];
}

export default function PQRList({ pqrs }: PQRListProps) {
  const { user: authUser } = useAuthStore();

  return (
    <div className="space-y-6">
      {pqrs.map((pqr) => (
        <PQRCard
          key={pqr.id}
          pqr={pqr}
          initialLiked={pqr.likes?.length > 0}
          user={authUser || null}
        />
      ))}
      {pqrs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay PQRSD para mostrar</p>
        </div>
      )}
    </div>
  );
}