import { NextRequest, NextResponse } from "next/server";
import  prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentUserId = await currentUser();

    const notifications = await prisma.notification.findMany({
      where: {
        userId: currentUserId?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error fetching notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {

    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { notificationId } = await req.json();

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: currentUserId.id,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Error marking notification as read" },
      { status: 500 }
    );
  }
}
