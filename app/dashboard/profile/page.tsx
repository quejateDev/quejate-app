'use client';

import { useEffect, useState } from 'react';
import { PQRCard } from '@/components/pqr/PQRCard';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Scale, ArrowRight, Edit2 } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import usePQR from '@/hooks/usePQR';
import useUser from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import FavoritesSidebar from '@/components/sidebars/FavoriteEntitiesSidebar';
import { PQRSkeleton } from '@/components/pqr/pqr-skeleton';
import { UserProfileEditModal, UserProfileUpdateData } from '@/components/forms/UserProfileEdit';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user: currentUser } = useAuthStore();
  const { pqrs, fetchUserPQRS, isLoading: pqrsLoading } = usePQR();
  const { user: userProfile, fetchUser, isLoading: userLoading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserPQRS(currentUser.id);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUser(currentUser.id);
    }
  }, [currentUser]);

  const isOwnProfile = userProfile ? userProfile.id === currentUser?.id : false;

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updateData: UserProfileUpdateData): Promise<boolean> => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "No se puede actualizar el perfil",
        variant: "destructive",
      });
      return false;
    }

    try {
      
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.error || 'Error al actualizar el perfil');
      }

      const responseData = await response.json();
      
      toast({
        title: 'Éxito',
        description: 'Perfil actualizado correctamente',
      });
      
      window.location.reload();

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getFullName = () => {
    if (!userProfile) return '';
    return `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Por favor inicia sesión para ver tu perfil</p>
      </div>
    );
  }

  const renderPQRSContent = () => {
    if (pqrsLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <PQRSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (pqrs.length > 0) {
      return (
        <div className="space-y-4">
          {pqrs.map((pqr) => (
            //@ts-ignore
            <PQRCard key={pqr.id} pqr={pqr} user={userProfile || null} initialLiked={pqr.likes?.some((like) => like.userId === currentUser?.id)} isUserProfile={isOwnProfile} />
          ))}
        </div>
      );
    }

    return (
      <p className="text-muted-foreground">Aún no has creado ninguna PQRSD</p>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="sticky top-4 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-between items-start mb-4">
                  <div></div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditProfile}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
                <div className="mx-auto mb-6 w-32 h-32">
                  <Avatar className="h-32 w-32 border-2 border-primary">
                    <AvatarImage src={userProfile?.profilePicture || ""} alt={getFullName()} />
                    <AvatarFallback className="bg-muted-foreground/10">
                      <User className="h-16 w-16 stroke-1" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-2xl font-semibold">{getFullName()}</h2>
                <p className="text-sm text-muted-foreground break-words px-4">
                  {currentUser?.email}
                </p>
              </CardHeader>
            </Card>
            
            <FavoritesSidebar 
              userId={currentUser?.id || ''} 
              className="w-full"
            />

            {userProfile?.role !== 'LAWYER' && !userLoading && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Scale className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">¿Eres Abogado?</h3>
                  <p className="text-sm text-muted-foreground">
                    Regístrate como abogado para ofrecer tus servicios profesionales en nuestra plataforma y ayudar a usuarios con sus PQRSD.
                  </p>
                  <div className="pt-4">
                    <Link href="/lawyer/register">
                      <Button className="w-full" variant="default">
                        Registrarme como Abogado
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
        <div className="md:col-span-8">
          <h3 className="text-lg font-semibold mb-4">Mis PQRSD Recientes</h3>
          {renderPQRSContent()}
        </div>
      </div>
      
      <UserProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={userProfile || undefined}
      />
    </div>
  );
}