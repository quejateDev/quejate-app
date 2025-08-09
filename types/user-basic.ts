export interface UserBasic {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  profilePicture: string | null;
  phone: string | null;
  role: string | null;
}