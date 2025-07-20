import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const currentUserId = await getUserIdFromToken();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { ratingId, score, comment } = await request.json();

    if (!ratingId) {
      return NextResponse.json(
        { error: "Se requiere el ID de la calificación" },
        { status: 400 }
      );
    }

    if (!score || score < 1 || score > 5) {
      return NextResponse.json(
        { error: "La calificación debe estar entre 1 y 5" },
        { status: 400 }
      );
    }

    const existingRating = await prisma.rating.findUnique({
      where: { id: ratingId },
      include: { lawyer: true }
    });

    if (!existingRating) {
      return NextResponse.json(
        { error: "Calificación no encontrada" },
        { status: 404 }
      );
    }

    if (existingRating.clientId !== currentUserId) {
      return NextResponse.json(
        { error: "No autorizado para modificar esta calificación" },
        { status: 403 }
      );
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        score,
        comment: comment || null
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    });

    return NextResponse.json(updatedRating, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar la calificación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
