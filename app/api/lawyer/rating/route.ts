import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { lawyerId, score, comment } = await request.json();

    if (currentUserId.id === lawyerId) {
      return NextResponse.json(
        { error: "No puedes calificarte a ti mismo" },
        { status: 400 }
      );
    }

    const lawyer = await prisma.lawyer.findUnique({
      where: { userId: lawyerId },
      include: { user: true }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "El abogado especificado no existe" },
        { status: 404 }
      );
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        lawyerId: lawyer.id,
        clientId: currentUserId.id
      }
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "Ya has calificado a este abogado" },
        { status: 400 }
      );
    }

    const newRating = await prisma.rating.create({
      data: {
        lawyerId: lawyer.id,
        clientId: currentUserId.id,
        score,
        comment
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newRating, { status: 201 });

  } catch (error) {
    console.error("Error al crear la calificación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lawyerUserId = searchParams.get('lawyerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    const [ratings, totalCount, averageScore] = await Promise.all([
      prisma.rating.findMany({
        where: { lawyerId: lawyer.id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.rating.count({
        where: { lawyerId: lawyer.id }
      }),
      prisma.rating.aggregate({
        where: { lawyerId: lawyer.id },
        _avg: { score: true }
      })
    ]);

    return NextResponse.json({
      data: ratings,
      averageScore: averageScore._avg.score,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}