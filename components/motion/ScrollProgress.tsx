"use client";

import { useScrollProgress } from "@/lib/motion/use-scroll-progress";

/**
 * Línea de progreso de lectura — señal sutil de recorrido.
 * Intención de motion #3 (chrome response) junto al nav.
 */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-toast h-[2px] bg-transparent"
      aria-hidden
    >
      <div
        className="h-full origin-left ds-tricolor transition-transform duration-75 ease-linear motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
