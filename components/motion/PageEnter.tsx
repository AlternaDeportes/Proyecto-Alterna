"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

interface PageEnterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Entrada suave al cambiar de ruta — presencia, no transición teatral.
 */
export function PageEnter({ children, className }: PageEnterProps) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    setReady(false);
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [pathname, reduced]);

  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-500 ease-brand",
        ready ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
