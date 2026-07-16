import Link from "next/link";
import { Card } from "@/components/ui/card";
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
      className={cn(
        "relative flex h-full flex-col overflow-hidden border-white/10 bg-white/[0.04] p-0 transition hover:border-white/25",
        destacada && "border-brand-secondary/40",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-video w-full",
          destacada
            ? "bg-gradient-to-br from-brand-primary via-[#152a6b] to-brand-ink"
            : "bg-gradient-to-br from-white/10 to-brand-ink"
        )}
      >
        {episodio.proximo ? (
          <span className="absolute right-3 top-3 rounded-full bg-brand-accent/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-ink">
            Próximamente
          </span>
        ) : null}
        {episodio.etiqueta ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
            {episodio.etiqueta}
          </span>
        ) : null}
      </div>

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
            className="hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-secondary"
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
            "mt-4 inline-block text-sm font-semibold",
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
