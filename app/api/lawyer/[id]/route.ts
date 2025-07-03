import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;

    const lawyer = await prisma.lawyer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
            email: true
          }
        },
        receivedRatings: true
      }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "Abogado no encontrado" },
        { status: 404 }
      );
    }

    const averageRating = lawyer.receivedRatings.length > 0 
      ? lawyer.receivedRatings.reduce((sum, rating) => sum + rating.score, 0) / lawyer.receivedRatings.length
      : 0;

    return NextResponse.json({
      ...lawyer,
      averageRating,
      ratingCount: lawyer.receivedRatings.length
    });

  } catch (error) {
    console.error("Error fetching lawyer profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del abogado" },
      { status: 500 }
    );
  }
}