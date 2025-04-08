import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { getCookie } from "@/lib/utils";
import { hash } from "bcryptjs";

export async function GET() {
  const token = await getCookie("token");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: {
          in: ["EMPLOYEE", "ADMIN"],
        },
        Entity: {
          id: decoded.entityId,
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Error fetching clients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, phone, password, role, entityId } =
      await req.json();

    const client = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        password: await hash(password, 10),
        role: "EMPLOYEE",
        entityId,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Error creating client" },
      { status: 500 }
    );
  }
}
