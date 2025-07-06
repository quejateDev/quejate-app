import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const currentUser = await verifyToken(token);

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if already following
    const existingFollow = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        // @ts-ignore
        following: {
          some: {
            id,
          },
        },
      },
    });

    let updatedUser;
    if (existingFollow) {
      // Unfollow
      updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          // @ts-ignore
          following: {
            disconnect: { id },
          },
        },
      });
    } else {
      // Follow
      updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          // @ts-ignore
          following: {
            connect: { id },
          },
        },
      });
    }

    // Get updated counts
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            // @ts-ignore
            followers: true,
            following: true,
            PQRS: true,
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: id,
        type: "follow",
        message: `${updatedUser?.firstName} ha comenzado a seguirte`,
        data: {
          followerId: updatedUser?.id,
          followerName: updatedUser?.firstName + " " + updatedUser?.lastName,
          followerImage: updatedUser?.profilePicture || null,
        },
      },
    });

    return NextResponse.json({
      followed: !existingFollow,
      // @ts-ignore
      counts: targetUser?._count,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Error following user" },
      { status: 500 }
    );
  }
}
