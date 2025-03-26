"use client";
import { useEffect, useRef } from "react";

export function useVideoPlayback() {
  const videoRefsDesktop = useRef<(HTMLVideoElement | null)[]>([]);
  const videoRefsMobile = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      videoRefsDesktop.current.forEach((video) => {
        if (video && !video.paused) {
          video.muted = true;
        }
      });
      videoRefsMobile.current.forEach((video) => {
        if (video && !video.paused) {
          video.muted = true;
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