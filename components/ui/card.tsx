import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("transition-all duration-base ease-brand", {
  variants: {
    surface: {
      /** Superficie oscura documental */
      ink: "ds-surface-ink p-6",
      /** Superficie clara editorial */
      paper: "ds-surface-paper p-6",
      /** Sin chrome — solo contenedor */
      plain: "p-0",
    },
        interactive: {
      true: "motion-safe:hover:-translate-y-1",
      false: "",
    },
  },
  defaultVariants: {
    surface: "paper",
    interactive: false,
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, surface, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ surface, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/** Alias semántico — superficie paper del Design System */
export const CardLight = forwardRef<HTMLDivElement, Omit<CardProps, "surface">>(
  ({ className, ...props }, ref) => (
    <Card ref={ref} surface="paper" className={className} {...props} />
  )
);
CardLight.displayName = "CardLight";

export { cardVariants };
