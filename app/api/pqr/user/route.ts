import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userPQRs = await prisma.pQRS.findMany({
      where: {
        creatorId: userId
      },
      include: {
        likes: true,
        _count: {
          select: {
            likes: true,
          },
        },
        department: {
          include: {
            entity: true,
          },
        },
        customFieldValues: true,
        creator: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(userPQRs);
  } catch (error) {
    console.error("Error fetching user PQRs:", error);
    return NextResponse.json(
      { error: "Error fetching user PQRs" },
      { status: 500 }
    );
  }
}
