export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
  role: string;
  isFollowing?: boolean;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}