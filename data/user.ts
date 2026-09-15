import prisma from "@/lib/prisma";
import { UserWithFollowingStatus } from "@/types/user-with-following";

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
