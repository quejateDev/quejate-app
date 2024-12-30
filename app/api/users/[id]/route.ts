import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Get auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-storage');
    const currentUser = authCookie ? JSON.parse(authCookie.value).state.user : null;
    const currentUserId = currentUser?.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        followers: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            PQRS: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Check if the current user is following this user
    let isFollowing = false;
    if (currentUserId) {
      const followCheck = await prisma.user.findFirst({
        where: {
          id: currentUserId,
          following: {
            some: {
              id: user.id,
            },
          },
        },
      });
      isFollowing = !!followCheck;
    }

    return NextResponse.json({ ...user, isFollowing });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del usuario" },
      { status: 500 }
    );
  }
}
