import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET endpoint to fetch a specific area by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const area = await prisma.department.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!area) {
      return NextResponse.json(
        { error: "Area not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(area);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching area" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific area by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const area = await prisma.department.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(area);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting area" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a specific area by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const area = await prisma.department.update({
      where: {
        id: params.id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(area);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating area" },
      { status: 500 }
    );
  }
}
