import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-organic border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
        "dark:border-white/10 dark:bg-white/[0.04]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardLight = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-organic border border-brand-ink/8 bg-white p-6 shadow-[0_20px_50px_rgba(29,29,27,0.08)]",
        className
      )}
      {...props}
    />
  )
);
CardLight.displayName = "CardLight";
