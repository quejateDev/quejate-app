export interface Rating {
  id: string;
  score: number;
  comment?: string;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}