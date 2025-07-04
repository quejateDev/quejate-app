import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET( request: NextRequest, { params }: any) {
  try {
    const { id: userId } = await params;
    const currentUserId = await getUserIdFromToken();

    if (!currentUserId) {
        return NextResponse.json(
          { error: "No autorizado, inicie sesión nuevamente" },
          { status: 401 }
        );
      }

    const favorites = await prisma.userFavoriteEntity.findMany({
      where: { userId },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            isVerified: true,
            category: {
              select: {
                name: true
              }
            },
            Municipality: {
              select: {
                name: true,
                RegionalDepartment: {
                  select: {
                    name: true
                  }
                }
              }
            },
            _count: {
              select: {
                pqrs: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(favorites.map(fav => fav.entity));

  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

export async function POST( request: NextRequest, { params }: any) {
  try {
    const { id: userId } = await params;
    const currentUserId = await getUserIdFromToken();
    const { entityId } = await request.json();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado, inicie sesión nuevamente" },
        { status: 401 }
      );
    }

    const existingFavorite = await prisma.userFavoriteEntity.findFirst({
      where: {
        userId,
        entityId
      }
    });

    if (existingFavorite) {
      await prisma.userFavoriteEntity.delete({
        where: { id: existingFavorite.id }
      });
      return NextResponse.json({ 
        message: "Entidad eliminada de favoritos",
        isFavorite: false 
      });
    } else {
      await prisma.userFavoriteEntity.create({
        data: {
          userId,
          entityId
        }
      });
      return NextResponse.json({ 
        message: "Entidad añadida a favoritos",
        isFavorite: true 
      });
    }

  } catch (error) {
    console.error("Error updating favorites:", error);
    return NextResponse.json(
      { error: "Error al actualizar favoritos" },
      { status: 500 }
    );
  }
}