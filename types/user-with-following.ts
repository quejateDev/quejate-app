import { User } from "./user";

export interface UserWithFollowingStatus extends User {
  isFollowing?: boolean;
  isOAuth?: boolean | null;
}