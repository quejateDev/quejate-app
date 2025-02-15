"use client";

import { useEffect } from "react";
import { PQRCard } from "@/components/PQRCard";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { FollowButton } from "@/components/FollowButton";
import { FollowStats } from "@/components/FollowStats";
import { useParams } from "next/navigation";
import UseUser from "@/hooks/useUser";
import usePQR from "@/hooks/usePQR";

export default function ProfilePage() {
  const { user: currentUser } = useAuthStore();
  const params = useParams();
  const { id } = params;
  const { user: userProfile, fetchUser, setUser: setUserProfile, isLoading } = UseUser();
  const { pqrs, fetchUserPQRS } = usePQR();

  useEffect(() => {
    if (!id) return;

    fetchUser(id as string);
    fetchUserPQRS(id as string);
  }, [id, fetchUser, fetchUserPQRS]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userProfile.id;

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback>
                  <UserCircle className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                @{userProfile.username}
              </p>

              {!isOwnProfile && (
                <div className="mt-4">
                  <FollowButton
                    userId={userProfile.id}
                    isFollowing={userProfile.followers.some(follower => follower.id === currentUser?.id)}
                    onFollowChange={(isFollowing, counts) => {
                      setUserProfile(prev => {
                        if (!prev) return prev;
                        
                        const updatedFollowers = isFollowing
                          ? [...prev.followers, { id: currentUser?.id || '', username: currentUser?.name || '', firstName: '', lastName: '' }]
                          : prev.followers.filter(f => f.id !== currentUser?.id);
                        
                        return {
                          ...prev,
                          followers: updatedFollowers,
                          _count: {
                            ...prev._count,
                            ...counts
                          }
                        };
                      });
                    }}
                  />
                </div>
              )}

              <FollowStats
                followers={userProfile.followers}
                following={userProfile.following}
              />

              <div className="mt-4 text-sm text-muted-foreground">
                <p>{userProfile._count.PQRS} PQRs publicadas</p>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-8">
          <h3 className="text-lg font-semibold mb-4">PQRs Recientes</h3>
          <div className="space-y-4">
            {pqrs?.length && pqrs.length > 0 ? (
              // @ts-ignore
              pqrs?.map((pqr) => <PQRCard key={pqr.id} pqr={pqr} />)
            ) : (
              <p className="text-muted-foreground">No hay PQRs publicadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
