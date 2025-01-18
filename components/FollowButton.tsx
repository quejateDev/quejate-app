"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { followUserService } from "@/services/api/User.service";
import useAuthStore from "@/store/useAuthStore";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: (
    isFollowing: boolean,
    counts?: { followers: number; following: number; PQRS: number }
  ) => void;
}

export function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuthStore();

  const handleFollow = async () => {
    if (!user || user.id === userId) return;

    setIsLoading(true);
    try {
      const { followed, counts } = await followUserService(userId, token as string);
      setIsFollowing(followed);
      onFollowChange?.(followed, counts);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.id === userId) return null;

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isFollowing ? "Dejar de seguir" : "Seguir"}
    </Button>
  );
}
