'use client';

import { useEffect, useRef, useState } from 'react';
import { PQRCard } from '@/components/pqr/PQRCard';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, Scale, ArrowRight } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import usePQR from '@/hooks/usePQR';
import useUser from '@/hooks/useUser';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import FavoritesSidebar from '@/components/sidebars/FavoriteEntitiesSidebar';
import { PQRSkeleton } from '@/components/pqr/pqr-skeleton';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user: currentUser } = useAuthStore();
  const { pqrs, fetchUserPQRS, isLoading: pqrsLoading } = usePQR();
  const { user: userProfile, fetchUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (!currentUser?.id) return;
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }
  
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.path || uploadData.url;
  
      if (!imageUrl) {
        throw new Error('No se recibió URL de la imagen');
      }

      const updateResponse = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture: imageUrl }),
      });
      const updateData = await updateResponse.json();
      console.log('Update response:', updateData);
      if (!updateResponse.ok) {
        throw new Error(updateData.error || 'Error al actualizar el perfil');
      }
      await Promise.all([
        fetchUser(currentUser.id),
        fetchUserPQRS(currentUser.id)
      ]);
      toast({
        title: 'Éxito',
        description: 'Foto de perfil actualizada correctamente',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Ocurrió un error',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
          <Card className='mb-6'>
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-6 w-32 h-32 group">
                <Avatar className="h-32 w-32 border-2 border-primary">
                  {userProfile?.profilePicture ? (
                    <AvatarImage src={userProfile.profilePicture} alt={getFullName()} />
                  ) : null}
                  <AvatarFallback className="bg-muted-foreground/10">
                    {<User className="h-16 w-16 stroke-1" />}
                  </AvatarFallback>
                </Avatar>
                <div 
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  <div className="text-white flex flex-col items-center">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">Cambiar foto</span>
                  </div>
                </div>
                <Input 
                  ref={fileInputRef}
                  id="profile-picture" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <span className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-white"></span>
                  </div>
                )}
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

          {userProfile?.role !== 'LAWYER' && (
            <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
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
        <div className="md:col-span-8">
          <h3 className="text-lg font-semibold mb-4">Mis PQRSD Recientes</h3>
          {renderPQRSContent()}
        </div>
      </div>
    </div>
  );
}