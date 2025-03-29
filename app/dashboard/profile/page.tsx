'use client';

import { useEffect } from 'react';
import { PQRCard } from '@/components/pqr/PQRCard';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import usePQR from '@/hooks/usePQR';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { pqrs, fetchUserPQRS } = usePQR();

  useEffect(() => {
    if (user?.id) {
      fetchUserPQRS(user.id);
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Por favor inicia sesión para ver tu perfil</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                {/* <AvatarImage src={user?.image || ''} alt={session.user?.name || ''} /> */}
                <AvatarFallback>
                  <UserCircle className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-8">
          <h3 className="text-lg font-semibold mb-4">Mis PQRSD Recientes</h3>
          <div className="space-y-4">
            {pqrs.length > 0 ? (
              pqrs
                ?.filter(pqr => !pqr.anonymous)
                .map((pqr) => (
                  //@ts-ignore
                  <PQRCard key={pqr.id} pqr={pqr} />
                ))
            ) : (
              <p className="text-muted-foreground">Aún no has creado ninguna PQRSD</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
