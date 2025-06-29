
export type Notification = {
  id: string;
  type: "follow" | "mention" | "like" | "comment";
  message: string;
  read: boolean;
  createdAt: Date;
  data?: {
    followerId?: string;
    followerName?: string;
    followerImage?: string;
    pqrId?: string;
  };
};