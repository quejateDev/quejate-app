import { UserBasic } from "./user-basic";
export interface User extends UserBasic {
  followers: Array<{
    id: string;
    name: string;
  }>;
  following: Array<{
    id: string;
    name: string;
  }>;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}