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
  Municipality?: {
    name: string;
    RegionalDepartment: {
      name: string;
    };
  };
  _count?: {
    pqrs: number;
  };
}