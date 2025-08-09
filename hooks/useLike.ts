"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { toggleLike } from "@/services/api/pqr.service";
import { useCurrentUser } from "./use-current-user";

export function useLike(pqrId: string, initialLiked: boolean, initialLikeCount: number) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const user = useCurrentUser();

  const handleLike = async () => {
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para dar like",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await toggleLike(pqrId, user.id);
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar tu like",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { liked, likeCount, isLoading, handleLike };
}