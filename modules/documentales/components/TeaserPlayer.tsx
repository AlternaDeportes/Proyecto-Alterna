"use client";

import { useState } from "react";
import Image from "next/image";
import { documentaryCovers, IMAGE_QUALITY } from "@/config/media";
import { siteConfig, teaserEmbedUrl } from "@/config/site";
import { cn } from "@/lib/utils";

interface TeaserPlayerProps {
  className?: string;
  /** Marco más marcado en home; más contenido en /documentales. */
  featured?: boolean;
}

/**
 * Portada del teaser + embed de YouTube al reproducir.
 */
export function TeaserPlayer({ className, featured = false }: TeaserPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden bg-brand-ink shadow-lift",
        featured ? "ds-frame ds-frame--accent" : "ds-frame ds-frame--primary",
        className
      )}
    >
      <div className="relative aspect-video">
        {playing ? (
          <iframe
            src={teaserEmbedUrl(true)}
            title={siteConfig.teaser.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative h-full w-full focus-ring"
            aria-label={`Reproducir ${siteConfig.teaser.title}`}
          >
            <Image
              src={documentaryCovers.trailer}
              alt="Teaser ALTERNA — Ultimate Frisbee en Santa Fe"
              fill
              sizes="(max-width: 1024px) 100vw, 72rem"
              quality={IMAGE_QUALITY}
              className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
              priority={featured}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/10 to-transparent"
              aria-hidden
            />
            <span
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-secondary text-brand-ink shadow-glow-secondary transition-transform duration-300 group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-7 w-7 fill-current" role="presentation">
                <path d="M8 5.14v13.72L19.5 12 8 5.14Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
