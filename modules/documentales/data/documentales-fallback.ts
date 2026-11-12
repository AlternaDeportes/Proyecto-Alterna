import { documentaryCovers } from "@/config/media";
import { documentalWatchUrl, teaserWatchUrl } from "@/config/site";
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
      "El documental de ALTERNA ya se ve en la web. Ultimate, Newcom y Wingfoil en Santa Fe.",
  },
};

const DOCUMENTAL: DocumentalEpisodioDetalle = {
  id: "doc-documental",
  slug: "documental",
  titulo: "Documental",
  sinopsis:
    "El documental de ALTERNA, para ver en la web. Ultimate, Newcom y Wingfoil en Santa Fe.",
  numero: 1,
  duracionSeg: null,
  videoUrl: documentalWatchUrl(),
  coverUrl: documentaryCovers.trailer,
  publishedAt: "2026-11-12T00:00:00-03:00",
  proximo: false,
  etiqueta: "Documental",
  documental: {
    slug: "alterna-documental",
    titulo: "ALTERNA — Deportes por descubrir",
    sinopsis:
      "El documental de ALTERNA ya se ve en la web. Ultimate, Newcom y Wingfoil en Santa Fe.",
  },
};

const SHOW: DocumentalShow = {
  id: "doc-alterna",
  slug: "alterna-documental",
  titulo: "ALTERNA — Deportes por descubrir",
  sinopsis:
    "El documental de ALTERNA ya se ve en la web. Ultimate, Newcom y Wingfoil en Santa Fe.",
  coverUrl: documentaryCovers.trailer,
  publishedAt: "2026-09-16T00:00:00-03:00",
  episodios: [TRAILER, DOCUMENTAL],
};

export function obtenerDocumentalFallback(): DocumentalShow {
  return SHOW;
}

export function obtenerEpisodioDocFallback(
  slug: string
): DocumentalEpisodioDetalle | null {
  if (slug === TRAILER.slug) return TRAILER;
  if (slug === DOCUMENTAL.slug) return DOCUMENTAL;
  return null;
}

export function listarEpisodioDocSlugsFallback(): string[] {
  return [TRAILER.slug, DOCUMENTAL.slug];
}
