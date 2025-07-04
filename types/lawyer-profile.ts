export interface LawyerProfileData {
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
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | null;
    phone: string | null;
  };
}