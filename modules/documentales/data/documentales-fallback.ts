import { documentaryCovers } from "@/config/media";
import { teaserWatchUrl } from "@/config/site";
import type {
  DocumentalEpisodioDetalle,
  DocumentalShow,
} from "@/modules/documentales/types";

const TRAILER: DocumentalEpisodioDetalle = {
  id: "doc-trailer",
  slug: "trailer",
  titulo: "Teaser",
  sinopsis: "Mirá el primer vistazo. Después, el mapa te lleva hasta quienes juegan.",
  numero: 0,
  duracionSeg: null,
  videoUrl: teaserWatchUrl(),
  coverUrl: documentaryCovers.trailer,
  publishedAt: "2026-09-16T00:00:00-03:00",
  proximo: false,
  etiqueta: "Trailer",
  documental: {
    slug: "alterna-documental",
    titulo: "ALTERNA — Deportes por descubrir",
    sinopsis:
      "Mirá el teaser y después encontrá a quienes juegan ultimate, newcom y wingfoil en Santa Fe.",
  },
};

const SHOW: DocumentalShow = {
  id: "doc-alterna",
  slug: "alterna-documental",
  titulo: "ALTERNA — Deportes por descubrir",
  sinopsis:
    "Mirá el teaser y después encontrá a quienes juegan ultimate, newcom y wingfoil en Santa Fe.",
  coverUrl: documentaryCovers.trailer,
  publishedAt: "2026-09-16T00:00:00-03:00",
  episodios: [TRAILER],
};

export function obtenerDocumentalFallback(): DocumentalShow {
  return SHOW;
}

export function obtenerEpisodioDocFallback(
  slug: string
): DocumentalEpisodioDetalle | null {
  if (slug !== TRAILER.slug) return null;
  return TRAILER;
}

export function listarEpisodioDocSlugsFallback(): string[] {
  return [TRAILER.slug];
}
