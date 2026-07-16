"use client";

import { useEffect, useRef } from "react";

/**
 * Video de fondo del hero — loop documental.
 * Fallback a gradiente si el archivo no está o falla la reproducción.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onError = () => {
      video.style.display = "none";
      video.parentElement?.classList.add("hero-video--fallback");
    };

    video.addEventListener("error", onError);
    const playAttempt = video.play();
    if (playAttempt?.catch) {
      playAttempt.catch(onError);
    }

    return () => video.removeEventListener("error", onError);
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src="/assets/video/hero-loop.webm" type="video/webm" />
      <source src="/assets/video/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}
