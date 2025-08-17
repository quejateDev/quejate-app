import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendPQRCreationEmail } from "@/services/email/Resend.service";
import { sendPQRNotificationEmail } from "@/services/email/sendPQRNotification";
import { calculateDueDate } from "@/utils/dateHelpers";

interface FormFile extends File {
  arrayBuffer(): Promise<ArrayBuffer>;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function GET() {
  try {
    const pqrs = await prisma.pQRS.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
            email: true,
            entityId: true,
          },
        },
        customFieldValues: true,
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            pqrId: true,
            size: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json(pqrs);
  } catch (error) {
    console.error("Error fetching PQRs:", error);
    return NextResponse.json({ error: "Error fetching PQRs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { error: "Request body is missing" },
      { status: 400 }
    );
  }

  let pqr: any;

  try {
    const formData = await req.formData();
    const jsonData = formData.get("data");

    if (!jsonData) {
      return NextResponse.json({ error: "Missing PQR data" }, { status: 400 });
    }

    const body = JSON.parse(jsonData as string);

    if (!body.recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const isRecaptchaValid = await verifyRecaptcha(body.recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: "El tipo de solicitud es requerido" },
        { status: 400 }
      );
    }

    if (!body.entityId) {
      return NextResponse.json(
        { error: "La entidad es requerida" },
        { status: 400 }
      );
    }

    let maxResponseTime = 15; 

    if (body.departmentId) {
      const departmentConfig = await prisma.pQRConfig.findFirst({
        where: { departmentId: body.departmentId },
        select: { maxResponseTime: true },
      });
      
      if (departmentConfig) {
        maxResponseTime = departmentConfig.maxResponseTime;
      }
    } else {
      const entityConfig = await prisma.pQRConfig.findFirst({
        where: { entityId: body.entityId },
        select: { maxResponseTime: true },
      });
      
      if (entityConfig) {
        maxResponseTime = entityConfig.maxResponseTime;
      }
    }

    // Calcular fecha límite considerando días hábiles colombianos
    const dueDate = calculateDueDate(new Date(), maxResponseTime);

    const consecutiveCode = await prisma.entityConsecutive.findFirst({
      where: {
        entityId: body.entityId,
      },
    });

    if (!consecutiveCode) {
      return NextResponse.json(
        { error: "No consecutive code found for this entity" },
        { status: 400 }
      );
    }

    let fechaConsecutivo = new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    fechaConsecutivo = fechaConsecutivo.split("/").reverse().join("");
    fechaConsecutivo = fechaConsecutivo.replace(/\//g, "");

    // Create PQR with attachments
    const [pqr] = await prisma.$transaction([
      prisma.pQRS.create({
        data: {
          type: body.type,
          dueDate,
          anonymous: body.isAnonymous || false,
          departmentId: body.departmentId,
          entityId: body.entityId,
          creatorId: body.creatorId,
          subject: body.subject,
          description: body.description,
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
          consecutiveCode: `${consecutiveCode.code}-${fechaConsecutivo}`,
        },
        include: {
          department: true, 
          entity: true,
          customFieldValues: true,
          attachments: true,
          creator: true,
        },
      }),
      prisma.entityConsecutive.update({
        where: { id: consecutiveCode.id },
        data: {
          consecutive: consecutiveCode.consecutive + 1,
        },
      }),
    ]);

    const entity = await prisma.entity.findUnique({
      where: { id: body.entityId },
      select: { name: true, email: true },
    });

    if (!pqr.consecutiveCode) {
      throw new Error("No consecutive code found for this PQR");
    }

    if (entity?.email) {
      await sendPQRNotificationEmail(
        entity.email,
        entity.name,
        pqr,
      );
    } else {
      throw new Error("No email found for this entity");
    }

    if (pqr.creator?.email) {
      await sendPQRCreationEmail(
        pqr.creator?.email,
        pqr.creator?.name || "John Doe",
        "Registro exitoso de PQR @quejate.com.co",
        pqr.consecutiveCode,
        new Date(pqr.createdAt).toLocaleString("es-CO", {
          timeZone: "America/Bogota",
        }),
        `https://quejate.com.co/dashboard/pqr/${pqr.id}`
      );
    }

    return NextResponse.json(pqr);
  } catch (error: any) {
    console.error("Error in POST /api/pqr:", error.stack);

    if (pqr && pqr.id) {
      await prisma.$transaction([
        prisma.pQRS.delete({
          where: {
            id: pqr.id,
          },
        }),
        prisma.entityConsecutive.update({
          where: { id: pqr.entityConsecutiveId },
          data: {
            consecutive: pqr.entityConsecutive.consecutive - 1,
          },
        }),
      ]);
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
