import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const entity = await prisma.entity.findUnique({
      where: { id },
      include: {
        EntityHasUser: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: entity.id,
      name: entity.name,
      isVerified: entity.isVerified,
      users: entity.EntityHasUser.map((entityHasUser) => ({
        ...entityHasUser.user,
        role: entityHasUser.role,
      })),
    });
  } catch (error) {
    console.error("Error fetching entity:", error);
    return NextResponse.json(
      { error: "Error fetching entity" },
      { status: 500 }
    );
  }
}
