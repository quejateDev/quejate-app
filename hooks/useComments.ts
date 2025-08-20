"use client";

import { useState, useCallback } from "react";
import { useCurrentUser } from "./use-current-user";
import { useLoginModal } from "@/providers/LoginModalProvider";

export function useComments(initialCommentCount: number = 0) {
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isVisible, setIsVisible] = useState(false);
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { setIsOpen } = useLoginModal();
  
  const user = useCurrentUser();

  const fetchComments = useCallback(async (pqrId: string) => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`/api/pqr/${pqrId}/comments`);
      if (response.ok) {
        const comments = await response.json();
        setLocalComments(comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  }, []);

  const toggleComments = useCallback(async (pqrId: string) => {
    if (!user) {
      setIsOpen(true);
      return;
    }
    
    if (!isVisible) {
      await fetchComments(pqrId);
    }
    
    setIsVisible(prev => !prev);
  }, [user, isVisible, fetchComments]);

  const incrementCount = useCallback(() => {
    setCommentCount(prev => prev + 1);
  }, []);

  const addLocalComment = useCallback((newComment: any) => {
    setLocalComments(prev => [newComment, ...prev]);
    incrementCount();
  }, [incrementCount]);

  return {
    commentCount,
    isVisible,
    isLoadingComments,
    toggleComments,
    incrementCount,
    localComments,
    addLocalComment
  };
}