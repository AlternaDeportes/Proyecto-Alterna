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
      className={cn(
        "relative flex h-full flex-col border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25",
        destacada && "border-brand-secondary/40 bg-brand-secondary/5",
        className
      )}
    >
      {episodio.proximo ? (
        <span className="absolute right-4 top-4 rounded-full bg-brand-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent">
          Próximamente
        </span>
      ) : null}

      <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
        Episodio {episodio.numero}
        {episodio.duracionSeg ? ` · ${formatDuracion(episodio.duracionSeg)}` : ""}
      </p>

      <h3 className="mt-2 pr-24 font-display text-lg font-bold uppercase text-white">
        <Link
          href={`/podcasts/${episodio.slug}`}
          className="hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-secondary"
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
              className="border-0 text-[10px]"
              style={{ backgroundColor: `${d.colorPrimario}33`, color: "#fff" }}
            >
              {d.nombre}
            </Badge>
          ))}
        </div>
      ) : null}

      <Link
        href={`/podcasts/${episodio.slug}`}
        className={cn(
          "mt-4 inline-block text-sm font-semibold",
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
