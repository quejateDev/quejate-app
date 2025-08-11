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