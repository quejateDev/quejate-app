import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const currentUserId = await getUserIdFromToken();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lawyerUserId = searchParams.get('lawyerId');

    if (!lawyerUserId) {
      return NextResponse.json(
        { error: "Se requiere el ID del abogado" },
        { status: 400 }
      );
    }

    const lawyer = await prisma.lawyer.findUnique({
      where: { userId: lawyerUserId }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "Abogado no encontrado" },
        { status: 404 }
      );
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        lawyerId: lawyer.id,
        clientId: currentUserId
      }
    });

    return NextResponse.json({
      rating: existingRating
    }, { status: 200 });

  } catch (error) {
    console.error("Error al obtener la calificación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
