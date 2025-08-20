import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET(request: Request, params: any) {
  try {
    const { id: requestedUserId } = await params.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

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
        _count: {
          select: {
            likes: true,
            comments: true
          },
        },
        department: {
          select: {
            id: true,
            name: true,
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
      skip,
      take,
    });

    const totalCount = await prisma.pQRS.count({
      where: {
        creatorId: requestedUserId,
        private: isOwnProfile ? undefined : false
      }
    });

    const hasMore = skip + take < totalCount;

    return NextResponse.json({
      pqrs: userPQRs,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
      totalCount
    });

  } catch (error) {
    console.error("Error fetching user PQRs:", error);
    return NextResponse.json(
      { error: "Error fetching user PQRs" },
      { status: 500 }
    );
  }
}