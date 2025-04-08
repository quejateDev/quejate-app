"use client";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/services/api/pqr.service";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useLoginModal } from "@/providers/LoginModalProivder";
import { motion, AnimatePresence } from "framer-motion";

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
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      await toggleLike(pqrId, user.id);
    } catch (error) {
      setLiked(initialLiked);
      setLikeCount((prev) => (initialLiked ? prev + 1 : prev - 1));
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
    <div className="gap-2 flex items-center px-3 text-sm">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => (isLoading ? null : handleLike())}
        className="relative cursor-pointer"
      >
        <AnimatePresence>
          {liked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute bg-red-500 rounded-full"
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Heart
          className={cn(
            "w-4 h-4",
            liked ? "fill-current text-red-500" : "text-gray-500"
          )}
        />
      </motion.div>
      
      <motion.span
        key={likeCount}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {likeCount}
      </motion.span>
    </div>
  );
}
