import { UserBasic } from "./user-basic";
export interface User extends UserBasic {
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