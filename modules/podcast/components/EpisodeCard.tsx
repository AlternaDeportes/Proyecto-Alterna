import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      surface="ink"
      className={cn(
        "relative flex h-full flex-col",
        destacada && "ring-1 ring-brand-secondary/40 bg-brand-secondary/5",
        className
      )}
    >
      {episodio.proximo ? (
        <Badge variant="accent" className="absolute right-4 top-4">
          Próximamente
        </Badge>
      ) : null}

      <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
        Episodio {episodio.numero}
        {episodio.duracionSeg ? ` · ${formatDuracion(episodio.duracionSeg)}` : ""}
      </p>

      <h3 className="mt-2 pr-24 font-display text-lg font-bold uppercase text-white">
        <Link
          href={`/podcasts/${episodio.slug}`}
          className="rounded-sm hover:text-brand-secondary focus-ring"
        >
          {episodio.titulo}
        </Link>
      </h3>

      {episodio.descripcion ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
          {episodio.descripcion}
        </p>
      ) : null}

      {episodio.deportes.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {episodio.deportes.map((d) => (
            <Badge
              key={d.slug}
              variant="muted"
              className="border-0 text-[10px] text-white"
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
            ? "text-white/45"
            : "text-brand-secondary hover:underline"
        )}
      >
        {episodio.proximo ? "Ver ficha →" : "Escuchar →"}
      </Link>
    </Card>
  );
}
