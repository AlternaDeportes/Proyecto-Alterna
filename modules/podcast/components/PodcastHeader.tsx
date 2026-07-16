import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { PodcastShow } from "@/modules/podcast/types";

interface PodcastHeaderProps {
  show: PodcastShow;
}

export function PodcastHeader({ show }: PodcastHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Badge variant="secondary">Voces en primera persona</Badge>
        <h1 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
          {show.titulo}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/75">{show.descripcion}</p>
        <p className="mt-3 text-sm text-white/50">
          Escuchá mientras explorás el mapa o salís a entrenar.
        </p>
      </div>
      <ButtonLink
        href={siteConfig.social.spotify}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="lg"
      >
        Abrir en Spotify
      </ButtonLink>
    </div>
  );
}
