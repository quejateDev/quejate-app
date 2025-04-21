"use client";

import useUser from "@/hooks/useUser";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { PQRCard } from "../pqr/PQRCard";
import { PQR } from "@/types/pqrsd";

interface PQRListProps {
  pqrs: PQR[];
}

export default function PQRList({ pqrs }: PQRListProps) {
  const { user: authUser } = useAuthStore();
  const { user: currentUser, fetchUser, isLoading } = useUser();

  useEffect(() => {
    if (authUser?.id) {
      fetchUser(authUser.id);
    }
  }, [authUser]);

  if (isLoading && authUser) return <p className="text-center">Cargando...</p>;

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