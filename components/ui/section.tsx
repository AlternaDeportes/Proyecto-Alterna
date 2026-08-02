import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BlobBackground } from "@/components/ui/blob-background";
import { BrandPattern } from "@/components/ui/brand-pattern";

const sectionVariants = cva("ds-section", {
  variants: {
    tone: {
      ink: "bg-brand-ink text-white",
      paper: "bg-brand-surface text-brand-ink",
      primary: "bg-brand-primary text-white",
      transparent: "",
    },
    border: {
      none: "",
      top: "border-t border-white/10",
      bottom: "border-b border-white/10",
      y: "border-y border-white/10",
      topPaper: "border-t border-brand-ink/10",
      bottomPaper: "border-b border-brand-ink/10",
    },
    density: {
      default: "",
      tight: "ds-section--tight !py-14 sm:!py-16",
    },
  },
  defaultVariants: {
    tone: "transparent",
    border: "none",
    density: "default",
  },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: ElementType;
  children: ReactNode;
  /** Blobs de marca (manual) — solo cuando aportan atmósfera */
  blobs?: boolean | "section";
  /** Patrón gráfico complementario */
  pattern?: "dots" | "grid" | false;
}

/**
 * Sección de página del Design System.
 * Unifica ritmo vertical, tono (ink/paper/primary) y decoración de marca.
 */
export function Section({
  as: Comp = "section",
  className,
  tone,
  border,
  density,
  blobs = false,
  pattern = false,
  children,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn(
        sectionVariants({ tone, border, density }),
        (blobs || pattern) && "overflow-hidden",
        className
      )}
      {...props}
    >
      {blobs ? (
        <BlobBackground
          variant={blobs === "section" ? "section" : "hero"}
          className={tone === "paper" ? "opacity-40 [&_svg]:opacity-10" : undefined}
        />
      ) : null}
      {pattern ? <BrandPattern variant={pattern} /> : null}
      <div className="relative z-raised">{children}</div>
    </Comp>
  );
}

export { sectionVariants };
