
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const pqrId = (await params).id
  
  const { text, userId } = await request.json();
  
  try {

    const pqr = await prisma.pQRS.findUnique({
      where: { id: pqrId },
      select: { creatorId: true }
    });

    if (!pqr) {
      return NextResponse.json({ error: "PQRS not found" }, { status: 404 });
    }

    if (!pqr.creatorId) {
      return NextResponse.json({ error: "PQRS creator not found" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
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
      },
    });

    if (userId !== pqr.creatorId) {
      const commentingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, image: true },
      });

      if (commentingUser) {
        await prisma.notification.create({
          data: {
            type: "comment",
            userId: pqr.creatorId,
            message: `${commentingUser.name} ha comentado tu PQRSD`,
            data: {
              pqrId: pqrId,
              followerId: userId,
              followerName: `${commentingUser.name}`,
              followerImage: commentingUser.image || null,
            },
          },
        });
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating comment" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const pqrId = (await params).id

  try {
    const comments = await prisma.comment.findMany({
      where: { pqrId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}