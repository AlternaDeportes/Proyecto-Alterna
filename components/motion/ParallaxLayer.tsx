"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useParallaxOffset } from "@/lib/motion/use-scroll-progress";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Intensidad 0.1–0.4 */
  factor?: number;
}

/**
 * Capa parallax sutil — hero / fondos documentales.
 * Se anula con prefers-reduced-motion.
 */
export function ParallaxLayer({
  children,
  className,
  factor = 0.22,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useParallaxOffset(ref, factor);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      <div
        className="relative h-full w-full motion-reduce:transform-none"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.08)` }}
      >
        {children}
      </div>
    </div>
  );
}
