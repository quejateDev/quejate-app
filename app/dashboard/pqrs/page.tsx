'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { PQRCard } from '@/components/pqr/PQRCard';
import { PQRSkeleton } from '@/components/pqr/pqr-skeleton';
import { getGetPQRDTO } from '@/dto/pqr.dto';

export default function UserPQRs() {
  const [pqrs, setPqrs] = useState<getGetPQRDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchUserPQRs();
  }, [user?.id]);

  async function fetchUserPQRs() {
    try {
      if (!user?.id) return;
      setLoading(true);
      const response = await fetch(`/api/pqr/user?userId=${user?.id}`);
      const data = await response.json();
      setPqrs(data);
    } catch (error) {
      console.error('Error fetching user PQRs:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Mis Quejas y Reclamos</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <PQRSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!pqrs || pqrs?.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Mis Quejas y Reclamos</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">No has creado ninguna queja o reclamo aún.</p>
        </div>
      </div>
    );
  }

  return (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Mis Quejas y Reclamos</h1>
    <div className="space-y-6">
      {pqrs.map((pqr) => {
        const safeUser =
          user && typeof user.id === "string" && user.id
            ? {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
              }
            : null;

        const safePqr = {
          ...pqr,
          entity: (pqr as any).entity ?? null,
          attachments: (pqr as any).attachments ?? [],
          comments: (pqr as any).comments ?? [],
          _count: (pqr as any)._count ?? {},
        };

        return (
          <PQRCard
            key={pqr.id}
            pqr={safePqr}
            user={safeUser}
            initialLiked={pqr.likes.some((like) => like.userId === user?.id)}
          />
        );
      })}
    </div>
  </div>
);
}