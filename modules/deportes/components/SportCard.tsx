import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import type { DeporteListItem } from "@/modules/deportes/types";

interface SportCardProps {
  deporte: DeporteListItem;
  className?: string;
  variant?: "light" | "dark";
}

export function SportCard({ deporte, className, variant = "light" }: SportCardProps) {
  const href = `/deportes/${deporte.slug}`;
  const dark = variant === "dark";

  return (
    <Link href={href} className={cn("group block h-full focus-ring rounded-organic", className)}>
      <Card
        surface={dark ? "ink" : "paper"}
        interactive
        className="h-full overflow-hidden p-0"
      >
        <MediaImage
          src={deporte.coverUrl}
          alt={deporte.nombre}
          accentColor={deporte.colorPrimario}
          tone={dark ? "ink" : "paper"}
          ratio="video"
          frameClassName="rounded-none rounded-t-[inherit] ring-0"
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholderLabel={deporte.nombre}
        />
        <div className="border-t-4 p-6" style={{ borderTopColor: deporte.colorPrimario }}>
          <h3
            className={cn(
              "font-display text-lg font-bold uppercase",
              dark ? "text-white" : "text-brand-ink"
            )}
          >
            {deporte.nombre}
          </h3>
          <p
            className={cn(
              "mt-2 line-clamp-3 text-sm leading-relaxed",
              dark ? "text-white/70" : "text-brand-ink/70"
            )}
          >
            {deporte.descripcion}
          </p>
          <p
            className={cn(
              "mt-4 text-xs font-semibold uppercase tracking-wide",
              dark ? "text-brand-secondary" : "text-brand-primary"
            )}
          >
            {deporte.ubicacionesCount} en el mapa · Ver perfil →
          </p>
        </div>
      </Card>
    </Link>
  );
}
