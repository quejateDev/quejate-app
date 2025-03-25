import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// Get all users for an entity
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    // If user is an ADMIN, verify they belong to this entity
    // if (session.user.role === "ADMIN") {
    //   const isEntityAdmin = await prisma.entityHasUser.findFirst({
    //     where: {
    //       entityId: params.id,
    //       userId: session.user.id,
    //     },
    //   });

    //   if (!isEntityAdmin) {
    //     return NextResponse.json(
    //       { error: "Unauthorized" },
    //       { status: 401 }
    //     );
    //   }
    // }

    const users = await prisma.user.findMany({
      where: {
        EntityHasUser: {
          some: {
            entityId: params.id,
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
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

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
            entityId: params.id,
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
