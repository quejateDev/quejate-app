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
  municipality?: string | null;
  department?: string | null; 
  _count?: {
    pqrs: number;
  };
}