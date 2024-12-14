import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
    },
  });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const { username, password, firstName, lastName, email, phone, role } =
    await request.json();
  const client = await prisma.user.create({
    data: {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      role: "CLIENT",
    },
  });
  return NextResponse.json(client);
}