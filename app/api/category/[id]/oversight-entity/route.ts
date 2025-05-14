import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de categoría no proporcionado" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        oversightEntity: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    if (!category.oversightEntity) {
      return NextResponse.json(
        { message: "No hay ente de control asociado a esta categoría" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      oversightEntity: category.oversightEntity
    });
  } catch (error) {
    console.error("Error al obtener ente de control:", error);
    return NextResponse.json(
      { error: "Error al obtener ente de control" },
      { status: 500 }
    );
  }
}