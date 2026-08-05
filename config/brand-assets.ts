/**
 * Catálogo de iconografía y patrones — Manual / mesas de trabajo ALTERNA.
 * Fuentes: `Logos y mas/` (procesadas a PNG con negro transparente).
 */

export const brandIcons = {
  markA: "/brand/icons/mark-a.png",
  mapaPuente: "/brand/icons/mapa-puente.png",
  comunidadRed: "/brand/icons/comunidad-red.png",
  comunidadPersonas: "/brand/icons/comunidad-personas.png",
  pasion: "/brand/icons/pasion.png",
  accion: "/brand/icons/accion.png",
  ultimate: "/brand/icons/ultimate.png",
  newcom: "/brand/icons/newcom.png",
  wingfoil: "/brand/icons/wingfoil.png",
} as const;

export type BrandIconId = keyof typeof brandIcons;

export const brandPatterns = {
  marksDiagonal: "/brand/patterns/marks-diagonal.png",
  marksGrid: "/brand/patterns/marks-grid.png",
  ondas: "/brand/patterns/ondas.png",
  marcoPanel: "/brand/patterns/marco-panel.png",
  selloCircular: "/brand/patterns/sello-circular.png",
} as const;

export type BrandPatternId = keyof typeof brandPatterns;

/** Icono de deporte por slug canónico */
export const sportIconBySlug: Record<string, BrandIconId> = {
  "ultimate-frisbee": "ultimate",
  newcom: "newcom",
  wingfoil: "wingfoil",
};

export function resolveSportIcon(slug: string): BrandIconId {
  return sportIconBySlug[slug] ?? "accion";
}

/**
 * Ritmo cromático de marca (manual):
 * azul = exploración / acción
 * lima = energía / comunidad
 * naranja = calidez / descubrimiento
 * blanco = contraste / tipografía secundaria
 */
export const brandColorRhythm = ["primary", "secondary", "accent"] as const;
export type BrandColorTone = (typeof brandColorRhythm)[number];

export function brandToneAt(index: number): BrandColorTone {
  return brandColorRhythm[index % brandColorRhythm.length]!;
}
