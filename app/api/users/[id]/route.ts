import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const currentUserId = await getUserIdFromToken();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        followers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        following: {
          select: {
            id: true,
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

    return NextResponse.json({ 
      ...user,
      isFollowing 
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del usuario" },
      { status: 500 }
    );
  }

}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { profilePicture } = await request.json();
    const currentUserId = await getUserIdFromToken();;
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (currentUserId !== id) {
      return NextResponse.json(
        { error: "No tienes permiso para actualizar este perfil" },
        { status: 403 }
      );
    }

    if (!profilePicture || !isValidUrl(profilePicture)) {
      return NextResponse.json(
        { error: "URL de imagen no válida" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { profilePicture },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json(
      { error: "Error al actualizar la foto de perfil" },
      { status: 500 }
    );
  }
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}