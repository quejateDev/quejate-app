import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET(request: Request, params: any) {
  try {
    const { id: requestedUserId } = await params.params;

    if (!requestedUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const currentUserId = await currentUser();
    const isOwnProfile = currentUserId?.id === requestedUserId;

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
                name: true,
                image: true
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
          select: {
            id: true,
            name: true,
            description: true,
            email: true,
            entityId: true,
          },
        },
        entity: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            imageUrl: true
          },
        },
        customFieldValues: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            
          }
        }
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