import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LawyerRequestStatus } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { NotificationFactory, notificationService } from "@/services/api/notification.service";
import { proxyToBackend } from "@/lib/api/proxy";

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

/**
 * Pedir asesoría a un abogado → `POST /lawyer/request`.
 *
 * Bloque A (contrato congelado): lo llama `useLawyers.ts:73` de la móvil.
 * Devuelve **201** con la solicitud creada, y conserva los rechazos del
 * original: 400 sin `lawyerId`/`message` o sin ningún método de contacto, 403
 * si el cliente no está activo y 404 si el abogado o la PQRSD referida no
 * existen o no son suyos.
 *
 * ⚠️ El `GET` y el `PATCH` de este mismo fichero son del **bloque B** (solo los
 * usa la web) y se repuntan en el commit siguiente: Next obliga a que todos los
 * métodos de una ruta vivan en un único fichero.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/lawyer/request");
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
      const lawyerName = updatedRequest.lawyer.user.name;

      if (newStatus === 'ACCEPTED') {
        const notificationInput = NotificationFactory.createLawyerRequestAccepted(
          updatedRequest.userId,
          lawyerName,
          requestId
        );
        await notificationService.create(notificationInput);
      } else {
        const notificationInput = NotificationFactory.createLawyerRequestRejected(
          updatedRequest.userId,
          lawyerName,
          requestId
        );
        await notificationService.create(notificationInput);
      }
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