import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, params: any ) {
  try {
    const { id: userId } = await params.params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userPQRs = await prisma.pQRS.findMany({
      where: {
        creatorId: userId,
        private: false
      },
      include: {
        likes: true,
        attachments: true,
        comments: true,
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
