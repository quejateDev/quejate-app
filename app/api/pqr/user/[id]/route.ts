import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(request: Request, params: any) {
  try {
    const { id: requestedUserId } = await params.params;

    if (!requestedUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const currentUserId = await getUserIdFromToken();
    const isOwnProfile = currentUserId === requestedUserId;

    const userPQRs = await prisma.pQRS.findMany({
      where: {
        creatorId: requestedUserId,
        private: isOwnProfile ? undefined : false
      },      
      include: {
        likes: true,
        attachments: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true
              }
            }
          }
        },
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
        entity: true,
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