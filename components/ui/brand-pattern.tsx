import Image from "next/image";
import { brandPatterns, type BrandPatternId } from "@/config/brand-assets";
import { cn } from "@/lib/utils";

interface BrandPatternProps {
  variant?: "dots" | "grid" | BrandPatternId;
  className?: string;
  /** Opacidad del patrón (0–100). Default según variante. */
  opacity?: number;
}

/**
 * Patrones gráficos de marca — Manual (BLOB + PATRONES + mesas).
 * Decorativos: aria-hidden, pointer-events none.
 */
export function BrandPattern({
  variant = "dots",
  className,
  opacity,
}: BrandPatternProps) {
  if (variant === "dots" || variant === "grid") {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          opacity == null && "opacity-40",
          variant === "dots" ? "ds-pattern-dots" : "ds-pattern-grid",
          className
        )}
        style={opacity != null ? { opacity: opacity / 100 } : undefined}
        aria-hidden
      />
    );
  }

  const src = brandPatterns[variant];
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        opacity == null && "opacity-25",
        className
      )}
      style={opacity != null ? { opacity: opacity / 100 } : undefined}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
