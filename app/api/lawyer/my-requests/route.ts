import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { LawyerRequestStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as LawyerRequestStatus | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const user = await prisma.user.findUnique({
      where: {
        id: currentUserId.id,
        isActive: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado o no tiene permisos" },
        { status: 403 }
      );
    }

    const whereConditions = {
      userId: currentUserId.id,
      ...(status && { status })
    };

    const [requests, totalCount] = await Promise.all([
      prisma.lawyerRequest.findMany({
        where: whereConditions,
        include: {
          lawyer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  profilePicture: true,
                  phone: true
                }
              },
              receivedRatings: {
                select: {
                  score: true
                }
              }
            }
          },
          pqr: {
            select: {
              id: true,
              subject: true,
              description: true
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.lawyerRequest.count({
        where: whereConditions
      })
    ]);

    return NextResponse.json({
      data: requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user lawyer requests:", error);
    return NextResponse.json(
      { error: "Error al obtener las solicitudes del usuario" },
      { status: 500 }
    );
  }
}
