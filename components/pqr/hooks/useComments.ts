"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getCommentsService } from "@/services/api/pqr.service";

export function useComments(pqrId: string, initialCommentCount: number = 0) {
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const fetchCommentCount = useCallback(async () => {
    if (!pqrId) return;
    
    setIsLoading(true);
    try {
      const comments = await getCommentsService(pqrId);
      setCommentCount(comments.length);
    } catch (error) {
      console.error("Error fetching comment count:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pqrId]);

  const toggleComments = useCallback(() => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    if (newVisibility) {
      fetchCommentCount();
    }
  }, [isVisible, fetchCommentCount]);

  const incrementCount = useCallback(() => {
    setCommentCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (initialCommentCount === 0) {
      fetchCommentCount();
    }
  }, [initialCommentCount, fetchCommentCount]);

  return {
    commentCount,
    isLoading,
    isVisible,
    toggleComments,
    incrementCount,
    fetchCommentCount
  };
}