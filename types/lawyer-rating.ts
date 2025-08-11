export interface Rating {
  id: string;
  score: number;
  comment?: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    image?: string;
  };
}