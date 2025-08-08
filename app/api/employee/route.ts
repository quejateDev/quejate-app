import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const employees = await prisma.user.findMany({
    where: {
      role: "EMPLOYEE",
    },
    include: {
      department: true,
    },
  });
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const {
    password,
    name,
    email,
    phone,
    role,
    departmentId,
  } = await request.json();
  const employee = await prisma.user.create({
    data: {
      password,
      name,
      email,
      phone,
      role,
      departmentId,
    },
  });
  return NextResponse.json(employee);
}
