import { NextResponse } from "next/server";
import data from "@/data/colombia-geo.json";

export async function GET() {
  try {
    const sortedDepartments = data.departments.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return NextResponse.json(sortedDepartments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Error fetching departments" },
      { status: 500 }
    );
  }
}