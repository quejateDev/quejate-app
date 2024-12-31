import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET endpoint to fetch a specific area by ID
export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    const { id } = await params;
    const area = await prisma.department.findUnique({
      where: {
        id
      },
      include: {
        pqrConfig: {
          include: {
            customFields: true
          }
        }
      }
    });

    if (!area) {
      return NextResponse.json(
        { error: "Area not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(area);
  } catch (error) {
    console.error("Error fetching area:", error);
    return NextResponse.json(
      { error: "Error fetching area" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific area by ID
export async function DELETE(
  request: Request,
  { params }: any
) {
  try {
    const area = await prisma.department.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(area);
  } catch (error) {
    console.error("Error deleting area:", error);
    return NextResponse.json(
      { error: "Error deleting area" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a specific area by ID
export async function PATCH(
  request: Request,
  { params }: any
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
    console.error("Error updating area:", error);
    return NextResponse.json(
      { error: "Error updating area" },
      { status: 500 }
    );
  }
}
