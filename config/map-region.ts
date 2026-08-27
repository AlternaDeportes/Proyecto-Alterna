import { designTokens } from "@/config/design-tokens";

/** Región del mapa: Santa Fe y alrededores (~100 km). */
export const MAP_REGION = {
  center: { lat: -31.6333, lng: -60.7 },
  radiusKm: 100,
  /** Zoom al explorar toda la región */
  exploreZoom: 10,
  /** Zoom en modo cerca de mí */
  nearZoom: 13,
} as const;

/** Los tres deportes del proyecto transmedia ALTERNA (fichas, podcast, docs). */
export const FEATURED_SPORT_SLUGS = [
  "ultimate-frisbee",
  "newcom",
  "wingfoil",
] as const;

export type FeaturedSportSlug = (typeof FEATURED_SPORT_SLUGS)[number];

/**
 * Categoría de mapa para prácticas fuera de los tres foco.
 * No tiene ficha en /deportes ni podcast/documental propios.
 */
export const OTROS_SPORT_SLUG = "otros";
export const OTROS_SPORT_COLOR = designTokens.colors.accent;

export const FEATURED_SPORT_LABELS: Record<FeaturedSportSlug, string> = {
  "ultimate-frisbee": "Ultimate",
  newcom: "Newcom",
  wingfoil: "Wingfoil",
};

/**
 * Localidades dentro / cerca de la región (para proponer puntos y seed).
 * Coords aprox. del centro urbano.
 */
export const MAP_CIUDADES = [
  {
    slug: "santa-fe",
    nombre: "Santa Fe",
    region: "Santa Fe",
    lat: -31.6333,
    lng: -60.7,
  },
  {
    slug: "santo-tome",
    nombre: "Santo Tomé",
    region: "Santa Fe",
    lat: -31.6625,
    lng: -60.7653,
  },
  {
    slug: "parana",
    nombre: "Paraná",
    region: "Entre Ríos",
    lat: -31.7413,
    lng: -60.5115,
  },
  {
    slug: "recreo",
    nombre: "Recreo",
    region: "Santa Fe",
    lat: -31.4906,
    lng: -60.7347,
  },
  {
    slug: "sauce-viejo",
    nombre: "Sauce Viejo",
    region: "Santa Fe",
    lat: -31.7714,
    lng: -60.8356,
  },
  {
    slug: "esperanza",
    nombre: "Esperanza",
    region: "Santa Fe",
    lat: -31.4489,
    lng: -60.9317,
  },
] as const;

export type MapCiudadSlug = (typeof MAP_CIUDADES)[number]["slug"];

export function esDeporteDestacado(slug: string): boolean {
  return (FEATURED_SPORT_SLUGS as readonly string[]).includes(slug);
}

export function colorDeporteMapa(slug: string, colorPrimario: string): string {
  if (esDeporteDestacado(slug)) return colorPrimario;
  return OTROS_SPORT_COLOR;
}
