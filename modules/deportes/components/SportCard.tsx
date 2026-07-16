import Link from "next/link";
import { CardLight } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DeporteListItem } from "@/modules/deportes/types";

interface SportCardProps {
  deporte: DeporteListItem;
  className?: string;
  variant?: "light" | "dark";
}

export function SportCard({ deporte, className, variant = "light" }: SportCardProps) {
  const href = `/deportes/${deporte.slug}`;

  if (variant === "dark") {
    return (
      <Link
        href={href}
        className={cn(
          "group block h-full rounded-organic border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
          "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary",
          className
        )}
        style={{ borderTopWidth: 4, borderTopColor: deporte.colorPrimario }}
      >
        <SportCardBody deporte={deporte} dark />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2",
        className
      )}
    >
      <CardLight
        className="h-full border-t-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{ borderTopColor: deporte.colorPrimario }}
      >
        <SportCardBody deporte={deporte} />
      </CardLight>
    </Link>
  );
}

function SportCardBody({
  deporte,
  dark = false,
}: {
  deporte: DeporteListItem;
  dark?: boolean;
}) {
  return (
    <>
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
    </>
  );
}
