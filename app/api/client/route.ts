import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
    },
  });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  let { password, firstName, lastName, email, phone, role, entityId } =
    await request.json();

  const client = await prisma.user.create({
    data: {
      password,
      firstName,
      lastName,
      email,
      phone,
      role: role || "CLIENT",
      entityId: entityId || null,
    },
  });
  return NextResponse.json(client);
}
