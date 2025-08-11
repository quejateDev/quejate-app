import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const topPQRs = await prisma.pQRS.findMany({
      take: 3,
      orderBy: {
        likes: {
          _count: 'desc'
        },
      },
      include: {
        department: {
          include: {
            entity: true,
          },
        },
        customFieldValues: true,
        creator: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(topPQRs);
  } catch (error) {
    console.error("Error fetching top PQRs:", error);
    return NextResponse.json(
      { error: "Error fetching top PQRs" },
      { status: 500 }
    );
  }
}
