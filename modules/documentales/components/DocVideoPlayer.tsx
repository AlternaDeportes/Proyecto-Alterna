"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toYoutubeEmbed } from "@/modules/documentales/services/documental.service";

interface DocVideoPlayerProps {
  titulo: string;
  videoUrl: string | null;
  proximo: boolean;
  coverUrl?: string | null;
}

export function DocVideoPlayer({
  titulo,
  videoUrl,
  proximo,
  coverUrl,
}: DocVideoPlayerProps) {
  if (proximo || !videoUrl) {
    return (
      <div className="ds-frame ds-frame--ink relative overflow-hidden">
        <div className="relative aspect-video">
          {coverUrl ? (
            <Image src={coverUrl} alt="" fill quality={88} className="object-cover opacity-50" aria-hidden />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary-deep to-brand-ink" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-ink/50 p-6 text-center">
            <Badge variant="accent">En producción</Badge>
            <p className="max-w-md text-sm text-white/75">
              El video de «{titulo}» se publica pronto. Mientras tanto seguinos en YouTube.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const embed = toYoutubeEmbed(videoUrl);

  if (embed) {
    return (
      <div className="ds-frame ds-frame--primary overflow-hidden">
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
    <div className="ds-frame ds-frame--ink overflow-hidden">
      <video controls preload="metadata" className="aspect-video w-full bg-black" src={videoUrl}>
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  );
}
