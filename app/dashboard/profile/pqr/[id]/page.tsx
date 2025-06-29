'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { PQRCard } from '@/components/pqr/PQRCard';
import { PQRSkeleton } from '@/components/pqr/pqr-skeleton';
import { PQR } from '@/types/pqrsd';
import useUser from '@/hooks/useUser';

export default function PQRDetailPage() {
  const [pqr, setPqr] = useState<PQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuthStore();
  const { user: currentUser, fetchUser } = useUser();
  const { id } = useParams();

  useEffect(() => {
    fetchPQR();
    if (authUser?.id) {
      fetchUser(authUser.id);
    }
  }, [id, authUser?.id]);

  async function fetchPQR() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/pqr/${id}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Publicación no encontrada' : 'Error al cargar la publicación');
      }
      
      const data = await response.json();
      setPqr(data);
    } catch (err) {
      console.error('Error fetching PQR:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-6">
          <PQRSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!pqr) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No se pudo cargar la publicación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <PQRCard
          pqr={pqr}
          initialLiked={pqr.likes?.some((like) => like.userId === authUser?.id)}
          user={currentUser || null}
          isUserProfile={pqr.creator?.id === authUser?.id}
        />
      </div>
    </div>
  );
}