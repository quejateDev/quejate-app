import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const pqrId = resolvedParams.id;
  
  const { text, userId } = await request.json();
  
  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        pqrId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating comment" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const pqrId = resolvedParams.id;

  try {
    const comments = await prisma.comment.findMany({
      where: { pqrId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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