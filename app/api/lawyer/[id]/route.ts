import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;

    const [lawyer, ratingAggregate] = await Promise.all([
      prisma.lawyer.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: true,
              email: true,
              isVerified: true
            }
          }
        }
      }),
      prisma.rating.aggregate({
        where: { lawyerId: id },
        _avg: { score: true },
        _count: true
      })
    ]);

    if (!lawyer) {
      return NextResponse.json(
        { error: "Abogado no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...lawyer,
      averageRating: ratingAggregate._avg.score || 0,
      ratingCount: ratingAggregate._count
    });

  } catch (error) {
    console.error("Error fetching lawyer profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del abogado" },
      { status: 500 }
    );
  }
}