export interface UserBasic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  phone: string | null;
  role: string;
}