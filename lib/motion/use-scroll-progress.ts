"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * Progreso de scroll del documento (0–1).
 * Se desactiva con reduced-motion (queda en 0).
 */
export function useScrollProgress(): number {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setProgress(0);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return progress;
}

/**
 * Offset de parallax relativo a un elemento (px).
 * factor típico: 0.15–0.35
 */
export function useParallaxOffset(
  targetRef: React.RefObject<HTMLElement | null>,
  factor = 0.25
): number {
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced) {
      setOffset(0);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const delta = (center - viewH / 2) / viewH;
      setOffset(-delta * factor * 100);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, targetRef, factor]);

  return offset;
}
