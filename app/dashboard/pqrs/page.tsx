'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { PQRCard } from '@/components/PQRCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getGetPQRDTO } from '@/dto/pqr.dto';

export default function UserPQRs() {
  const [pqrs, setPqrs] = useState<getGetPQRDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchUserPQRs = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/pqr/user?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPqrs(data);
        }
      } catch (error) {
        console.error('Error fetching user PQRs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPQRs();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Mis Quejas y Reclamos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pqrs.length === 0) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pqrs.map((pqr) => (
          <PQRCard
            key={pqr.id}
            // @ts-ignore
            pqr={pqr}
            initialLiked={pqr.likes.some((like) => like.userId === user?.id)}
          />
        ))}
      </div>
    </div>
  );
}
