import { NextRequest, NextResponse } from "next/server";
import  prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { NotificationFactory } from "@/services/api/notification.service";

export async function GET(req: NextRequest) {
  try {
    const currentUserData = await currentUser();

    if (!currentUserData) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const expiredPQRS = await prisma.pQRS.findMany({
      where: {
        creatorId: currentUserData.id,
        dueDate: { lt: new Date() },
        status: 'PENDING',
      },
      select: {
        id: true,
        subject: true,
      }
    });

    for (const pqr of expiredPQRS) {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: currentUserData.id,
          type: 'pqrsd_time_expired',
          data: {
            path: ['pqrId'],
            equals: pqr.id
          }
        }
      });

      if (!existingNotification && pqr.subject) {
        const notificationInput = NotificationFactory.createPQRSDTimeExpired(
          currentUserData.id!,
          pqr.id,
          pqr.subject
        );
        await prisma.notification.create({ data: notificationInput });
      }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: currentUserData.id,
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
