import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionalDepartmentId = searchParams.get("regionalDepartmentId");
    const municipalityId = searchParams.get("municipalityId");

    if (!regionalDepartmentId) {
      return NextResponse.json(
        { error: "Regional department ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      regionalDepartmentId: regionalDepartmentId,
    };

    if (municipalityId) {
      whereClause.OR = [
        { municipalityId: municipalityId },
        { municipalityId: null }
      ];
    } else {
      whereClause.municipalityId = null;
    }

    const oversightEntities = await prisma.oversightEntity.findMany({
      where: whereClause,
      include: {
        Municipality: true,
        RegionalDepartment: true,
      },
      orderBy: [
        { municipalityId: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(oversightEntities);
  } catch (error) {
    console.error("Error fetching oversight entities by location:", error);
    return NextResponse.json(
      { error: "Error fetching oversight entities" },
      { status: 500 }
    );
  }
}
