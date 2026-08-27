import { isDatabaseConfigured } from "@/config/env";
import {
  listarEpisodioDocSlugsFallback,
  obtenerDocumentalFallback,
  obtenerEpisodioDocFallback,
} from "@/modules/documentales/data/documentales-fallback";
import { documentalRepository } from "@/modules/documentales/repositories/documental.repository";
import type {
  DocumentalEpisodioDetalle,
  DocumentalEpisodioListItem,
  DocumentalShow,
} from "@/modules/documentales/types";

type EpisodioRow = NonNullable<
  Awaited<ReturnType<typeof documentalRepository.findEpisodioBySlug>>
>;

function estaPublicado(
  row: Pick<EpisodioRow, "videoUrl" | "publishedAt">
): boolean {
  return Boolean(row.videoUrl && row.publishedAt);
}

function mapEpisodioList(
  row: EpisodioRow | NonNullable<
    Awaited<ReturnType<typeof documentalRepository.findFirstShow>>
  >["episodios"][number]
): DocumentalEpisodioListItem {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    sinopsis: row.sinopsis,
    numero: row.numero,
    duracionSeg: row.duracionSeg,
    videoUrl: row.videoUrl,
    coverUrl: null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    proximo: !estaPublicado(row),
    etiqueta: row.numero === 0 ? "Trailer" : undefined,
  };
}

function mapEpisodioDetalle(row: EpisodioRow): DocumentalEpisodioDetalle {
  return {
    ...mapEpisodioList(row),
    documental: row.documental,
  };
}

function mapShow(
  row: NonNullable<Awaited<ReturnType<typeof documentalRepository.findFirstShow>>>
): DocumentalShow {
  const publicados = row.episodios.filter(estaPublicado);
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    sinopsis: row.sinopsis,
    coverUrl: row.coverUrl ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    episodios: publicados.map(mapEpisodioList),
  };
}

export const documentalService = {
  async obtenerShow(): Promise<DocumentalShow> {
    if (!isDatabaseConfigured()) {
      return obtenerDocumentalFallback();
    }

    try {
      const row = await documentalRepository.findFirstShow();
      return row ? mapShow(row) : obtenerDocumentalFallback();
    } catch {
      return obtenerDocumentalFallback();
    }
  },

  async obtenerEpisodio(slug: string): Promise<DocumentalEpisodioDetalle | null> {
    if (!isDatabaseConfigured()) {
      return obtenerEpisodioDocFallback(slug);
    }

    try {
      const row = await documentalRepository.findEpisodioBySlug(slug);
      if (!row || !estaPublicado(row)) return null;
      return mapEpisodioDetalle(row);
    } catch {
      return obtenerEpisodioDocFallback(slug);
    }
  },

  async listarSlugs(): Promise<string[]> {
    if (!isDatabaseConfigured()) {
      return listarEpisodioDocSlugsFallback();
    }

    try {
      const show = await documentalService.obtenerShow();
      return show.episodios.map((e) => e.slug);
    } catch {
      return listarEpisodioDocSlugsFallback();
    }
  },
};

export function formatDuracionVideo(segundos: number | null): string {
  if (!segundos || segundos <= 0) return "—";
  if (segundos < 120) return `${segundos}s`;
  const m = Math.floor(segundos / 60);
  return `${m} min`;
}

/** Convierte URL de YouTube a embed si aplica */
export function toYoutubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}
