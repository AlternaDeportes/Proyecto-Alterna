import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import { formatDuracion } from "@/modules/podcast/services/podcast.service";
import type { PodcastEpisodioListItem } from "@/modules/podcast/types";

interface EpisodeCardProps {
  episodio: PodcastEpisodioListItem;
  destacada?: boolean;
  className?: string;
}

export function EpisodeCard({ episodio, destacada, className }: EpisodeCardProps) {
  return (
    <Card
      surface="paper"
      className={cn(
        "relative flex h-full flex-col overflow-hidden p-0",
        destacada && "ring-1 ring-brand-secondary/50",
        className
      )}
    >
      <div className="relative">
        <MediaImage
          src={episodio.coverUrl}
          alt={episodio.titulo}
          tone="ink"
          ratio="video"
          frameClassName="rounded-none rounded-t-[inherit] ring-0"
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholderLabel={episodio.titulo}
        />
        {episodio.proximo ? (
          <Badge variant="accent" className="absolute right-4 top-4 z-raised">
            Próximamente
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink/45">
          Episodio {episodio.numero}
          {episodio.duracionSeg ? ` · ${formatDuracion(episodio.duracionSeg)}` : ""}
        </p>

        <h3 className="mt-2 font-display text-lg font-bold uppercase text-brand-ink">
          <Link
            href={`/podcasts/${episodio.slug}`}
            className="rounded-sm hover:text-brand-primary focus-ring"
          >
            {episodio.titulo}
          </Link>
        </h3>

        {episodio.descripcion ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink/65">
            {episodio.descripcion}
          </p>
        ) : null}

        {episodio.deportes.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {episodio.deportes.map((d) => (
              <Badge
                key={d.slug}
                variant="muted"
                className="border-0 text-[10px] text-brand-ink"
                style={{ backgroundColor: `${d.colorPrimario}33` }}
              >
                {d.nombre}
              </Badge>
            ))}
          </div>
        ) : null}

        <Link
          href={`/podcasts/${episodio.slug}`}
          className={cn(
            "mt-4 inline-block rounded-sm text-sm font-semibold focus-ring",
            episodio.proximo
              ? "text-brand-ink/40"
              : "text-brand-primary hover:underline"
          )}
        >
          {episodio.proximo ? "Ver ficha →" : "Escuchar →"}
        </Link>
      </div>
    </Card>
  );
}
