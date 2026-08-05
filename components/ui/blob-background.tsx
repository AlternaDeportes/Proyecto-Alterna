import { cn } from "@/lib/utils";
import { designTokens } from "@/config/design-tokens";

interface BlobBackgroundProps {
  className?: string;
  variant?: "hero" | "section";
}

/**
 * Blobs orgánicos de marca — Manual de identidad.
 * SVG inline; colores desde design tokens (sin hex sueltos).
 */
export function BlobBackground({ className, variant = "hero" }: BlobBackgroundProps) {
  const { primary, secondary, accent } = designTokens.colors;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <svg
        className={cn(
          "absolute -left-[10%] top-[8%] h-[55%] w-[55%] opacity-40 blur-2xl motion-safe:animate-blob-drift",
          variant === "section" && "opacity-28"
        )}
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M280 40C340 80 380 150 360 220C340 290 260 330 190 320C120 310 50 260 40 190C30 120 90 50 160 30C210 18 250 20 280 40Z"
          fill={primary}
        />
      </svg>
      <svg
        className={cn(
          "absolute -right-[5%] bottom-[5%] h-[45%] w-[45%] opacity-35 blur-2xl motion-safe:animate-blob-drift-reverse",
          variant === "section" && "opacity-24"
        )}
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M60 120C20 180 30 260 90 310C150 360 250 350 310 290C370 230 380 130 320 70C260 10 150 10 90 50C70 65 55 90 60 120Z"
          fill={secondary}
        />
      </svg>
      <svg
        className="absolute left-[35%] top-[45%] h-[30%] w-[30%] opacity-32 blur-xl motion-safe:animate-blob-pulse"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M100 20C140 25 175 55 180 95C185 135 155 170 115 178C75 186 35 160 25 120C15 80 45 40 85 25C92 22 96 20 100 20Z"
          fill={accent}
        />
      </svg>
    </div>
  );
}
