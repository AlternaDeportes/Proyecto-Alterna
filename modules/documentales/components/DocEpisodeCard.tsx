import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
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
      surface="paper"
      className={cn(
        "relative flex h-full flex-col overflow-hidden p-0",
        destacada && "ring-1 ring-brand-accent/50",
        className
      )}
    >
      <div className="relative">
        <MediaImage
          src={episodio.coverUrl}
          alt={episodio.titulo}
          tone={destacada ? "primary" : "ink"}
          ratio="video"
          frameClassName="rounded-none rounded-t-[inherit] ring-0"
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholderLabel={episodio.titulo}
        />
        {episodio.proximo ? (
          <Badge
            variant="accent"
            className="absolute right-3 top-3 z-raised border-0 bg-brand-accent/90 text-brand-ink"
          >
            Próximamente
          </Badge>
        ) : null}
        {episodio.etiqueta ? (
          <span className="absolute bottom-3 left-3 z-raised rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
            {episodio.etiqueta}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink/45">
          {meta}
          {episodio.duracionSeg
            ? ` · ${formatDuracionVideo(episodio.duracionSeg)}`
            : ""}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold uppercase text-brand-ink">
          <Link
            href={`/documentales/${episodio.slug}`}
            className="rounded-sm hover:text-brand-primary focus-ring"
          >
            {episodio.titulo}
          </Link>
        </h3>
        {episodio.sinopsis ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink/65">
            {episodio.sinopsis}
          </p>
        ) : null}
        <Link
          href={`/documentales/${episodio.slug}`}
          className={cn(
            "mt-4 inline-block rounded-sm text-sm font-semibold focus-ring",
            episodio.proximo
              ? "text-brand-ink/40"
              : "text-brand-primary hover:underline"
          )}
        >
          {episodio.proximo ? "Ver ficha →" : "Ver episodio →"}
        </Link>
      </div>
    </Card>
  );
}
