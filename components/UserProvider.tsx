"use client";

import { UserWithFollowingStatus } from "@/types/user-with-following";
import { createContext, useContext, ReactNode } from "react";

type UserContextType = UserWithFollowingStatus | null;

const UserContext = createContext<UserContextType>(null);

interface UserProviderProps {
  value: UserContextType;
  children: ReactNode;
}

export function UserProvider({ value, children }: UserProviderProps) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useFullUser() {
  return useContext(UserContext);
}
