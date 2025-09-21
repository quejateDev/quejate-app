import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import geoData from "@/data/colombia-geo.json";
import { currentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: userId } = await params;
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado, inicie sesión nuevamente" },
        { status: 401 }
      );
    }

    const departmentMap = new Map<string, string>();
    const municipalityMap = new Map<string, { name: string, departmentId: string }>();

    geoData.departments.forEach(dept => {
      departmentMap.set(dept.id, dept.name);
      dept.municipalities.forEach(mun => {
        municipalityMap.set(mun.id, {
          name: mun.name,
          departmentId: dept.id
        });
      });
    });

    const favorites = await prisma.userFavoriteEntity.findMany({
      where: { 
        userId,
        entity: {
          category: {
            isActive: true,
          },
        },
      },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            municipalityId: true,
            regionalDepartmentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = favorites.map((fav) => {
      const entity = fav.entity;
      const municipalityInfo = entity.municipalityId ? municipalityMap.get(entity.municipalityId) : null;
      
      const departmentName = entity.regionalDepartmentId 
        ? departmentMap.get(entity.regionalDepartmentId)
        : (municipalityInfo ? departmentMap.get(municipalityInfo.departmentId) : null);

      return {
        ...entity,
        municipality: municipalityInfo?.name || null,
        department: departmentName || null
      };
    });

    return NextResponse.json(result);
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
    const currentUserId = await currentUser();
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