"use client";


import { PQR } from "@/types/pqrsd";
import { UserBasic } from "@/types/user-basic";
import { PQRCard } from "../pqr/PQRCard";

interface PQRListProfileProps {
  pqrs: PQR[];
  currentUser: UserBasic | null;
  onUpdatePQRStatus: (pqrId: string, newStatus: keyof typeof import("@/constants/pqrMaps").statusMap) => void;
}

// Sin «Mostrar más»: la lista llega completa y ya filtrada (P-09).
export default function PQRListProfile({ 
  pqrs, 
  currentUser,
  onUpdatePQRStatus
}: PQRListProfileProps) {

  return (
    <div className="space-y-6">
      {pqrs.map((pqr) => (
        <PQRCard
          key={pqr.id}
          pqr={pqr}
          initialLiked={pqr.likes?.length > 0}
          user={currentUser || null}
          isUserProfile={true}
          onUpdatePQRStatus={onUpdatePQRStatus}
        />
      ))}
    </div>
  );
}