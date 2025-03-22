import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendPQRCreationEmail } from "@/services/email/Resend.service";
import path from "path";
import { uploadObject } from "@/services/storage/s3.service";
import { sendPQRNotificationEmail } from "@/services/email/sendPQRNotification";

interface FormFile extends File {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function GET() {
  try {
    const pqrs = await prisma.pQRS.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        department: true,
        customFieldValues: true,
        attachments: true,
      },
    });

    console.log("pqrs", pqrs);

    return NextResponse.json(pqrs);
  } catch (error) {
    console.error("Error fetching PQRs:", error);
    return NextResponse.json({ error: "Error fetching PQRs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const jsonData = formData.get("data");

    if (!jsonData) {
      return NextResponse.json({ error: "Missing PQR data" }, { status: 400 });
    }

    const body = JSON.parse(jsonData as string);

    // Validate required fields
    if (!body.type || !body.departmentId || !body.creatorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pqrConfig = await prisma.pQRConfig.findFirst({
      where: {
        departmentId: body.departmentId,
      },
      select: {
        maxResponseTime: true,
      },
    });

    if (!pqrConfig) {
      return NextResponse.json(
        { error: "No PQR configuration found for this department" },
        { status: 400 }
      );
    }

    // Calculate due date based on maxTimeResponse (in days)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + pqrConfig.maxResponseTime);

    // Create PQR with attachments
    const pqr = await prisma.pQRS.create({
      data: {
        type: body.type,
        dueDate,
        anonymous: body.isAnonymous || false,
        departmentId: body.departmentId,
        creatorId: body.creatorId,
        customFieldValues: {
          create: body.customFields.map((field: any) => ({
            name: field.name,
            value: field.value,
            type: field.type,
            placeholder: field.placeholder,
            required: field.required,
          })),
        },
        private: body.isPrivate || false,
      },
      include: {
        department: true,
        customFieldValues: true,
        attachments: true,
        creator: true,
      },
    });

    if (body.attachments && body.attachments.length > 0) {
      await prisma.pQRS.update({
        where: {
          id: pqr.id,
        },
        data: {
          attachments: {
            createMany: {
              data: body.attachments.map((attachment: any) => ({
                name: attachment.name,
                url: attachment.url,
                type: attachment.type,
                size: attachment.size,
              })),
            },
          },
        },
      });
    }

    const entity = await prisma.entity.findUnique({
      where: { id: body.entityId },
      select: { name: true, email: true }
    });

    // Enviar emails en paralelo
    const emails = await Promise.all([
      // Email a la entidad
      entity?.email && sendPQRNotificationEmail(
        entity.email,
        entity.name,
        pqr,
        pqr.creator,
        pqr.customFieldValues,
        pqr.attachments
      ),
      
      // Email al creador
      sendPQRCreationEmail(
        pqr.creator?.email || "noreply@quejate.com.co",
        pqr.creator?.firstName || "John Doe",
        "Registro exitoso de PQRSD @quejate.com.co",
        pqr.id.toString(),
        new Date(pqr.createdAt).toLocaleString("es-CO", {
          timeZone: "America/Bogota",
        }),
        `https://quejate.com.co/dashboard/pqr/${pqr.id}`
      )
    ].filter(Boolean)); // Filtramos los undefined (cuando no hay email de entidad)

    return NextResponse.json(pqr);
  } catch (error: any) {
    console.error("Error in POST /api/pqr:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
