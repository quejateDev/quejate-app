"use client";

import { useLoginModal } from "@/providers/LoginModalProivder";
import useAuthStore from "@/store/useAuthStore";
import { useState, useCallback } from "react";

export function useComments(initialComments: any[] = []) {
  const [commentCount, setCommentCount] = useState(initialComments.length);
  const [isVisible, setIsVisible] = useState(false);
  const [localComments, setLocalComments] = useState(initialComments);
  const { setIsOpen } = useLoginModal();
  const { user } = useAuthStore();

  const toggleComments = useCallback(() => {
    if (!user) {
      setIsOpen(true);
      return;
    }
    setIsVisible(prev => !prev);
  }, [user]);

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
    toggleComments,
    incrementCount,
    localComments,
    addLocalComment
  };
}