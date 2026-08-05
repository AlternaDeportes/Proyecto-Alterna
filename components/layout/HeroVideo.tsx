"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HERO_POSTER, HERO_VIDEO_MP4, HERO_VIDEO_WEBM } from "@/config/media";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";

/**
 * Fondo del hero: video + poster con parallax y ken-burns.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markOk = () => setVideoOk(true);
    const markFail = () => setVideoOk(false);

    video.addEventListener("playing", markOk);
    video.addEventListener("error", markFail);

    const attempt = video.play();
    if (attempt?.catch) {
      attempt.catch(markFail);
    }

    return () => {
      video.removeEventListener("playing", markOk);
      video.removeEventListener("error", markFail);
    };
  }, []);

  return (
    <ParallaxLayer className="absolute inset-0" factor={0.28}>
      <div className="absolute inset-0">
        <Image
          src={HERO_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover motion-safe:animate-ken-burns"
          aria-hidden
        />

        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: videoOk ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          aria-hidden
        >
          <source src={HERO_VIDEO_WEBM} type="video/webm" />
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
      </div>
    </ParallaxLayer>
  );
}
