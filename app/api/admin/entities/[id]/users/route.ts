import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = await prisma.user.findMany({
      where: {
        EntityHasUser: {
          some: {
            entityId: id,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching entity users:", error);
    return NextResponse.json(
      { error: "Error fetching entity users" },
      { status: 500 }
    );
  }
}

// Add a new user to an entity
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, role = "EMPLOYEE" } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user's entity and role
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        EntityHasUser: {
          create: {
            entityId: id,
            role,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error adding entity user:", error);
    return NextResponse.json(
      { error: "Error adding entity user" },
      { status: 500 }
    );
  }
}
