"use client";

import { PQRCard } from "./PQRCard";
import { PQR } from "@/types/pqrsd";
import { User } from "@/types/user";


interface PQRListProps {
  pqrs: PQR[];
  currentUser: User | null;
}

export default function PQRList({ pqrs, currentUser }: PQRListProps) {

  return (
    <div className="space-y-6">
      {pqrs.map((pqr) => (
        <PQRCard
          key={pqr.id}
          pqr={pqr}
          initialLiked={pqr.likes?.length > 0}
          user={currentUser || null}
          isUserProfile={false}
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