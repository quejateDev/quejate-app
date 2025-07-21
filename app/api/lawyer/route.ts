import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const lawyers = await prisma.lawyer.findMany({
      where: {
        user: {
          isActive: true,
          role: 'LAWYER'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            email: true,
            phone: true,
            isVerified: true
          }
        },
        receivedRatings: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedLawyers = lawyers.map(lawyer => {
      const ratingCount = lawyer.receivedRatings.length;
      const averageRating = ratingCount > 0 
        ? lawyer.receivedRatings.reduce((sum, rating) => sum + rating.score, 0) / ratingCount
        : 0;

      return {
        id: lawyer.id,
        userId: lawyer.userId,
        specialties: lawyer.specialties,
        description: lawyer.description,
        feePerHour: lawyer.feePerHour,
        feePerService: lawyer.feePerService,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingCount,
        user: lawyer.user,
        createdAt: lawyer.createdAt
      };
    });

    return NextResponse.json(formattedLawyers);

  } catch (error) {
    console.error("Error fetching lawyers list:", error);
    return NextResponse.json(
      { error: "Error al obtener el listado de abogados" },
      { status: 500 }
    );
  }
}