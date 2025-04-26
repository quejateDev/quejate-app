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
      where: { id },
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
