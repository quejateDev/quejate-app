import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import geoData from "@/data/colombia-geo.json";
import { z } from "zod";

const createSuggestionSchema = z.object({
  entityName: z.string().min(1, "Entity name is required"),
  regionalDepartmentId: z.string().min(1, "Regional department is required"),
  municipalityId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSuggestionSchema.parse(body);

    const departmentExists = geoData.departments.find(
      (dept) => dept.id === validatedData.regionalDepartmentId
    );

    if (!departmentExists) {
      return NextResponse.json(
        { error: "Regional department not found" },
        { status: 404 }
      );
    }

    if (validatedData.municipalityId) {
      const municipalityExists = departmentExists.municipalities.find(
        (mun) => mun.id === validatedData.municipalityId
      );

      if (!municipalityExists) {
        return NextResponse.json(
          { error: "Municipality not found" },
          { status: 404 }
        );
      }
    }

    const suggestion = await prisma.entitySuggestion.create({
      data: {
        entityName: validatedData.entityName,
        regionalDepartmentId: validatedData.regionalDepartmentId,
        municipalityId: validatedData.municipalityId,
      },
    });

    return NextResponse.json(
      {
        ...suggestion,
        departmentName: departmentExists.name,
        municipalityName: validatedData.municipalityId
          ? departmentExists.municipalities.find(
              (m) => m.id === validatedData.municipalityId
            )?.name
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating entity suggestion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const departmentMap = new Map<string, string>();
    const municipalityMap = new Map<string, string>();

    geoData.departments.forEach((dept) => {
      departmentMap.set(dept.id, dept.name);
      dept.municipalities.forEach((mun) => {
        municipalityMap.set(mun.id, mun.name);
      });
    });

    const [suggestions, total] = await Promise.all([
      prisma.entitySuggestion.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.entitySuggestion.count({ where }),
    ]);

    const result = suggestions.map((suggestion) => ({
      ...suggestion,
      departmentName: departmentMap.get(suggestion.regionalDepartmentId) || null,
      municipalityName: suggestion.municipalityId
        ? municipalityMap.get(suggestion.municipalityId) || null
        : null,
    }));

    return NextResponse.json({
      suggestions: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching entity suggestions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
