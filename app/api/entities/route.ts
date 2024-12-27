import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const entities = await prisma.entity.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(entities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    return NextResponse.json(
      { error: "Error fetching entities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const entity = await prisma.entity.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(entity);
  } catch (error) {
    console.error("Error creating entity:", error);
    return NextResponse.json(
      { error: "Error creating entity" },
      { status: 500 }
    );
  }
}
