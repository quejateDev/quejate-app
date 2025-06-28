import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: any
) {
  const { id } = await params;
  const pqr = await prisma.pQRS.findUnique({
    where: { id },
    include: {
      department: true,
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
        }
      },
      customFieldValues: true,
      entity: true,
      attachments: true,
      likes: true,
      comments: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: true,
            }
          }
        }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
  });
  return NextResponse.json(pqr);
}