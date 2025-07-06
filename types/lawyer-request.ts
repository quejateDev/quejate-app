import { PaginationData } from "./pagination";

export interface LawyerRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  message: string;
  createdAt: string;
  updatedAt: string;
  lawyer: {
    id: string;
    specialties: string[];
    description?: string;
    feePerHour?: number;
    experienceYears: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      profilePicture?: string;
      phone?: string;
    };
    receivedRatings: Array<{ score: number }>;
  };
  pqr?: {
    id: string;
    subject: string;
    description: string;
  };
}

export interface ApiResponse {
  data: LawyerRequest[];
  pagination: PaginationData;
}