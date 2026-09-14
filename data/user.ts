import prisma from "@/lib/prisma";
import { UserWithFollowingStatus } from "@/types/user-with-following";
import type { SidebarUser } from "@/types/sidebar-user";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        return null;
    }   
}

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        return null;
    }   
}

/**
 * 🔴 **H-24.** Pide solo los cinco campos que pinta la barra lateral. Antes era
 * `include` sin `select`, que devuelve la fila entera —hash de la contraseña
 * incluido— y el muro es público. Ver `types/sidebar-user.ts`.
 */
export async function getUsersForSidebar(
  currentUserId?: string
): Promise<{
  topUsers: SidebarUser[];
  discoverUsers: SidebarUser[];
}> {
  const allUsers = await prisma.user.findMany({
    where: {
      emailVerified: { not: null },
      role: "CLIENT"
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: { select: { PQRS: true, followers: true, following: true } },
    },
  });

  // A quién sigue quien mira se pide aparte y solo sus ids: antes salía de
  // cargar las listas de seguidores y seguidos de TODOS los usuarios.
  let followingIds: string[] = [];
  if (currentUserId) {
    const viewer = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { following: { select: { id: true } } },
    });
    followingIds = viewer?.following.map(f => f.id) ?? [];
  }

  const allUsersWithFollowing: SidebarUser[] = allUsers.map(u => ({
    ...u,
    isFollowing: followingIds.includes(u.id)
  }));

  const sortedByPQRS = [...allUsersWithFollowing].sort(
    (a, b) => (b._count?.PQRS || 0) - (a._count?.PQRS || 0)
  );
  const topUsers = sortedByPQRS.slice(0, 5);

  let discoverUsers = currentUserId
    ? allUsersWithFollowing.filter(
        u => u.id !== currentUserId && !followingIds.includes(u.id)
      )
    : allUsersWithFollowing;

  discoverUsers = discoverUsers
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return { topUsers, discoverUsers };
}

/**
 * El usuario de la sesión, para `UserProvider` (layout de todo `/dashboard`) y
 * para el muro.
 *
 * 🔴 **H-24, la otra mitad.** Traía también la fila completa y la entregaba a
 * un proveedor `"use client"`: el hash de la contraseña del propio usuario
 * viajaba a su navegador en cada página del panel ciudadano. No era de otros,
 * pero un hash no tiene nada que hacer fuera del servidor — lo lee una
 * extensión, un ordenador compartido o cualquier XSS.
 *
 * El `select` pide **exactamente** los campos que declara el tipo
 * (`UserBasic` + seguidores, seguidos y contadores). Sus consumidores leen
 * `id`, `name`, `email`, `image` y `role`; ninguno lee más.
 */
export async function getFullUserWithFollowingStatus(
  userId: string
): Promise<UserWithFollowingStatus | null> {
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      _count: { select: { PQRS: true, followers: true, following: true } },
      followers: { select: { id: true, name: true } },
      following: { select: { id: true, name: true } },
    },
  });

  if (!user) return null;

  return {
    ...user,
    isFollowing: false,
  };
}
