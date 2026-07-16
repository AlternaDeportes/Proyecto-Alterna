import Link from "next/link";
import { CardLight } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HistoriaListItem } from "@/modules/historias/types";

interface StoryCardProps {
  historia: HistoriaListItem;
  className?: string;
}

export function StoryCard({ historia, className }: StoryCardProps) {
  return (
    <CardLight
      className={cn(
        "flex h-full flex-col border-l-4 transition hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      style={{ borderLeftColor: historia.deporte.colorPrimario }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink/45">
        {historia.deporte.nombre}
      </p>
      {historia.pullQuote ? (
        <p className="mt-3 text-sm font-medium italic leading-relaxed text-brand-ink/80">
          «{historia.pullQuote}»
        </p>
      ) : null}
      <h3 className="mt-4 font-display text-lg font-bold uppercase text-brand-ink">
        <Link
          href={`/historias/${historia.slug}`}
          className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          {historia.titulo}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink/65">
        {historia.excerpt}
      </p>
      <Link
        href={`/historias/${historia.slug}`}
        className="mt-4 inline-block text-sm font-semibold text-brand-primary hover:underline"
      >
        Leer historia →
      </Link>
    </CardLight>
  );
}
