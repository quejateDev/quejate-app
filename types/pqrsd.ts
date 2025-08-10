import { statusMap, typeMap } from "@/constants/pqrMaps";

export interface PQR {
  id: string;
  type: keyof typeof typeMap;
  status: keyof typeof statusMap;
  dueDate: Date;
  anonymous: boolean;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
  subject?: string | null;
  description?: string | null;
  creator: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  department: {
    name: string;
  } | null;
  entity: {
    id: string;
    name: string;
  };
  likes: { id: string; userId: string }[];
  customFieldValues: { name: string; value: string }[];
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  comments: {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      name: string;
    };
  }[];
  _count: {
    likes: number;
    comments: number;
  };
}