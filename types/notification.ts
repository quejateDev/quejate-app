export type NotificationType =
  | "follow"
  | "mention"
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
    type: "like" | "comment";
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