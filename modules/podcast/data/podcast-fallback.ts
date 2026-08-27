import type {
  PodcastEpisodioDetalle,
  PodcastEpisodioListItem,
  PodcastShow,
} from "@/modules/podcast/types";

/**
 * Podcast todavía no tiene episodios publicados.
 * No inventamos títulos, duraciones ni capítulos.
 */
const SHOW: PodcastShow = {
  id: "pod-alterna",
  slug: "alterna-podcast",
  titulo: "ALTERNA Podcast",
  descripcion:
    "Charlas con entrenadores, jugadoras y referentes de Ultimate, Newcom y Wingfoil en Santa Fe. El podcast está en producción.",
  coverUrl: null,
  publishedAt: null,
  episodios: [],
};

export function obtenerPodcastFallback(): PodcastShow {
  return SHOW;
}

export function listarEpisodiosFallback(_deporteSlug?: string): PodcastEpisodioListItem[] {
  return [];
}

export function obtenerEpisodioFallback(_slug: string): PodcastEpisodioDetalle | null {
  return null;
}

export function listarEpisodioSlugsFallback(): string[] {
  return [];
}
