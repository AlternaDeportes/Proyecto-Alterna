import { cn } from "@/lib/utils";
import { BrandPattern } from "@/components/ui/brand-pattern";

interface MediaPlaceholderProps {
  label?: string;
  accentColor?: string;
  className?: string;
}

/**
 * Estado vacío con dirección de arte ALTERNA (no gradient genérico suelto).
 * Usa color de deporte + patrón de marca.
 */
export function MediaPlaceholder({
  label = "Media en producción",
  accentColor,
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-[8rem] w-full items-end overflow-hidden",
        className
      )}
      style={{
        background: accentColor
          ? `linear-gradient(145deg, ${accentColor}66 0%, var(--color-brand-ink) 55%, var(--color-brand-primary-deep) 100%)`
          : `linear-gradient(145deg, var(--color-brand-primary) 0%, var(--color-brand-ink) 55%, var(--color-brand-primary-deep) 100%)`,
      }}
      aria-hidden={!label}
    >
      <BrandPattern variant="dots" className="opacity-50" />
      <div className="relative z-raised w-full bg-gradient-to-t from-brand-ink/80 to-transparent p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
          ALTERNA
        </p>
        {label ? (
          <p className="mt-1 text-xs font-semibold text-white/75">{label}</p>
        ) : null}
      </div>
    </div>
  );
}
