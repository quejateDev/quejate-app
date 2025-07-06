import prisma from "@/lib/prisma";

export async function createLawyerRequestNotification(
  userId: string,
  type: "lawyer_request_accepted" | "lawyer_request_rejected",
  lawyerName: string,
  requestId: string,
  message?: string
) {
  try {
    const notificationMessage = type === "lawyer_request_accepted" 
      ? `${lawyerName} ha aceptado tu solicitud de asesoría legal`
      : `${lawyerName} ha rechazado tu solicitud de asesoría legal`;

    await prisma.notification.create({
      data: {
        userId,
        type,
        message: notificationMessage,
        data: {
          requestId,
          lawyerName,
          ...(message && { rejectionMessage: message })
        }
      }
    });
  } catch (error) {
    console.error("Error creating lawyer request notification:", error);
  }
}

export async function createNewRequestNotificationForLawyer(
  lawyerId: string,
  clientName: string,
  requestId: string,
  pqrSubject?: string
) {
  try {
    const notificationMessage = pqrSubject 
      ? `${clientName} ha enviado una solicitud de asesoría para la PQR: "${pqrSubject}"`
      : `${clientName} ha enviado una nueva solicitud de asesoría legal`;

    const lawyer = await prisma.lawyer.findUnique({
      where: { id: lawyerId },
      select: { userId: true }
    });

    if (!lawyer) {
      throw new Error('Abogado no encontrado');
    }

    await prisma.notification.create({
      data: {
        userId: lawyer.userId,
        type: "new_lawyer_request",
        message: notificationMessage,
        data: {
          requestId,
          clientName,
          ...(pqrSubject && { pqrSubject })
        }
      }
    });
  } catch (error) {
    console.error("Error creating new request notification for lawyer:", error);
  }
}
