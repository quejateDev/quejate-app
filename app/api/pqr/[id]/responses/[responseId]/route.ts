import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; responseId: string }> }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: pqrId, responseId } = await params;

    const response = await prisma.entityResponse.findFirst({
      where: {
        id: responseId,
        pqrId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        entity: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
        pqr: {
          select: {
            id: true,
            subject: true,
            consecutiveCode: true,
            creatorId: true,
            entityId: true,
          },
        },
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    const userWithEntity = await prisma.user.findUnique({
      where: { id: user.id },
      select: { entityId: true, role: true },
    });

    const role = userWithEntity?.role ?? user.role;
    const isSuperAdmin = role === "SUPER_ADMIN";
    const isCreator = response.pqr.creatorId === user.id;
    const belongsToEntity =
      userWithEntity?.entityId === response.pqr.entityId;

    if (!isSuperAdmin && !isCreator && !belongsToEntity) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching entity response:", error);
    return NextResponse.json(
      { error: "Error fetching response" },
      { status: 500 }
    );
  }
}
