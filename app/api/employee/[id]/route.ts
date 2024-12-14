import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const employee = await prisma.user.findUnique({
    where: {
      id: params.id,
      role: "EMPLOYEE",
    },
  });
  return NextResponse.json(employee);
}


export async function PUT(request: Request) {
  const { id, ...data } = await request.json();
  const employee = await prisma.user.update({
    where: { id },
    data,
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
    