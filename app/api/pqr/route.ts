import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendPQRCreationEmail } from "@/services/email/Resend.service";
import path from "path";
import { uploadObject } from "@/services/storage/s3.service";

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
        attachments: true
      },
    });

    console.log("pqrs", pqrs);

    return NextResponse.json(pqrs);
  } catch (error) {
    console.error("Error fetching PQRs:", error);
    return NextResponse.json(
      { error: "Error fetching PQRs" },
      { status: 500 }
    );
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
    const jsonData = formData.get('data');
    
    if (!jsonData) {
      return NextResponse.json(
        { error: "Missing PQR data" },
        { status: 400 }
      );
    }

    const body = JSON.parse(jsonData as string);

    // Validate required fields
    if (
      !body.type ||
      !body.departmentId ||
      !body.creatorId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get files from form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('attachment-') && value instanceof File) {
        files.push(value);
      }
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
        private: body.isPrivate || false
      },
      include: {
        department: true,
        customFieldValues: true,
        attachments: true,
        creator: true,
      },
    });

    const attachments: {
      name: string;
      url: string;
      type: string;
      size: number;
    }[] = [];
    // upload attachments to s3 
    await Promise.all(
      files.map(async (file: FormFile) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `pqr/${pqr.id}/attachments/${file.name}`;
        //@ts-ignore
        const s3file = await uploadObject(filePath, buffer);
        attachments.push({
          name: file.name,
          url: filePath,
          type: file.type,
          size: file.size
        });
      })
    );

    if (attachments.length > 0) {
      await prisma.pQRS.update({
        where: {
          id: pqr.id,
        },
        data: {
          attachments: {
            createMany: {
              data: attachments.map((attachment) => ({
                name: attachment.name,
                url: attachment.url,
                type: attachment.type,
                size: attachment.size
              })),
            },
          },
        },
      });
    }

    // Send email notification
    await sendPQRCreationEmail(
      pqr.creator?.email || "luisevilla588@gmail.com",
      pqr.creator?.firstName || "John Doe",
      "Registro exitoso de PQR @tuqueja.com.co",
      pqr.id.toString(),
      new Date(pqr.createdAt).toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      `https://tuqueja.com.co/pqr/${pqr.id}`
    );

    return NextResponse.json(pqr);
  } catch (error: any) {
    console.error("Error in POST /api/pqr:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
