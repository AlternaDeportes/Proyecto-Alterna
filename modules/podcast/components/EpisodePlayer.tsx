"use client";

import { Badge } from "@/components/ui/badge";
import type { PodcastCapitulo } from "@/modules/podcast/types";

interface EpisodePlayerProps {
  titulo: string;
  audioUrl: string | null;
  proximo: boolean;
  capitulos: PodcastCapitulo[];
}

export function EpisodePlayer({
  titulo,
  audioUrl,
  proximo,
  capitulos,
}: EpisodePlayerProps) {
  if (proximo || !audioUrl) {
    return (
      <div className="rounded-organic border border-dashed border-white/20 bg-white/[0.03] p-6">
        <Badge variant="accent" className="mb-3">
          En producción
        </Badge>
        <p className="text-sm text-white/70">
          El audio de «{titulo}» se publicará pronto. Mientras tanto podés recorrer los
          capítulos previstos y seguirnos en Spotify.
        </p>
        {capitulos.length ? (
          <ol className="mt-5 space-y-2">
            {capitulos.map((cap, i) => (
              <li
                key={cap.titulo}
                className="flex items-baseline gap-3 text-sm text-white/65"
              >
                <span className="font-display text-xs font-bold text-brand-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {cap.titulo}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-organic border border-white/10 bg-white/[0.04] p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
        Reproductor
      </p>
      <audio controls preload="metadata" className="w-full" src={audioUrl}>
        Tu navegador no soporta audio HTML5.
      </audio>
      {capitulos.length ? (
        <ol className="mt-5 space-y-2 border-t border-white/10 pt-4">
          {capitulos.map((cap, i) => (
            <li key={cap.titulo} className="flex items-baseline gap-3 text-sm text-white/65">
              <span className="font-display text-xs font-bold text-brand-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {cap.titulo}
              {typeof cap.inicioSeg === "number" ? (
                <span className="text-xs text-white/40">
                  {Math.floor(cap.inicioSeg / 60)}:
                  {String(cap.inicioSeg % 60).padStart(2, "0")}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
