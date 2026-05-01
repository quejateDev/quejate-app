import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

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
  if (!pqr) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (pqr.private) {
    const caller = await currentUser();
    const role = caller?.role;
    const isPrivileged = role === 'EMPLOYEE' || role === 'ADMIN' || role === 'SUPER_ADMIN';
    const isOwner = caller?.id && pqr.creatorId === caller.id;
    if (!isPrivileged && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json(pqr);
}
