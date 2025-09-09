import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { DocumentType } from "@prisma/client";

interface LawyerRegistrationRequest {
  documentType: string;
  identityDocument: string;
  identityDocumentImage: string;
  professionalCardImage: string;
  licenseNumber: string;
  specialties: string[];
  description?: string;
  feePerHour?: number;
  feePerService?: number;
}

export async function POST(request: Request) {
  try {
    const userId = await currentUser();
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const requestBody: LawyerRegistrationRequest = await request.json();
    
    if (!requestBody.licenseNumber) {
      return NextResponse.json(
        { error: "El número de licencia es requerido" },
        { status: 400 }
      );
    }
    
    const existingLawyer = await prisma.lawyer.findUnique({
      where: { userId: userId.id }
    });
    
    if (existingLawyer) {
      return NextResponse.json(
        { error: "El usuario ya está registrado como abogado" },
        { status: 400 }
      );
    }

    const existingLawyerByDocument = await prisma.lawyer.findUnique({
      where: { identityDocument: requestBody.identityDocument }
    });
    if (existingLawyerByDocument) {
      return NextResponse.json(
        { error: "Ya existe un abogado registrado con este número de documento." },
        { status: 400 }
      );
    }

    const existingLawyerByLicense = await prisma.lawyer.findUnique({
      where: { licenseNumber: requestBody.licenseNumber }
    });
    if (existingLawyerByLicense) {
      return NextResponse.json(
        { error: "Ya existe un abogado registrado con este número de licencia." },
        { status: 400 }
      );
    }

    const lawyer = await prisma.lawyer.create({
      data: {
        userId: userId.id!,
        documentType: requestBody.documentType as DocumentType,
        identityDocument: requestBody.identityDocument,
        identityDocumentImage: requestBody.identityDocumentImage,
        professionalCardImage: requestBody.professionalCardImage,
        licenseNumber: requestBody.licenseNumber,
        specialties: requestBody.specialties,
        description: requestBody.description,
        feePerHour: requestBody.feePerHour,
        feePerService: requestBody.feePerService
      }
    });

    await prisma.user.update({
      where: { id: userId.id },
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