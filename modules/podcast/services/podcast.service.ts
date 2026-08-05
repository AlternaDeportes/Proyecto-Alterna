import { isDatabaseConfigured } from "@/config/env";
import { podcastCover } from "@/config/media";
import {
  listarEpisodioSlugsFallback,
  listarEpisodiosFallback,
  obtenerEpisodioFallback,
  obtenerPodcastFallback,
} from "@/modules/podcast/data/podcast-fallback";
import { podcastRepository } from "@/modules/podcast/repositories/podcast.repository";
import type {
  PodcastEpisodioDetalle,
  PodcastEpisodioListItem,
  PodcastShow,
} from "@/modules/podcast/types";

type EpisodioRow = NonNullable<
  Awaited<ReturnType<typeof podcastRepository.findEpisodioBySlug>>
>;

function mapEpisodioList(
  row: EpisodioRow | Awaited<ReturnType<typeof podcastRepository.findEpisodiosByDeporte>>[number]
): PodcastEpisodioListItem {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion,
    numero: row.numero,
    duracionSeg: row.duracionSeg,
    audioUrl: row.audioUrl,
    coverUrl: podcastCover(row.slug),
    publishedAt: row.publishedAt?.toISOString() ?? null,
    proximo: !row.audioUrl || !row.publishedAt,
    deportes: row.deportes.map((d) => d.deporte),
  };
}

function mapEpisodioDetalle(row: EpisodioRow): PodcastEpisodioDetalle {
  const fallback = obtenerEpisodioFallback(row.slug);
  return {
    ...mapEpisodioList(row),
    capitulos: fallback?.capitulos ?? [],
    podcast: row.podcast,
  };
}

function mapShow(
  row: NonNullable<Awaited<ReturnType<typeof podcastRepository.findFirstShow>>>
): PodcastShow {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion,
    coverUrl: podcastCover(row.slug, row.coverUrl),
    publishedAt: row.publishedAt?.toISOString() ?? null,
    episodios: row.episodios.map(mapEpisodioList),
  };
}

export const podcastService = {
  async obtenerShow(): Promise<PodcastShow> {
    if (!isDatabaseConfigured()) {
      return obtenerPodcastFallback();
    }

    try {
      const row = await podcastRepository.findFirstShow();
      return row ? mapShow(row) : obtenerPodcastFallback();
    } catch {
      return obtenerPodcastFallback();
    }
  },

  async listarEpisodios(deporteSlug?: string): Promise<PodcastEpisodioListItem[]> {
    if (!isDatabaseConfigured()) {
      return listarEpisodiosFallback(deporteSlug);
    }

    try {
      if (deporteSlug) {
        const rows = await podcastRepository.findEpisodiosByDeporte(deporteSlug);
        return rows.map(mapEpisodioList);
      }
      const show = await podcastService.obtenerShow();
      return show.episodios;
    } catch {
      return listarEpisodiosFallback(deporteSlug);
    }
  },

  async obtenerEpisodio(slug: string): Promise<PodcastEpisodioDetalle | null> {
    if (!isDatabaseConfigured()) {
      return obtenerEpisodioFallback(slug);
    }

    try {
      const row = await podcastRepository.findEpisodioBySlug(slug);
      return row ? mapEpisodioDetalle(row) : obtenerEpisodioFallback(slug);
    } catch {
      return obtenerEpisodioFallback(slug);
    }
  },

  async listarSlugs(): Promise<string[]> {
    if (!isDatabaseConfigured()) {
      return listarEpisodioSlugsFallback();
    }

    try {
      const rows = await podcastRepository.findAllEpisodioSlugs();
      return rows.map((r) => r.slug);
    } catch {
      return listarEpisodioSlugsFallback();
    }
  },
};

export function formatDuracion(segundos: number | null): string {
  if (!segundos || segundos <= 0) return "—";
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return s ? `${m} min ${s}s` : `${m} min`;
}
