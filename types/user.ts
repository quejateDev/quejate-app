export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  role: string;
  isFollowing: boolean;
  followers: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
  following: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}