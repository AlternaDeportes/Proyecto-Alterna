"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HERO_FADE_MS,
  HERO_POSTER,
  HERO_SLIDE_MS,
  buildHeroPlaylist,
  sportFromHeroSrc,
} from "@/config/media";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Fondo del hero: 9 fotos (3 por deporte).
 * Crossfade largo + Ken Burns en el contenedor (no se reinicia al cambiar ni al loop).
 */
export function HeroVideo() {
  const reduced = usePrefersReducedMotion();
  const playlistRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const frontRef = useRef<0 | 1>(0);
  const [layers, setLayers] = useState<[string, string]>([HERO_POSTER, HERO_POSTER]);
  const [front, setFront] = useState<0 | 1>(0);

  useEffect(() => {
    const list = buildHeroPlaylist();
    playlistRef.current = list;
    indexRef.current = 0;
    const first = list[0] ?? HERO_POSTER;
    setLayers([first, first]);
    setFront(0);
    frontRef.current = 0;
    preloadHeroImage(list[1]);
  }, []);

  useEffect(() => {
    if (reduced || playlistRef.current.length < 2) return;

    const id = window.setInterval(() => {
      const list = playlistRef.current;
      if (indexRef.current >= list.length - 2) {
        const last = list[list.length - 1] ?? list[indexRef.current];
        playlistRef.current = list.concat(
          buildHeroPlaylist(sportFromHeroSrc(last ?? HERO_POSTER))
        );
      }

      indexRef.current += 1;
      const next = playlistRef.current[indexRef.current] ?? HERO_POSTER;
      const incoming = (1 - frontRef.current) as 0 | 1;

      setLayers((prev) => {
        const nextLayers: [string, string] = [prev[0], prev[1]];
        nextLayers[incoming] = next;
        return nextLayers;
      });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          frontRef.current = incoming;
          setFront(incoming);
        });
      });

      preloadHeroImage(playlistRef.current[indexRef.current + 1]);
    }, HERO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <ParallaxLayer className="absolute inset-0" factor={0.28}>
      <div className="absolute inset-0 motion-safe:animate-ken-burns">
        <HeroLayer src={layers[0]} visible={front === 0} priority />
        <HeroLayer src={layers[1]} visible={front === 1} />
      </div>
    </ParallaxLayer>
  );
}

function HeroLayer({
  src,
  visible,
  priority,
}: {
  src: string;
  visible: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      className={cn(
        "object-cover will-change-[opacity]",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionProperty: "opacity",
        transitionDuration: `${HERO_FADE_MS}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
      aria-hidden
    />
  );
}

function preloadHeroImage(src: string | undefined) {
  if (!src || typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}
