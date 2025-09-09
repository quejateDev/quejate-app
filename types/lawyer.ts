export interface Lawyer {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
  };
}

export interface LawyerFormData {
  documentType: string;
  identityDocument: string;
  identityDocumentImage: File | null;
  professionalCardImage: File | null;
  licenseNumber: string;
  specialties: string;
  description: string;
  feePerHour: string;
  image: File | null;
}