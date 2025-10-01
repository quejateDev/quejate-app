
import { CreateNotificationInput } from '@/types/notification';
import prisma from "@/lib/prisma";

export const NotificationFactory = {
  createFollow: (
    userId: string, 
    follower: { id: string; name: string | null; image?: string | null },
  ): CreateNotificationInput => ({
    userId,
    type: "follow",
    message: `${follower.name} ha comenzado a seguirte`,
    read: false,
    data: {
      type: "follow",
      followerId: follower.id,
      followerName: follower.name || 'Usuario',
      followerImage: follower.image || undefined,
    },
  }),

  createLike: (
    userId: string,
    pqrId: string, 
    user: { id: string; name: string | null; image?: string | null } 
  ): CreateNotificationInput => ({
    userId,
    type: "like",
    message: `A ${user.name} le gusta tu PQRSD`,
    read: false,
    data: {
      type: "like",
      pqrId,
      userId: user.id,
      userName: user.name || 'Usuario',
      userImage: user.image || undefined,
    },
  }),

  createComment: (
    userId: string,
    pqrId: string,
    user: { id: string; name: string | null; image?: string | null },
    commentId?: string
  ): CreateNotificationInput => ({
    userId,
    type: "comment",
    message: `${user.name} ha comentado tu PQRSD`,
    read: false,
    data: {
      type: "comment",
      pqrId,
      userId: user.id,
      userName: user.name || 'Usuario',
      userImage: user.image || undefined,
      ...(commentId && { commentId }),
    },
  }),

  createLawyerRequestAccepted: (
    userId: string,
    lawyerName: string | null,
    requestId: string
  ): CreateNotificationInput => ({
    userId,
    type: "lawyer_request_accepted",
    message: `${lawyerName} ha aceptado tu solicitud de asesoría legal`,
    read: false,
    data: {
      type: "lawyer_request_accepted",
      requestId,
      lawyerName: lawyerName || 'Abogado',
    },
  }),

  createLawyerRequestRejected: (
    userId: string,
    lawyerName: string | null,
    requestId: string,
    rejectionMessage?: string
  ): CreateNotificationInput => ({
    userId,
    type: "lawyer_request_rejected",
    message: `${lawyerName} ha rechazado tu solicitud de asesoría legal`,
    read: false,
    data: {
      type: "lawyer_request_rejected",
      requestId,
      lawyerName: lawyerName || 'Abogado',
      ...(rejectionMessage && { rejectionMessage }),
    },
  }),

  createNewLawyerRequest: (
    lawyerUserId: string,
    clientName: string | null,
    requestId: string,
    pqrSubject?: string | null
  ): CreateNotificationInput => ({
    userId: lawyerUserId,
    type: "new_lawyer_request",
    message: pqrSubject 
      ? `${clientName} ha enviado una solicitud de asesoría para una PQRSD: "${pqrSubject}"`
      : `${clientName} ha enviado una nueva solicitud de asesoría legal`,
    read: false,
    data: {
      type: "new_lawyer_request",
      requestId,
      clientName: clientName || 'Cliente',
      ...(pqrSubject && { pqrSubject }),
    },
  }),

  createPQRSDTimeExpired: (
    userId: string,
    pqrId: string,
    pqrSubject: string
  ): CreateNotificationInput => ({
    userId,
    type: "pqrsd_time_expired",
    message: `Tu PQRSD "${pqrSubject}" ha excedido el plazo de 15 días sin respuesta`,
    read: false,
    data: {
      type: "pqrsd_time_expired",
      pqrId,
      pqrSubject,
    },
  }),
};

export const notificationService = {
  async create(notificationInput: CreateNotificationInput) {
    return await prisma.notification.create({
      data: notificationInput,
    });
  },

  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },

  async getByUser(userId: string, options?: { read?: boolean; take?: number }) {
    return await prisma.notification.findMany({
      where: { 
        userId,
        ...(options?.read !== undefined && { read: options.read })
      },
      orderBy: { createdAt: 'desc' },
      take: options?.take,
    });
  },

  async countUnread(userId: string) {
    return await prisma.notification.count({
      where: { 
        userId,
        read: false 
      },
    });
  },
};