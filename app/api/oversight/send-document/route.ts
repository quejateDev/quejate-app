import { NextRequest, NextResponse } from "next/server";
import { sendOversightDocumentEmail, sendOversightCreationConfirmationEmail } from "@/services/email/Resend.service";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado, inicie sesión nuevamente" },
        { status: 401 }
      );
    }

    const {
      oversightEntity,
      pqrData,
      documentUrl,
      creatorInfo
    } = await req.json();

    if (!oversightEntity?.email) {
      return NextResponse.json(
        { error: "No se encontró el email del ente de control" },
        { status: 400 }
      );
    }

    if (!documentUrl) {
      return NextResponse.json(
        { error: "No se proporcionó la URL del documento" },
        { status: 400 }
      );
    }

    const pqrUrl = `https://quejate.com.co/dashboard/pqr/${pqrData.id}`;

    const user = await prisma.user.findUnique({
      where: { id: currentUserId.id },
      select: {
        email: true,
        name: true
      }
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userName = `${user.name}`.trim();

    await sendOversightDocumentEmail(
      oversightEntity.email,
      oversightEntity.name,
      pqrData.entity?.name || "Entidad",
      {
        name: userName,
        email: user.email,
        phone: creatorInfo.phone || ""
      },
      pqrUrl,
      documentUrl
    );

    await sendOversightCreationConfirmationEmail(
      user.email,
      userName,
      pqrUrl
    );

    return NextResponse.json({
      message: "Documento enviado exitosamente al ente de control y confirmación enviada al usuario",
      oversightEntity: oversightEntity.name,
      oversightEmail: oversightEntity.email,
      userEmail: user.email
    });

  } catch (error) {
    console.error("Error sending oversight document:", error);
    return NextResponse.json(
      { error: "Error al enviar el documento" },
      { status: 500 }
    );
  }
}
