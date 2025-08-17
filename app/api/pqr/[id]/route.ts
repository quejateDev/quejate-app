import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: any
) {
  const { id} = await params;
  const pqr = await prisma.pQRS.findUnique({
    where: {
      id,
    },
    include: {
        likes: true,
        attachments: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true,
            email: true,
            entityId: true,
          },
        },
        entity: {
          select: {
            id: true,
            name: true,
            description: true,
            email: true,
            categoryId: true,
            imageUrl: true
          },
        },
        customFieldValues: true,
        creator: true
      },
  });
  return NextResponse.json(pqr);
}
