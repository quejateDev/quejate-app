import { NextRequest, NextResponse } from "next/server";
import { sendOversightDocumentEmail, sendOversightCreationConfirmationEmail } from "@/services/email/Resend.service";
import { verifyToken } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
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

    const pqrUrl = `${process.env.NEXTAUTH_URL}/dashboard/pqr/${pqrData.id}`;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        email: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userName = `${user.firstName} ${user.lastName}`.trim();

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
