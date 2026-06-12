import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendPQRCreationEmail } from "@/services/email/Resend.service";
import { sendPQRNotificationEmail } from "@/services/email/sendPQRNotification";
import { calculateDueDate, getOverdueInfo } from "@/utils/dateHelpers";
import { currentUser } from "@/lib/auth";

interface FormFile extends File {
  arrayBuffer(): Promise<ArrayBuffer>;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const pqrs = await prisma.pQRS.findMany({
      where: {
        private: false,
        creatorId: { not: null }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        department: {
          select: {
            name: true,
            entity: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true
          },
        },
        customFieldValues: {
          select: {
            name: true,
            value: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            size: true,
            thumbnailUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    const totalCount = await prisma.pQRS.count({
      where: {
        private: false,
        creatorId: { not: null }
      }
    });

    const hasMore = skip + take < totalCount;

    const pqrsWithOverdue = pqrs.map((p) => ({ ...p, ...getOverdueInfo(p) }));

    return NextResponse.json({
      pqrs: pqrsWithOverdue,
      hasMore,
      nextPage: hasMore ? page + 1 : null
    });

  } catch (error) {
    console.error("Error fetching PQRSD:", error);
    return NextResponse.json({ error: "Error fetching PQRSD" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { error: "Request body is missing" },
      { status: 400 }
    );
  }

  // #5: crear una PQRSD exige sesión (cookie web o Bearer móvil). El creatorId
  // se deriva de la sesión, no del body, para evitar suplantación.
  const authUser = await currentUser();
  if (!authUser?.id) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para crear una PQRSD" },
      { status: 401 }
    );
  }
  const creatorId = authUser.id;

  let createdPqrId: string | null = null;
  let consecutiveRollback: { id: string; previous: number } | null = null;

  try {
    const formData = await req.formData();
    const jsonData = formData.get("data");

    if (!jsonData) {
      return NextResponse.json({ error: "Missing PQR data" }, { status: 400 });
    }

    const body = JSON.parse(jsonData as string);

    // Solo validar reCAPTCHA en producción
    if (process.env.NODE_ENV === 'production') {
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

    const today = new Date();
    const fechaConsecutivo = today.toISOString().split('T')[0].replace(/-/g, '');

    const pqrCountToday = await prisma.pQRS.count({
      where: {
        entityId: body.entityId,
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });

    const dailyCounter = pqrCountToday + 1;
    const newConsecutiveCode = `${consecutiveCode.code}-${fechaConsecutivo}-${dailyCounter}`;
    
    let creatorPhone = null;
    if (body.includePhone && !body.isAnonymous) {
      const creator = await prisma.user.findUnique({
        where: { id: creatorId },
        select: { phone: true },
      });
      creatorPhone = creator?.phone || null;
    }

    // Obtener dirección legible si hay coordenadas
    let locationAddress: string | undefined = undefined;
    if (body.latitude && body.longitude) {
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${body.latitude}&lon=${body.longitude}&format=json&accept-language=es`,
          { headers: { "Accept-Language": "es" } }
        );
        const geoData = await geoResponse.json();
        if (geoData.display_name) {
          locationAddress = geoData.display_name;
        }
      } catch (error) {
        console.error("Error obteniendo dirección:", error);
      }
    }
    
    // Create PQR with attachments
    const [pqr] = await prisma.$transaction([
      prisma.pQRS.create({
        data: {
          type: body.type,
          dueDate,
          anonymous: body.isAnonymous || false,
          departmentId: body.departmentId,
          entityId: body.entityId,
          creatorId,
          subject: body.subject,
          description: body.description,
          guestName: body.guestName,
          guestEmail: body.guestEmail,
          guestPhone: body.guestPhone,
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
                thumbnailUrl: attachment.thumbnailUrl ?? null,
              })),
            },
          },
          consecutiveCode: newConsecutiveCode,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
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

    createdPqrId = pqr.id;
    consecutiveRollback = { id: consecutiveCode.id, previous: consecutiveCode.consecutive };

    const entity = await prisma.entity.findUnique({
      where: { 
        id: body.entityId,
      },
      select: { name: true, email: true },
    });

    if (!entity) {
      throw new Error("Entity not found after PQR creation");
    }

    if (!pqr.consecutiveCode) {
      throw new Error("No consecutive code found for this PQR");
    }

    let recipientEmail: string | null = null;
    let recipientName: string = '';

    if (body.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: body.departmentId },
        select: { email: true, name: true },
      });

      if (department?.email) {
        recipientEmail = department.email;
        recipientName = department.name;
      }
    }

    if (!recipientEmail) {
      if (entity.email) {
        recipientEmail = entity.email;
        recipientName = entity.name;
      } else {
        // Sin email de área ni de entidad: la PQR ya quedó registrada;
        // se omite la notificación por correo en lugar de fallar y orfanar la PQR.
        console.warn(
          `PQR ${createdPqrId} creada sin destinatario de correo (entidad ${body.entityId} sin email).`
        );
      }
    }

    let contactInfo = {
      name: 'Anónimo',
      email: 'Anónimo',
      phone: 'Anónimo'
    };

    if (!body.isAnonymous) {
      const creator = await prisma.user.findUnique({
        where: { id: creatorId },
        select: { name: true, email: true, phone: true },
      });

      contactInfo = {
        name: creator?.name || 'Usuario registrado',
        email: creator?.email || 'No proporcionado',
        phone: creatorPhone || 'No proporcionado'
      };
    }

    // Notificaciones por correo (best-effort: no deben tumbar la creación de la PQR)
    try {
      // Notificación al destinatario (área o entidad)
      if (recipientEmail) {
        await sendPQRNotificationEmail(
          recipientEmail,
          recipientName,
          { ...pqr, locationAddress },
          contactInfo
        );
      }

      // Confirmación al creador autenticado
      if (creatorId) {
        const creator = await prisma.user.findUnique({
          where: { id: creatorId },
          select: { name: true, email: true },
        });

        if (creator?.email) {
          await sendPQRCreationEmail(
            creator.email,
            creator.name || "Usuario registrado",
            "Registro exitoso de PQR @quejate.com.co",
            pqr.consecutiveCode,
            new Date(pqr.createdAt).toLocaleString("es-CO", {
              timeZone: "America/Bogota",
            }),
            `https://quejate.com.co/dashboard/pqr/${pqr.id}`,
            entity.name,
            recipientEmail ?? ""
          );
        }
      }
    } catch (emailError) {
      console.error(
        "Error enviando notificaciones de la PQR (la PQR sí fue creada):",
        emailError
      );
    }

    return NextResponse.json(pqr);
  } catch (error: any) {
    console.error("Error in POST /api/pqr:", error?.stack || error);

    // Rollback: si la PQR alcanzó a crearse pero algo falló después,
    // se elimina y se restaura el consecutivo de la entidad.
    if (createdPqrId) {
      try {
        const rollbackOps: any[] = [
          prisma.pQRS.delete({ where: { id: createdPqrId } }),
        ];

        if (consecutiveRollback) {
          rollbackOps.push(
            prisma.entityConsecutive.update({
              where: { id: consecutiveRollback.id },
              data: { consecutive: consecutiveRollback.previous },
            })
          );
        }

        await prisma.$transaction(rollbackOps);
      } catch (rollbackError) {
        console.error("Error during PQR rollback:", rollbackError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error", details: error?.message },
      { status: 500 }
    );
  }
}
