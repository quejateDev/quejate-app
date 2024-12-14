import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendPQRCreationEmail } from "@/services/email/Resend.service";

export async function GET(req: NextRequest) {
  const pqrs = await prisma.pQRS.findMany({
    include: {
      department: true,
      creator: true,
    },
  });
  return NextResponse.json(pqrs);
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Failed to parse request body" },
        { status: 400 }
      );
    }

    console.log("Received body:", body);

    // Validate required fields
    if (
      !body.type ||
      !body.subject ||
      !body.description ||
      !body.departmentId ||
      !body.creatorId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await prisma.pQRS.create({
      data: {
        type: body.type,
        subject: body.subject,
        description: body.description,
        dueDate: new Date(body.dueDate),
        department: {
          connect: {
            id: body.departmentId,
          },
        },
        creator: {
          connect: {
            id: body.creatorId,
          },
        },
      },
      include: {
        creator: true,
      },
    });

    console.log("Response:", response);

    const email = await sendPQRCreationEmail(
      response.creator?.email || "luisevilla588@gmail.com",
      response.creator?.firstName || "John Doe",
      "Registro exitoso de PQR @tuqueja.com.co",
      response.id.toString(),
      new Date(response.createdAt).toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      `https://tuqueja.com.co/pqr/${response.id}`
    );

    console.log("Email:", email);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in POST /api/pqr:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
