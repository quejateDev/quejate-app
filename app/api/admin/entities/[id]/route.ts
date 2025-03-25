import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

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

    // // If user is an ADMIN, verify they belong to this entity
    // if (session.user.role === "ADMIN") {
    //   const isEntityAdmin = await prisma.entityAdmin.findFirst({
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
