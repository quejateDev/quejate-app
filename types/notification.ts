export type NotificationType =
  | "follow"
  | "like"
  | "comment"
  | "lawyer_request_accepted"
  | "lawyer_request_rejected"
  | "new_lawyer_request"
  | "pqrsd_time_expired"
  ;

export type NotificationData =
  | {
    type: "follow";
    followerId: string;
    followerName: string;
    followerImage?: string;
  }
  | {
    type: "like";
    pqrId: string;
    userId: string;
    userName: string;
    userImage?: string;
  }
  | {
    type: "comment";
    pqrId: string;
    userId: string;
    userName: string;
    userImage?: string;
  }
  | {
    type: "lawyer_request_accepted" | "lawyer_request_rejected";
    requestId: string;
    lawyerName: string;
    rejectionMessage?: string;
  }
  | {
    type: "new_lawyer_request";
    requestId: string;
    clientName: string;
    pqrSubject?: string;
  }
  | {
    type: "pqrsd_time_expired";
    pqrId: string;
    pqrSubject: string;
  };


export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  data: NotificationData;
};

export type CreateNotificationInput = Omit<Notification, 'id' | 'createdAt'>;

export const isFollowNotification = (data: NotificationData): data is Extract<NotificationData, { type: "follow" }> =>
  data.type === "follow";

export const isLikeNotification = (data: NotificationData): data is Extract<NotificationData, { type: "like" }> =>
  data.type === "like";

export const isCommentNotification = (data: NotificationData): data is Extract<NotificationData, { type: "comment" }> =>
  data.type === "comment";

export const isLawyerRequestAcceptedNotification = (data: NotificationData): data is Extract<NotificationData, { type: "lawyer_request_accepted" }> =>
  data.type === "lawyer_request_accepted";

export const isLawyerRequestRejectedNotification = (data: NotificationData): data is Extract<NotificationData, { type: "lawyer_request_rejected" }> =>
  data.type === "lawyer_request_rejected";

export const isNewLawyerRequestNotification = (data: NotificationData): data is Extract<NotificationData, { type: "new_lawyer_request" }> =>
  data.type === "new_lawyer_request";

export const isPQRSDTimeExpiredNotification = (data: NotificationData): data is Extract<NotificationData, { type: "pqrsd_time_expired" }> =>
  data.type === "pqrsd_time_expired";