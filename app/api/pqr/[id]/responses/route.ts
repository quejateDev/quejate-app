import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { sendPQRResponseEmail } from "@/services/email/sendPQRResponseEmail";
import {
  NotificationFactory,
  notificationService,
} from "@/services/api/notification.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const pqr = await prisma.pQRS.findUnique({
      where: { id },
      select: {
        id: true,
        subject: true,
        consecutiveCode: true,
        creatorId: true,
        entityId: true,
        entity: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!pqr) {
      return NextResponse.json({ error: "PQRS not found" }, { status: 404 });
    }

    const userWithEntity = await prisma.user.findUnique({
      where: { id: user.id },
      select: { entityId: true, role: true },
    });

    const role = userWithEntity?.role ?? user.role;
    const isSuperAdmin = role === "SUPER_ADMIN";
    const isCreator = pqr.creatorId === user.id;
    const belongsToEntity = userWithEntity?.entityId === pqr.entityId;

    if (!isSuperAdmin && !isCreator && !belongsToEntity) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const responses = await prisma.entityResponse.findMany({
      where: { pqrId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      pqr: {
        id: pqr.id,
        subject: pqr.subject,
        consecutiveCode: pqr.consecutiveCode,
      },
      entity: pqr.entity,
      responses,
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Error fetching responses" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "Response text is required" },
        { status: 400 }
      );
    }

    const pqr = await prisma.pQRS.findUnique({
      where: { id },
      select: {
        id: true,
        entityId: true,
        creatorId: true,
        consecutiveCode: true,
        guestEmail: true,
        guestName: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        entity: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!pqr) {
      return NextResponse.json(
        { error: "PQRS not found" },
        { status: 404 }
      );
    }

    const userWithEntity = await prisma.user.findUnique({
      where: { id: user.id },
      select: { entityId: true, role: true },
    });

    const role = userWithEntity?.role ?? user.role;
    const isSuperAdmin = role === "SUPER_ADMIN";
    const belongsToEntity =
      userWithEntity?.entityId === pqr.entityId;

    if (!isSuperAdmin && !belongsToEntity) {
      return NextResponse.json(
        { error: "You are not authorized to respond to this PQRS" },
        { status: 403 }
      );
    }

    const response = await prisma.entityResponse.create({
      data: {
        text,
        pqrId: id,
        entityId: pqr.entityId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        attachments: true,
      },
    });

    const creatorEmail = pqr.creator?.email ?? pqr.guestEmail;
    const creatorName =
      pqr.creator?.name ?? pqr.guestName ?? "Ciudadano";

    if (creatorEmail && pqr.consecutiveCode) {
      try {
        await sendPQRResponseEmail({
          email: creatorEmail,
          userName: creatorName,
          pqrNumber: pqr.consecutiveCode,
          entityName: pqr.entity.name,
          responseText: text,
          responseDate: new Date(response.createdAt).toLocaleString("es-CO", {
            timeZone: "America/Bogota",
          }),
          responderName: response.user.name ?? undefined,
          pqrLink: `https://quejate.com.co/dashboard/profile/pqr/${pqr.id}/response/${response.id}`,
        });
      } catch (emailError) {
        console.error("Failed to send PQR response notification email:", emailError);
      }
    }

    if (pqr.creatorId) {
      try {
        await notificationService.create(
          NotificationFactory.createEntityResponse(
            pqr.creatorId,
            pqr.id,
            response.id,
            pqr.entity.name,
            response.user.name,
            pqr.consecutiveCode
          )
        );
      } catch (notificationError) {
        console.error("Failed to create entity response notification:", notificationError);
      }
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { error: "Error creating response" },
      { status: 500 }
    );
  }
}
