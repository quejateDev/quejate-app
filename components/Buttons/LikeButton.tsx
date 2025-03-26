"use client";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/services/api/pqr.service";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useLoginModal } from "@/providers/LoginModalProivder";

export default function LikeButton({
  initialLiked,
  pqrId,
  likes,
}: {
  initialLiked: boolean;
  pqrId: string;
  likes: number;
}) {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const { setIsOpen } = useLoginModal();

  const handleLike = async () => {
    if (!user || !user.id) {
      setIsOpen(true);
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
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleLike}
      disabled={isLoading}
      >
        <Heart
          className={cn(
            "w-4 h-4",
            liked ? "fill-current text-red-500" : "text-gray-500"
          )}
        />
      <span>{likeCount}</span>
    </Button>
  );
}
