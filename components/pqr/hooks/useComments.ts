"use client";

import { useState, useCallback } from "react";

export function useComments(initialComments: any[] = []) {
  const [commentCount, setCommentCount] = useState(initialComments.length);
  const [isVisible, setIsVisible] = useState(false);
  const [localComments, setLocalComments] = useState(initialComments);

  const toggleComments = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

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