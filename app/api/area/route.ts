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
