import { cn } from "@/lib/utils";

interface ColorStripeProps {
  className?: string;
  /** horizontal (default) o vertical */
  orientation?: "horizontal" | "vertical";
}

/**
 * Franja tricolor de marca — azul / lima / naranja en partes iguales.
 * Uso: headers, footers, cierres de sección (señal de identidad, no decoración suelta).
 */
export function ColorStripe({
  className,
  orientation = "horizontal",
}: ColorStripeProps) {
  const horizontal = orientation === "horizontal";
  return (
    <div
      className={cn(
        "flex overflow-hidden",
        horizontal ? "h-1 w-full flex-row" : "h-full w-1 flex-col",
        className
      )}
      aria-hidden
    >
      <span className="flex-1 bg-brand-primary" />
      <span className="flex-1 bg-brand-secondary" />
      <span className="flex-1 bg-brand-accent" />
    </div>
  );
}
