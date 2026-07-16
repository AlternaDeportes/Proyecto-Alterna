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

function etiquetaFromNumero(numero: number): string | undefined {
  if (numero === 0) return "Comenzá acá";
  if (numero === 1) return "Historia 1";
  if (numero === 2) return "Historia 2";
  return undefined;
}

function mapEpisodioList(
  row: EpisodioRow | NonNullable<
    Awaited<ReturnType<typeof documentalRepository.findFirstShow>>
  >["episodios"][number]
): DocumentalEpisodioListItem {
  const fallback = obtenerEpisodioDocFallback(row.slug);
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    sinopsis: row.sinopsis,
    numero: row.numero,
    duracionSeg: row.duracionSeg,
    videoUrl: row.videoUrl,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    proximo: !row.videoUrl || !row.publishedAt,
    etiqueta: fallback?.etiqueta ?? etiquetaFromNumero(row.numero),
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
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    sinopsis: row.sinopsis,
    coverUrl: row.coverUrl,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    episodios: row.episodios.map(mapEpisodioList),
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
      return row ? mapEpisodioDetalle(row) : obtenerEpisodioDocFallback(slug);
    } catch {
      return obtenerEpisodioDocFallback(slug);
    }
  },

  async listarSlugs(): Promise<string[]> {
    if (!isDatabaseConfigured()) {
      return listarEpisodioDocSlugsFallback();
    }

    try {
      const rows = await documentalRepository.findAllEpisodioSlugs();
      return rows.map((r) => r.slug);
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
