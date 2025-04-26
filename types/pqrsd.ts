export interface PQR {
  id: string;
  type: "PETITION" | "COMPLAINT" | "CLAIM" | "SUGGESTION" | "REPORT";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  dueDate: Date;
  anonymous: boolean;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
  } | null;
  department: {
    name: string;
    entity: {
      name: string;
    };
  };
  likes: { id: string }[];
  customFieldValues: { name: string; value: string }[];
  attachments: any[];
  comments: {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
  _count: {
    likes: number;
    comments: number;
  };
}