import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: any 
) {
  const { id } = await params;
  const employee = await prisma.user.findUnique({
    where: {
      id,
      role: "EMPLOYEE",
    },
  });
  return NextResponse.json(employee);
}

export async function PUT(
  request: Request,
  { params }: any 
) {
  const { password, ...otherData } = await request.json();
  const { id } = await params;

  const updateData = {
    ...otherData,
    ...(password && { password: await hash(password, 10) })
  };

  const employee = await prisma.user.update({
    where: { id },
    data: updateData
  });
  return NextResponse.json(employee);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const employee = await prisma.user.delete({
    where: { id },
  });
  return NextResponse.json(employee);
}
