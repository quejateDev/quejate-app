import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LawyerRequestStatus } from "@prisma/client";
import { createLawyerRequestNotification, createNewRequestNotificationForLawyer } from "@/lib/helpers/notificationHelpers";
import { currentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as LawyerRequestStatus | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const lawyer = await prisma.lawyer.findUnique({
      where: {
        userId: currentUserId.id,
        user: {
          isActive: true
        }
      }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "No se encontró el perfil de abogado o no tiene permisos" },
        { status: 403 }
      );
    }

    const whereConditions = {
      lawyerId: lawyer.id,
      ...(status && { status })
    };

    const [requests, totalCount] = await Promise.all([
      prisma.lawyerRequest.findMany({
        where: whereConditions,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true
            }
          },
          pqr: {
            select: {
              id: true,
              subject: true,
              description: true
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.lawyerRequest.count({
        where: whereConditions
      })
    ]);

    return NextResponse.json({
      data: requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching lawyer requests:", error);
    return NextResponse.json(
      { error: "Error al obtener las solicitudes del abogado" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { lawyerId, message, pqrId, clientContactEmail, clientContactPhone } = await request.json();

    if (!lawyerId || !message) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: lawyerId y message" },
        { status: 400 }
      );
    }

    if (!clientContactEmail && !clientContactPhone) {
      return NextResponse.json(
        { error: "Debes proporcionar al menos un método de contacto (email o teléfono)" },
        { status: 400 }
      );
    }

    const client = await prisma.user.findUnique({
      where: {
        id: currentUserId.id,
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
          creatorId: currentUserId.id
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
        userId: currentUserId.id,
        lawyerId: lawyer.id,
        pqrId: pqrId || null,
        message,
        clientContactEmail: clientContactEmail || null,
        clientContactPhone: clientContactPhone || null,
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        lawyer: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        pqr: {
          select: {
            id: true,
            subject: true,
            description: true
          }
        }
      }
    });

    const clientName = `${lawyerRequest.user.name}`;
    await createNewRequestNotificationForLawyer(
      lawyer.id,
      clientName,
      lawyerRequest.id,
      lawyerRequest.pqr?.subject || undefined
    );

    return NextResponse.json(lawyerRequest, { status: 201 });

  } catch (error) {
    console.error("Error creating lawyer request:", error);
    return NextResponse.json(
      { error: "Error al crear la solicitud de abogado" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { requestId, newStatus } = await request.json();

    if (!requestId || !newStatus) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: requestId y newStatus" },
        { status: 400 }
      );
    }

    const lawyer = await prisma.lawyer.findUnique({
      where: { 
        userId: currentUserId.id,
        user: {
          isActive: true
        }
      }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "No se encontró el perfil de abogado o no tiene permisos" },
        { status: 403 }
      );
    }

    const existingRequest = await prisma.lawyerRequest.findUnique({
      where: {
        id: requestId,
        lawyerId: lawyer.id
      }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada o no tienes permisos para modificarla" },
        { status: 404 }
      );
    }

    const validTransitions: Record<LawyerRequestStatus, LawyerRequestStatus[]> = {
      PENDING: ['ACCEPTED', 'REJECTED'],
      ACCEPTED: ['COMPLETED', 'REJECTED'],
      REJECTED: [],
      COMPLETED: [] 
    };

    if (!validTransitions[existingRequest.status].includes(newStatus as LawyerRequestStatus)) {
      return NextResponse.json(
        { error: "Transición de estado no permitida" },
        { status: 400 }
      );
    }
    const updatedRequest = await prisma.lawyerRequest.update({
      where: {
        id: requestId
      },
      data: {
        status: newStatus
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        lawyer: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        pqr: true
      }
    });

    if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
      const lawyerName = `${updatedRequest.lawyer.user.name}`;
      const notificationType = newStatus === 'ACCEPTED' ? 'lawyer_request_accepted' : 'lawyer_request_rejected';
      
      await createLawyerRequestNotification(
        updatedRequest.userId,
        notificationType,
        lawyerName,
        requestId
      );
    }

    return NextResponse.json(updatedRequest, { status: 200 });

  } catch (error) {
    console.error("Error updating lawyer request:", error);
    return NextResponse.json(
      { error: "Error al actualizar la solicitud de abogado" },
      { status: 500 }
    );
  }
}