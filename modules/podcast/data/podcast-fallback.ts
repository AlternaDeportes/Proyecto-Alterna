import type {
  PodcastEpisodioDetalle,
  PodcastEpisodioListItem,
  PodcastShow,
} from "@/modules/podcast/types";
import { designTokens } from "@/config/design-tokens";
import { podcastCover } from "@/config/media";

const SHOW = {
  id: "pod-alterna",
  slug: "alterna-podcast",
  titulo: "ALTERNA Podcast",
  descripcion:
    "Charlas con entrenadores, jugadoras y referentes para ampliar la historia más allá de la imagen. Voces en primera persona desde Santa Fe.",
  coverUrl: podcastCover("alterna-podcast"),
  publishedAt: "2026-07-01T12:00:00.000Z",
};

const EPISODIOS: PodcastEpisodioDetalle[] = [
  {
    id: "ep-1",
    slug: "entrenar-en-comunidad",
    titulo: "Entrenar en comunidad",
    descripcion:
      "Conversación sobre autogestión, constancia y pertenencia local. Cómo se arma un entrenamiento abierto cuando no hay club grande detrás.",
    numero: 1,
    duracionSeg: 28 * 60,
    audioUrl: null,
    coverUrl: podcastCover("entrenar-en-comunidad"),
    publishedAt: null,
    proximo: true,
    deportes: [
      { nombre: "Ultimate Frisbee", slug: "ultimate-frisbee", colorPrimario: designTokens.sports.ultimate },
    ],
    capitulos: [
      { titulo: "Cómo empezó el grupo" },
      { titulo: "Fair play sin árbitros" },
      { titulo: "Invitar a quien nunca jugó" },
    ],
    podcast: {
      slug: SHOW.slug,
      titulo: SHOW.titulo,
      descripcion: SHOW.descripcion,
    },
  },
  {
    id: "ep-2",
    slug: "jugar-fuera-del-foco",
    titulo: "Jugar fuera del foco",
    descripcion:
      "Historias de quienes sostienen deportes invisibilizados: Newcom, redes barriales y el valor de volver cada semana.",
    numero: 2,
    duracionSeg: 32 * 60,
    audioUrl: null,
    coverUrl: podcastCover("jugar-fuera-del-foco"),
    publishedAt: null,
    proximo: true,
    deportes: [
      { nombre: "Newcom", slug: "newcom", colorPrimario: designTokens.sports.newcom },
    ],
    capitulos: [
      { titulo: "El club como refugio" },
      { titulo: "Generaciones en la misma cancha" },
      { titulo: "Por qué importa contar esto" },
    ],
    podcast: {
      slug: SHOW.slug,
      titulo: SHOW.titulo,
      descripcion: SHOW.descripcion,
    },
  },
  {
    id: "ep-3",
    slug: "viento-y-rio",
    titulo: "Viento y río",
    descripcion:
      "Wingfoil, lectura del entorno y aprendizaje progresivo junto al Paraná. El río no es un escenario: es parte del juego.",
    numero: 3,
    duracionSeg: 26 * 60,
    audioUrl: null,
    coverUrl: podcastCover("viento-y-rio"),
    publishedAt: null,
    proximo: true,
    deportes: [
      { nombre: "Wingfoil", slug: "wingfoil", colorPrimario: designTokens.sports.wingfoil },
    ],
    capitulos: [
      { titulo: "Primera clase en el agua" },
      { titulo: "Leer el viento" },
      { titulo: "Comunidad en la costa" },
    ],
    podcast: {
      slug: SHOW.slug,
      titulo: SHOW.titulo,
      descripcion: SHOW.descripcion,
    },
  },
];

function toListItem(ep: PodcastEpisodioDetalle): PodcastEpisodioListItem {
  const { capitulos: _c, podcast: _p, ...rest } = ep;
  return rest;
}

export function obtenerPodcastFallback(): PodcastShow {
  return {
    ...SHOW,
    episodios: EPISODIOS.map(toListItem),
  };
}

export function listarEpisodiosFallback(deporteSlug?: string): PodcastEpisodioListItem[] {
  const all = EPISODIOS.map(toListItem);
  if (!deporteSlug) return all;
  return all.filter((e) => e.deportes.some((d) => d.slug === deporteSlug));
}

export function obtenerEpisodioFallback(slug: string): PodcastEpisodioDetalle | null {
  return EPISODIOS.find((e) => e.slug === slug) ?? null;
}

export function listarEpisodioSlugsFallback(): string[] {
  return EPISODIOS.map((e) => e.slug);
}
