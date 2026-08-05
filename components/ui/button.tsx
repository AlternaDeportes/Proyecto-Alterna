import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-body text-sm font-semibold",
    "rounded-full transition-all duration-base ease-brand",
    "focus-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90 motion-safe:hover:-translate-y-0.5",
        secondary:
          "bg-brand-secondary text-brand-ink shadow-glow-secondary hover:bg-brand-secondary/90 motion-safe:hover:-translate-y-0.5",
        accent:
          "bg-brand-accent text-brand-ink shadow-glow-accent hover:bg-brand-accent/90 motion-safe:hover:-translate-y-0.5",
        /** Contorno sobre papel (fondo blanco) */
        outline:
          "border-2 border-brand-ink/25 bg-transparent text-brand-ink hover:border-brand-ink hover:bg-brand-ink hover:text-white motion-safe:hover:-translate-y-0.5",
        /** Contorno sobre ink / foto / hero */
        outlineLight:
          "border-2 border-white bg-transparent text-white hover:bg-white hover:text-brand-ink motion-safe:hover:-translate-y-0.5",
        outlineDark:
          "border-2 border-brand-ink/20 bg-transparent text-brand-ink hover:border-brand-primary hover:text-brand-primary",
        ghost: "text-brand-ink/80 hover:bg-brand-ink/5 hover:text-brand-ink",
        ghostLight: "text-white hover:bg-white/10",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, "className">,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export function ButtonLink({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

export { buttonVariants };
