
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { User } from "@/types/user";

export async function getUserIdFromToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie?.value) return null;

  try {
    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        role: true,
        followers: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            PQRS: true
          }
        }
      }
    });

    if (!user) return null;

    let isFollowing = false;
    if (userId) {
      const followCheck = await prisma.user.findFirst({
        where: {
          id: userId,
          following: {
            some: {
              id: user.id
            }
          }
        }
      });
      isFollowing = !!followCheck;
    }

    return {
      ...user,
      isFollowing
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

