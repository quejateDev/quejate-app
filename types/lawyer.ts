export interface Lawyer {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | null;
    phone: string | null;
  };
}