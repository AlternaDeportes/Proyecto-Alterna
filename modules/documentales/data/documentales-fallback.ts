import type {
  DocumentalEpisodioDetalle,
  DocumentalShow,
} from "@/modules/documentales/types";

/**
 * Documental / teaser todavía no publicados.
 * No inventamos episodios, trailers ni duraciones.
 */
const SHOW: DocumentalShow = {
  id: "doc-alterna",
  slug: "alterna-documental",
  titulo: "ALTERNA — Deportes por descubrir",
  sinopsis:
    "Serie documental sobre Ultimate Frisbee, Newcom y Wingfoil en Santa Fe. Trailer y capítulos en producción.",
  coverUrl: null,
  publishedAt: null,
  episodios: [],
};

export function obtenerDocumentalFallback(): DocumentalShow {
  return SHOW;
}

export function obtenerEpisodioDocFallback(
  _slug: string
): DocumentalEpisodioDetalle | null {
  return null;
}

export function listarEpisodioDocSlugsFallback(): string[] {
  return [];
}
