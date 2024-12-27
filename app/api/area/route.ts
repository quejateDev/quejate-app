// app/api/departments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        entity: true,
        employees: true,
        pqrs: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Error fetching departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, entityId } = body;

    const department = await prisma.department.create({
      data: {
        name,
        description,
        entity: {
          connect: {
            id: entityId,
          },
        },
      },
      include: {
        entity: true,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Error creating department" },
      { status: 500 }
    );
  }
}