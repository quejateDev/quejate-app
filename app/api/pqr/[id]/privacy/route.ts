import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function PATCH(
    request: Request,
    { params }: any
  ) {
    try {
      const { id } = await params;
      const currentUserId = await currentUser();
      
      if (!currentUserId) {
        return NextResponse.json(
          { error: "No autorizado, inicie sesión nuevamente" },
          { status: 401 }
        );
      }

    const { private: isPrivate } = await request.json();

    if (typeof isPrivate !== "boolean") {
      return NextResponse.json(
        { error: "Valor de privacidad no válido. Debe ser un booleano." },
        { status: 400 }
      );
    }

    const existingPqrs = await prisma.pQRS.findUnique({
      where: {
        id,
        creatorId: currentUserId.id
      }
    });

    if (!existingPqrs) {
      return NextResponse.json(
        { error: "PQRS no encontrada o no tienes permisos." },
        { status: 404 }
      );
    }

    const updatedPqrs = await prisma.pQRS.update({
      where: {
        id,
        creatorId: currentUserId.id
      },
      data: {
        private: isPrivate,
        updatedAt: new Date()
      },
      include: {
        creator: true,
        customFieldValues: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedPqrs,
      message: `PQRSD marcada como ${isPrivate ? 'privada' : 'pública'} exitosamente.`
    });

  } catch (error) {
    console.error("[PQRS_PRIVACY_UPDATE_ERROR]", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : null
      },
      { status: 500 }
    );
  }
}
