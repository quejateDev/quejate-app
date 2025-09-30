import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { NotificationFactory, notificationService } from "@/services/api/notification.service";

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

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if already following
    const existingFollow = await prisma.user.findFirst({
      where: {
        id: user.id,
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
        where: { id: user.id },
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
        where: { id: user.id },
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

    if (!existingFollow && updatedUser) {
      const notificationInput = NotificationFactory.createFollow(
        id,                   
        {               
          id: updatedUser.id,
          name: updatedUser.name,
          image: updatedUser.image || undefined,
        }
      );

      await notificationService.create(notificationInput);
    }

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
