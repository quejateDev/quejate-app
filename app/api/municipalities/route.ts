import { NextResponse } from "next/server";
import data from "@/data/colombia-geo.json";

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

    const department = data.departments.find(
      (dept) => dept.id === departmentId
    );

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const sortedMunicipalities = department.municipalities.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return NextResponse.json(sortedMunicipalities);
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return NextResponse.json(
      { error: "Error fetching municipalities" },
      { status: 500 }
    );
  }
}