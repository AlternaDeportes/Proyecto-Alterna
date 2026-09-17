import { documentaryCovers } from "@/config/media";
import { siteConfig, teaserWatchUrl } from "@/config/site";
import type {
  DocumentalEpisodioDetalle,
  DocumentalShow,
} from "@/modules/documentales/types";

const TRAILER: DocumentalEpisodioDetalle = {
  id: "doc-trailer",
  slug: "trailer",
  titulo: "Teaser",
  sinopsis: "Primer vistazo al documental ALTERNA. Ya disponible en YouTube.",
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
      "Serie documental sobre Ultimate Frisbee, Newcom y Wingfoil en Santa Fe. El teaser ya está disponible en YouTube.",
  },
};

const SHOW: DocumentalShow = {
  id: "doc-alterna",
  slug: "alterna-documental",
  titulo: "ALTERNA — Deportes por descubrir",
  sinopsis:
    "Serie documental sobre Ultimate Frisbee, Newcom y Wingfoil en Santa Fe. El teaser ya está disponible en YouTube.",
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
