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
                firstName: true,
                lastName: true,
                profilePicture: true
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
          include: {
            entity: true,
          },
        },
        entity: true,
        customFieldValues: true,
        creator: true
      },
  });
  return NextResponse.json(pqr);
}
