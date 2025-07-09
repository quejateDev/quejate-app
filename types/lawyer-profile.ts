import { Lawyer } from "./lawyer";
export interface LawyerData extends Lawyer {
  id: string;
  userId: string;
  documentType: string;
  identityDocument: string;
  specialties: string[];
  isVerified: boolean;
  description: string | null;
  feePerHour: number | null;
  feePerService: number | null;
  experienceYears: number;
  averageRating: number;
  ratingCount: number;
}