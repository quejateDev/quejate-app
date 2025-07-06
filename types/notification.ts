
export type Notification = {
  id: string;
  type: "follow" | "mention" | "like" | "comment" | "lawyer_request_accepted" | "lawyer_request_rejected" | "new_lawyer_request";
  message: string;
  read: boolean;
  createdAt: Date;
  data?: {
    followerId?: string;
    followerName?: string;
    followerImage?: string;
    pqrId?: string;
    requestId?: string;
    lawyerName?: string;
    rejectionMessage?: string;
    clientName?: string;
    pqrSubject?: string;
  };
};