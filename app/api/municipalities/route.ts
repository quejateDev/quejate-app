import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");

    if (!departmentId) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    const municipalities = await prisma.municipality.findMany({
      where: {
        regionalDepartmentId: departmentId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(municipalities);
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return NextResponse.json(
      { error: "Error fetching municipalities" },
      { status: 500 }
    );
  }
}
