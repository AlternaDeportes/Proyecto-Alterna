import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary/20 text-brand-primary border border-brand-primary/30",
        secondary: "bg-brand-secondary/25 text-brand-ink border border-brand-secondary/40",
        accent: "bg-brand-accent/20 text-brand-accent border border-brand-accent/35",
        muted: "border border-dashed border-white/25 text-white/55 bg-white/5",
        mutedLight: "border border-dashed border-brand-ink/15 text-brand-ink/55 bg-brand-ink/[0.03]",
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
