import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const oversightEntities = await prisma.oversightEntity.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(oversightEntities);
  } catch (error) {
    console.error("Error fetching oversight entities:", error);
    return NextResponse.json(
      { error: "Error fetching oversight entities" },
      { status: 500 }
    );
  }
}