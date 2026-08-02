import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PhotoFrame } from "@/components/ui/photo-frame";
import { cn } from "@/lib/utils";
import { formatDuracionVideo } from "@/modules/documentales/services/documental.service";
import type { DocumentalEpisodioListItem } from "@/modules/documentales/types";

interface DocEpisodeCardProps {
  episodio: DocumentalEpisodioListItem;
  destacada?: boolean;
  className?: string;
}

export function DocEpisodeCard({
  episodio,
  destacada,
  className,
}: DocEpisodeCardProps) {
  const meta =
    episodio.numero === 0 ? "Trailer" : `Episodio ${String(episodio.numero).padStart(2, "0")}`;

  return (
    <Card
      surface="ink"
      className={cn(
        "relative flex h-full flex-col overflow-hidden p-0",
        destacada && "ring-1 ring-brand-secondary/40",
        className
      )}
    >
      <PhotoFrame
        tone={destacada ? "primary" : "ink"}
        ratio="video"
        className={cn(
          "rounded-none rounded-t-[inherit] ring-0",
          destacada
            ? "bg-gradient-to-br from-brand-primary via-brand-primary-deep to-brand-ink"
            : "bg-gradient-to-br from-white/10 to-brand-ink"
        )}
      >
        {episodio.proximo ? (
          <Badge
            variant="accent"
            className="absolute right-3 top-3 z-raised border-0 bg-brand-accent/90 text-brand-ink"
          >
            Próximamente
          </Badge>
        ) : null}
        {episodio.etiqueta ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
            {episodio.etiqueta}
          </span>
        ) : null}
      </PhotoFrame>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
          {meta}
          {episodio.duracionSeg
            ? ` · ${formatDuracionVideo(episodio.duracionSeg)}`
            : ""}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold uppercase text-white">
          <Link
            href={`/documentales/${episodio.slug}`}
            className="hover:text-brand-secondary focus-ring rounded-sm"
          >
            {episodio.titulo}
          </Link>
        </h3>
        {episodio.sinopsis ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
            {episodio.sinopsis}
          </p>
        ) : null}
        <Link
          href={`/documentales/${episodio.slug}`}
          className={cn(
            "mt-4 inline-block text-sm font-semibold focus-ring rounded-sm",
            episodio.proximo
              ? "text-white/45"
              : "text-brand-secondary hover:underline"
          )}
        >
          {episodio.proximo ? "Ver ficha →" : "Ver episodio →"}
        </Link>
      </div>
    </Card>
  );
}
