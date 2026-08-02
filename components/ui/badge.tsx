import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Chip unificado del Design System.
 * Absorbe el antiguo Tag — una sola API para eyebrows, filtros y estados.
 *
 * Semántica:
 * - primary   → acción / exploración (azul)
 * - secondary → energía / comunidad (lime) — uso puntual
 * - accent    → descubrimiento / highlight (naranja)
 * - soft      → chip neutro sobre ink (ex-Tag)
 * - muted     → metadatos / filtros inactivos
 * - mutedLight→ metadatos sobre paper
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        primary:
          "border border-brand-primary/30 bg-brand-primary/20 text-brand-primary",
        secondary:
          "border border-brand-secondary/40 bg-brand-secondary/25 text-brand-ink",
        accent:
          "border border-brand-accent/35 bg-brand-accent/20 text-brand-accent",
        soft: "border border-white/20 bg-white/10 font-semibold text-white/90",
        muted: "border border-dashed border-white/25 bg-white/5 text-white/55",
        mutedLight:
          "border border-dashed border-brand-ink/15 bg-brand-ink/[0.03] text-brand-ink/55",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
