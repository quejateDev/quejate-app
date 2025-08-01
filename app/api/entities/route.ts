import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueConsecutiveCode } from "@/lib/consecutiveUtils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const municipalityId = searchParams.get("municipalityId");

    let whereClause = {};

    if (municipalityId) {
      whereClause = {
        municipalityId: municipalityId,
      };
    } else if (departmentId) {
      whereClause = {
        Municipality: {
          regionalDepartmentId: departmentId,
        },
      };
    }

    const entities = await prisma.entity.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        Municipality: {
          select: {
            name: true,
          },
        },
        RegionalDepartment: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            pqrs: true,
          },
        },
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
    const { name, description, imageUrl, categoryId, email } = body;

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const consecutiveCode = await generateUniqueConsecutiveCode(name);

    const entity = await prisma.entity.create({
      data: {
        name,
        description,
        imageUrl,
        categoryId,
        email,
        EntityConsecutive: {
          create: {
            code: consecutiveCode,
          },
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            pqrs: true,
          },
        },
      },
    });

    return NextResponse.json(entity);
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json(
      { 
        error: 'Error creating entity',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}