"use client";

import { useState, useCallback } from "react";
import { useCurrentUser } from "./use-current-user";
import { useLoginModal } from "@/providers/LoginModalProvider";

export function useComments(initialComments: any[] = []) {
  const [commentCount, setCommentCount] = useState(initialComments.length);
  const [isVisible, setIsVisible] = useState(false);
  const [localComments, setLocalComments] = useState(initialComments);
  const { setIsOpen } = useLoginModal();
  
  const user = useCurrentUser();

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