"use client";

import { useEffect } from "react";
import { PQRCard } from "@/components/pqr/PQRCard";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { FollowButton } from "@/components/Buttons/FollowButton";
import { FollowStats } from "@/components/FollowStats";
import { useParams, useSearchParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import usePQR from "@/hooks/usePQR";

export default function ProfilePage() {
  const { user: currentUser } = useAuthStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const { user: userProfile, fetchUser, setUser: setUserProfile, isLoading } = useUser();
  const { pqrs, fetchUserPQRS } = usePQR();

  useEffect(() => {
    if (!id) return;

    fetchUser(id as string);
    fetchUserPQRS(id as string);
  }, [id]);

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
  const pqrsdId = searchParams.get("pqrsd");
  const filteredPqrs = pqrsdId
    ? pqrs?.filter((pqr) => pqr.id === pqrsdId && !pqr.anonymous)
    : pqrs?.filter((pqr) => !pqr.anonymous);

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center justify-center text-center">
                <Avatar className="h-28 w-28 border-2 border-muted">
                  {userProfile?.profilePicture ? (
                    <AvatarImage src={userProfile.profilePicture} alt={userProfile.firstName} />
                  ) : null}
                  <AvatarFallback className="bg-muted-foreground/10">
                    {<User className="h-16 w-16 stroke-1" />}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold mt-4">
                  {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @{userProfile.email}
                </p>
              </div>
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
                <p>{userProfile._count.PQRS} PQRSD publicadas</p>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-8">
          <h3 className="text-lg font-semibold mb-4">PQRSD Recientes</h3>
          <div className="space-y-4">
            {filteredPqrs?.length && filteredPqrs.length > 0 ? (
              filteredPqrs.map((pqr) => {
                const safeUser =
                  currentUser && typeof currentUser.id === "string" && currentUser.id
                    ? {
                        id: currentUser.id,
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        profilePicture: currentUser.profilePicture,
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
                    isUserProfile={isOwnProfile}
                  />
                );
              })
            ) : (
              <p className="text-muted-foreground">No hay PQRSD publicadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}