export interface Entity {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  email?: string;
  isVerified: boolean;
  createdAt: string;
  category: {
    name: string;
  };
  RegionalDepartment?: {
    name: string;
  };
  Municipality?: {
    name: string;
  };
  _count?: {
    pqrs: number;
  };
}