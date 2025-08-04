import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueConsecutiveCode } from "@/lib/consecutiveUtils";
import geoData from "@/data/colombia-geo.json";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const municipalityId = searchParams.get("municipalityId");

    let whereClause = {};

    if (municipalityId) {
      whereClause = { municipalityId };
    } else if (departmentId) {
      whereClause = { regionalDepartmentId: departmentId };
    }

    const entities = await prisma.entity.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        email: true,
        municipalityId: true,
        regionalDepartmentId: true,
        category: { select: { id: true, name: true } }
      },
      _count: { select: { pqrs: true } },
    });

    const departmentMap = new Map<string, string>();
    const municipalityMap = new Map<string, {name: string, departmentId: string}>();

    geoData.departments.forEach(dept => {
      departmentMap.set(dept.id, dept.name);
      dept.municipalities.forEach(mun => {
        municipalityMap.set(mun.id, {name: mun.name, departmentId: dept.id});
      });
    });

    const enrichedEntities = entities.map(entity => {
      const municipalityInfo = entity.municipalityId ? municipalityMap.get(entity.municipalityId) : null;
      const departmentName = entity.regionalDepartmentId 
        ? departmentMap.get(entity.regionalDepartmentId) 
        : (municipalityInfo ? departmentMap.get(municipalityInfo.departmentId) : null);

      return {
        ...entity,
        municipality: municipalityInfo?.name || null,
        department: departmentName || null
      };
    });

    return NextResponse.json(enrichedEntities);
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