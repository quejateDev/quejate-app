
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
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (userId !== pqr.creatorId) {
      const commentingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, profilePicture: true },
      });

      if (commentingUser) {
        await prisma.notification.create({
          data: {
            type: "comment",
            userId: pqr.creatorId,
            message: `${commentingUser.firstName} ${commentingUser.lastName} ha comentado tu PQRSD`,
            data: {
              pqrId: pqrId,
              followerId: userId,
              followerName: `${commentingUser.firstName} ${commentingUser.lastName}`,
              followerImage: commentingUser.profilePicture || null,
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
            firstName: true,
            lastName: true,
            profilePicture: true,
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