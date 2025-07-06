// app/api/lawyer/request/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const currentUserId = await getUserIdFromToken();
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { lawyerId, message, pqrId } = await request.json();

    if (!lawyerId || !message) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: lawyerId y message" },
        { status: 400 }
      );
    }

    const client = await prisma.user.findUnique({
      where: { 
        id: currentUserId,
        isActive: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente no encontrado o no tiene permisos" },
        { status: 403 }
      );
    }

    const lawyer = await prisma.lawyer.findUnique({
      where: { 
        id: lawyerId,
        user: {
          isActive: true
        }
      },
      include: { user: true }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "Abogado no encontrado o no disponible" },
        { status: 404 }
      );
    }

    if (pqrId) {
      const pqr = await prisma.pQRS.findUnique({
        where: { 
          id: pqrId,
          creatorId: currentUserId
        }
      });

      if (!pqr) {
        return NextResponse.json(
          { error: "PQR no encontrada o no tienes permisos" },
          { status: 404 }
        );
      }
    }

    const lawyerRequest = await prisma.lawyerRequest.create({
      data: {
        userId: currentUserId,
        lawyerId: lawyer.id,
        pqrId: pqrId || null,
        message,
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lawyer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        pqr: true
      }
    });
    
    return NextResponse.json(lawyerRequest, { status: 201 });

  } catch (error) {
    console.error("Error creating lawyer request:", error);
    return NextResponse.json(
      { error: "Error al crear la solicitud de abogado" },
      { status: 500 }
    );
  }
}