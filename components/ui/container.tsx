import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  children: ReactNode;
  /** Ancho editorial más estrecho (historias, legal) */
  narrow?: boolean;
}

/** Contenedor horizontal del Design System — max-w-content + gutters */
export function Container({
  as: Comp = "div",
  className,
  narrow = false,
  children,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        "ds-container",
        narrow && "max-w-3xl",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
