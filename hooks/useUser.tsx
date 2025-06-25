"use client";

import { getUserService } from "@/services/api/User.service";
import { useState } from "react";

interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isFollowing: boolean;
  followers: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }>;
  following: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }>;
  profilePicture: string | null;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUserPQRS(id: string) {
    try {
      const response = await fetch(`/api/pqr/user?userId=${id}`);
      if (!response.ok) throw new Error("Error fetching PQRS");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user PQRs:", error);
      setError("Failed to load user PQRS");
      return [];
    }
  }

  async function fetchUser(id: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await getUserService(id);
      setUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user data");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const clearUser = () => {
    setUser(null);
    setIsLoading(true);
    setError(null);
  };

  return {
    fetchUser,
    fetchUserPQRS,
    user,
    setUser,
    isLoading,
    error,
    clearUser,
  };
}
