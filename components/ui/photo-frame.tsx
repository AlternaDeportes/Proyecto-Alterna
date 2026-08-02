import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const frameVariants = cva("ds-frame", {
  variants: {
    tone: {
      ink: "ds-frame--ink",
      paper: "ds-frame--paper",
      primary: "ds-frame--primary",
      accent: "ds-frame--accent",
    },
    ratio: {
      video: "aspect-video",
      square: "aspect-square",
      portrait: "aspect-[3/4]",
      wide: "aspect-[21/9]",
      auto: "",
    },
  },
  defaultVariants: {
    tone: "ink",
    ratio: "video",
  },
});

export interface PhotoFrameProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {
  children?: ReactNode;
  /** Color de acento (deporte) como borde superior orgánico */
  accentColor?: string;
}

/**
 * Marco fotográfico del Manual de Identidad.
 * Contenedor reutilizable para media — nunca cards genéricas para fotos.
 */
export function PhotoFrame({
  className,
  tone,
  ratio,
  accentColor,
  children,
  style,
  ...props
}: PhotoFrameProps) {
  return (
    <div
      className={cn(frameVariants({ tone, ratio }), className)}
      style={{
        ...(accentColor
          ? { boxShadow: `inset 0 4px 0 0 ${accentColor}` }
          : undefined),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { frameVariants };
