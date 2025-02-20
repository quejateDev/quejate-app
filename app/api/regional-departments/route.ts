import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const departments = await prisma.regionalDepartment.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        Municipality: { 
          select: { name: true },
        },
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching regional departments:", error);
    return NextResponse.json(
      { error: "Error fetching regional departments" },
      { status: 500 }
    );
  }
}

