import { UserBasic } from "./user-basic";
export interface User extends UserBasic {
  followers: Array<{
    id: string;
    name: string | null;
  }>;
  following: Array<{
    id: string;
    name: string | null;
  }>;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}