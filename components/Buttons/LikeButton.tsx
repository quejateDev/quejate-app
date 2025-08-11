"use client";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/services/api/pqr.service";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useLoginModal } from "@/providers/LoginModalProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useFullUser } from "../UserProvider";

// Componente para las partículas de like
const LikeParticle = ({ delay = 0 }) => {
  const randomX = Math.random() * 100 - 50;
  const randomY = Math.random() * 100 - 50;
  const randomSize = Math.random() * 8 + 4;
  const randomDuration = Math.random() * 0.5 + 0.5;
  
  return (
    <motion.div
      initial={{ 
        x: 0, 
        y: 0, 
        scale: 0, 
        opacity: 0 
      }}
      animate={{ 
        x: randomX, 
        y: randomY, 
        scale: [0, 1, 0], 
        opacity: [0, 1, 0] 
      }}
      transition={{ 
        duration: randomDuration, 
        delay, 
        ease: "easeOut" 
      }}
      className="absolute bg-red-500 rounded-full"
      style={{ 
        width: randomSize, 
        height: randomSize,
        zIndex: 10
      }}
    />
  );
};

export default function LikeButton({
  initialLiked,
  pqrId,
  likes,
}: {
  initialLiked: boolean;
  pqrId: string;
  likes: number;
}) {
  const user = useFullUser();
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [showParticles, setShowParticles] = useState(false);
  const { setIsOpen } = useLoginModal();

  // Efecto para mostrar partículas cuando se hace like
  useEffect(() => {
    if (liked) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [liked]);

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
        {/* Partículas de like */}
        <AnimatePresence>
          {showParticles && (
            <>
              {[...Array(12)].map((_, i) => (
                <LikeParticle key={i} delay={i * 0.05} />
              ))}
            </>
          )}
        </AnimatePresence>
        
        {/* Efecto de pulso cuando se hace like */}
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
        
        {/* Icono de corazón con animación */}
        <motion.div
          animate={{ 
            scale: liked ? [1, 1.2, 1] : 1,
            rotate: liked ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <Heart
            className={cn(
              "w-4 h-4",
              liked ? "fill-current text-red-500" : "text-gray-500"
            )}
          />
        </motion.div>
      </motion.div>
      
      {/* Contador con animación */}
      <motion.span
        key={likeCount}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "font-medium",
          liked ? "text-red-500" : "text-gray-500"
        )}
      >
        {likeCount}
      </motion.span>
    </div>
  );
}
