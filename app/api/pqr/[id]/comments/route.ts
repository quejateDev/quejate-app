import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: pqrId } = await params;
    const { text, userId } = await request.json();

    if (!text || !userId || !pqrId) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        pqrId,
        userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const pqr = await prisma.pQRS.findUnique({
      where: { id: pqrId },
      select: {
        creatorId: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!pqr || !pqr.creatorId) {
      return NextResponse.json(comment, { status: 201 });
    }

    if (pqr.creatorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "comment",
          userId: pqr.creatorId,
          message: `${comment.user.firstName} ${comment.user.lastName} comentó tu PQRSD`,
          data: {
            pqrId: pqrId,
            commentId: comment.id,
            commenterId: userId,
            commenterName: `${comment.user.firstName} ${comment.user.lastName}`,
          },
        },
      });
    } else {
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return NextResponse.json(
      { error: "Error al crear comentario" },
      { status: 500 }
    );
  }
}