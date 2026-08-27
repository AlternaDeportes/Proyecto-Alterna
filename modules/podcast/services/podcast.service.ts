import { isDatabaseConfigured } from "@/config/env";
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

function estaPublicado(
  row: Pick<EpisodioRow, "audioUrl" | "publishedAt">
): boolean {
  return Boolean(row.audioUrl && row.publishedAt);
}

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
    coverUrl: null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    proximo: !estaPublicado(row),
    deportes: row.deportes.map((d) => d.deporte),
  };
}

function mapEpisodioDetalle(row: EpisodioRow): PodcastEpisodioDetalle {
  return {
    ...mapEpisodioList(row),
    capitulos: [],
    podcast: row.podcast,
  };
}

function mapShow(
  row: NonNullable<Awaited<ReturnType<typeof podcastRepository.findFirstShow>>>
): PodcastShow {
  const publicados = row.episodios.filter(estaPublicado);
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion,
    coverUrl: row.coverUrl ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    episodios: publicados.map(mapEpisodioList),
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
        return rows.filter(estaPublicado).map(mapEpisodioList);
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
      if (!row || !estaPublicado(row)) return null;
      return mapEpisodioDetalle(row);
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
      // findAllEpisodioSlugs may return all — filter via show
      const show = await podcastService.obtenerShow();
      return show.episodios.map((e) => e.slug);
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
