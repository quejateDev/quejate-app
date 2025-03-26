import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update a user's role or department
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    const { role, departmentId } = await request.json();

    // Verify department belongs to entity if provided
    if (departmentId) {
      const department = await prisma.department.findFirst({
        where: {
          id: departmentId,
          entityId: id,
        },
      });

      if (!department) {
        return NextResponse.json(
          { error: "Invalid department" },
          { status: 400 }
        );
      }
    }

    const user = await prisma.entityHasUser.findFirst({
      where: {
        userId: userId,
        entityId: id,
      },
    });

    // Update user
    const updateEntityUser = await prisma.entityHasUser.update({
      where: {
        entityId_userId: {
          entityId: id,
          userId: userId,
        },
      },
      data: { role },
    });

    return NextResponse.json(updateEntityUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

// Remove a user from an entity
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    // Update user to remove entity association and reset role to CLIENT
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
        EntityHasUser: {
          some: {
            entityId: id,
          },
        },
      },
      data: {
        departmentId: null,
        role: "CLIENT",
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error removing user from entity:", error);
    return NextResponse.json(
      { error: "Error removing user from entity" },
      { status: 500 }
    );
  }
}
