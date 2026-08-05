import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import type { HistoriaListItem } from "@/modules/historias/types";

interface StoryCardProps {
  historia: HistoriaListItem;
  className?: string;
}

export function StoryCard({ historia, className }: StoryCardProps) {
  return (
    <Card
      surface="paper"
      interactive
      className={cn("flex h-full flex-col overflow-hidden p-0", className)}
    >
      <MediaImage
        src={historia.coverUrl}
        alt={historia.titulo}
        accentColor={historia.deporte.colorPrimario}
        tone="paper"
        ratio="video"
        frameClassName="rounded-none rounded-t-[inherit] ring-0"
        sizes="(max-width: 640px) 100vw, 50vw"
        placeholderLabel={historia.titulo}
      />
      <div
        className="flex flex-1 flex-col border-l-4 p-6"
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
            className="rounded-sm hover:text-brand-primary focus-ring"
          >
            {historia.titulo}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink/65">
          {historia.excerpt}
        </p>
        <Link
          href={`/historias/${historia.slug}`}
          className="mt-4 inline-block rounded-sm text-sm font-semibold text-brand-primary hover:underline focus-ring"
        >
          Leer historia →
        </Link>
      </div>
    </Card>
  );
}
