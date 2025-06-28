"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PQRCard } from "@/components/pqr/PQRCard";
import usePQR from "@/hooks/usePQR";
import useUser from "@/hooks/useUser";
import useAuthStore from "@/store/useAuthStore";

export default function ProfilePQRPage() {
  const { id } = useParams();
  const { pqr, fetchPQR, isSingleLoading } = usePQR();
  const { user: userProfile, fetchUser } = useUser();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchPQR(id as string);
    }
  }, [id]);

  useEffect(() => {
    if (pqr?.creator?.id) {
      fetchUser(pqr.creator.id);
    }
  }, [pqr?.creator?.id]);

  if (isSingleLoading || !pqr) {
    return <div className="container mx-auto p-4">Cargando PQRSD...</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <PQRCard
        pqr={{
            ...pqr,
            entity: (pqr as any).entity ?? null,
            attachments: (pqr as any).attachments ?? [],
            comments: (pqr as any).comments ?? [],
            _count: (pqr as any)._count ?? {},
        }}
        user={
            currentUser && typeof currentUser.id === "string" && currentUser.id
            ? {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                profilePicture: currentUser.profilePicture,
                }
            : null
        }
        isUserProfile={false}
        />
    </div>
  );
}