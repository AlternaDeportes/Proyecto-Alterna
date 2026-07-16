import type {
  DocumentalEpisodioDetalle,
  DocumentalEpisodioListItem,
  DocumentalShow,
} from "@/modules/documentales/types";

const SHOW = {
  id: "doc-alterna",
  slug: "alterna-documental",
  titulo: "ALTERNA — Deportes por descubrir",
  sinopsis:
    "Serie documental sobre deportes alternativos y amateurs en Santa Fe. Trailer y episodios para profundizar en las historias humanas detrás de cada disciplina.",
  coverUrl: null as string | null,
  publishedAt: "2026-07-01T12:00:00.000Z",
};

const EPISODIOS: DocumentalEpisodioDetalle[] = [
  {
    id: "doc-ep-0",
    slug: "trailer",
    titulo: "Primer vistazo",
    sinopsis: "Presentación del universo narrativo de ALTERNA. Empezá por acá.",
    numero: 0,
    duracionSeg: 90,
    videoUrl: null,
    publishedAt: null,
    proximo: true,
    etiqueta: "Comenzá acá",
    documental: {
      slug: SHOW.slug,
      titulo: SHOW.titulo,
      sinopsis: SHOW.sinopsis,
    },
  },
  {
    id: "doc-ep-1",
    slug: "episodio-01-ultimate",
    titulo: "Ultimate Frisbee",
    sinopsis:
      "Comunidad, entrenamiento y espíritu deportivo sin árbitros. Voces del Parque Federal y más allá.",
    numero: 1,
    duracionSeg: 18 * 60,
    videoUrl: null,
    publishedAt: null,
    proximo: true,
    etiqueta: "Historia 1",
    documental: {
      slug: SHOW.slug,
      titulo: SHOW.titulo,
      sinopsis: SHOW.sinopsis,
    },
  },
  {
    id: "doc-ep-2",
    slug: "episodio-02-newcom-wingfoil",
    titulo: "Newcom y Wingfoil",
    sinopsis:
      "Diversidad de prácticas y apropiación del territorio santafesino: clubes, costa y río.",
    numero: 2,
    duracionSeg: 22 * 60,
    videoUrl: null,
    publishedAt: null,
    proximo: true,
    etiqueta: "Historia 2",
    documental: {
      slug: SHOW.slug,
      titulo: SHOW.titulo,
      sinopsis: SHOW.sinopsis,
    },
  },
];

function toListItem(ep: DocumentalEpisodioDetalle): DocumentalEpisodioListItem {
  const { documental: _d, ...rest } = ep;
  return rest;
}

export function obtenerDocumentalFallback(): DocumentalShow {
  return {
    ...SHOW,
    episodios: EPISODIOS.map(toListItem),
  };
}

export function obtenerEpisodioDocFallback(
  slug: string
): DocumentalEpisodioDetalle | null {
  return EPISODIOS.find((e) => e.slug === slug) ?? null;
}

export function listarEpisodioDocSlugsFallback(): string[] {
  return EPISODIOS.map((e) => e.slug);
}
