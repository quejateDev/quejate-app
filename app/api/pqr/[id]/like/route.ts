import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: any 
) {
  try {
    const { userId } = await request.json();
    const { id: pqrId } = await params;

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        pqrId_userId: {
          pqrId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like: Create new like
      await prisma.like.create({
        data: {
          pqr: {
            connect: {
              id: pqrId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    // Get updated like count
    const updatedPQR = await prisma.pQRS.findUnique({
      where: {
        id: pqrId,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
    });


    if (updatedPQR && !existingLike) {
      await prisma.notification.create({
        data: {
          type: "like",
          userId: updatedPQR?.creatorId,
          message: `A ${updatedPQR.creator.firstName} ${updatedPQR.creator.lastName} le gusta tu PQR`,
          data: {
            pqrId: pqrId,
            followerId: userId,
            followerName: `${userId}`,
            // followerImage: `${userId}`,
          },
        },
      });
    }

    return NextResponse.json({
      likes: updatedPQR?._count.likes || 0,
      liked: !existingLike,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Error toggling like" },
      { status: 500 }
    );
  }
}
