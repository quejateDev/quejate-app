"use client";
import { useEffect, useRef } from "react";

export function useVideoPlayback() {
  const videoRefsDesktop = useRef<(HTMLVideoElement | null)[]>([]);
  const videoRefsMobile = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      videoRefsDesktop.current.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
      videoRefsMobile.current.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { videoRefsDesktop, videoRefsMobile };
}