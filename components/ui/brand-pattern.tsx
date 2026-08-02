import { cn } from "@/lib/utils";

interface BrandPatternProps {
  variant?: "dots" | "grid";
  className?: string;
}

/**
 * Patrones gráficos complementarios — Manual de identidad (BLOB + PATRONES).
 * Decorativos: aria-hidden, pointer-events none.
 */
export function BrandPattern({ variant = "dots", className }: BrandPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-40",
        variant === "dots" ? "ds-pattern-dots" : "ds-pattern-grid",
        className
      )}
      aria-hidden
    />
  );
}
