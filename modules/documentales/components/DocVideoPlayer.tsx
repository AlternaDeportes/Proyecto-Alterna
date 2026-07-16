"use client";

import { Badge } from "@/components/ui/badge";
import { toYoutubeEmbed } from "@/modules/documentales/services/documental.service";

interface DocVideoPlayerProps {
  titulo: string;
  videoUrl: string | null;
  proximo: boolean;
}

export function DocVideoPlayer({ titulo, videoUrl, proximo }: DocVideoPlayerProps) {
  if (proximo || !videoUrl) {
    return (
      <div className="overflow-hidden rounded-organic border border-dashed border-white/20 bg-white/[0.03]">
        <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-primary/40 to-brand-ink p-6 text-center">
          <Badge variant="accent">En producción</Badge>
          <p className="max-w-md text-sm text-white/70">
            El video de «{titulo}» se publica pronto. Mientras tanto seguinos en YouTube.
          </p>
        </div>
      </div>
    );
  }

  const embed = toYoutubeEmbed(videoUrl);

  if (embed) {
    return (
      <div className="overflow-hidden rounded-organic border border-white/10">
        <div className="aspect-video">
          <iframe
            src={embed}
            title={titulo}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-organic border border-white/10">
      <video controls preload="metadata" className="aspect-video w-full bg-black" src={videoUrl}>
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  );
}
