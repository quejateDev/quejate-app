import { UserBasic } from "./user-basic";

export interface LawyerProfileData extends UserBasic {
  id: string;
  userId: string;
  documentType: string;
  identityDocument: string;
  specialties: string[];
  description: string | null;
  feePerHour: number | null;
  feePerService: number | null;
  experienceYears: number;
  averageRating: number;
  ratingCount: number;
}