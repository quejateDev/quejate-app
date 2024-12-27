import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id} = await params;
  const pqr = await prisma.pQRS.findUnique({
    where: {
      id,
    },
    include: {
      department: true,
      creator: true,
    },
  });
  return NextResponse.json(pqr);
}
