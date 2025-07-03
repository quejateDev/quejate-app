import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";
import { DocumentType } from "@prisma/client";

interface LawyerRegistrationRequest {
  documentType: string;
  identityDocument: string;
  specialties: string[];
  description?: string;
  feePerHour?: number;
  feePerService?: number;
  experienceYears?: number;
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const requestBody: LawyerRegistrationRequest = await request.json();
    
    const existingLawyer = await prisma.lawyer.findUnique({
      where: { userId }
    });
    
    if (existingLawyer) {
      return NextResponse.json(
        { error: "El usuario ya está registrado como abogado" },
        { status: 400 }
      );
    }

    const lawyer = await prisma.lawyer.create({
      data: {
        userId,
        documentType: requestBody.documentType as DocumentType,
        identityDocument: requestBody.identityDocument,
        specialties: requestBody.specialties,
        description: requestBody.description,
        feePerHour: requestBody.feePerHour,
        feePerService: requestBody.feePerService,
        experienceYears: requestBody.experienceYears || 0
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'LAWYER' }
    });

    return NextResponse.json(lawyer);

  } catch (error: unknown) {
    console.error("Error en registro de abogado:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}