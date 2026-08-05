/**
 * Design System ALTERNA — Manual de Identidad Corporativa
 * Única fuente de verdad para color, tipografía, ritmo, motion y superficies.
 *
 * Semántica de color (manual):
 * - primary  #2A5FF4 — exploración, confianza, acción
 * - secondary #AFEB00 — energía, comunidad, vitalidad
 * - accent   #FFA300 — calidez, descubrimiento
 * - ink      #1D1D1B — soporte oscuro / base documental
 * - surface  #FFFFFF — contraste tipográfico y secciones editoriales
 *
 * Ritmo: los tres cromáticos deben convivir en cada recorrido
 * (eyebrows, CTAs, franjas, iconografía). El blanco refuerza contraste sobre ink.
 */

export const designTokens = {
  colors: {
    primary: "#2A5FF4",
    secondary: "#AFEB00",
    accent: "#FFA300",
    ink: "#1D1D1B",
    surface: "#FFFFFF",
    /** Degradado hero / atmósfera documental */
    inkDeep: "#0A0D14",
    inkBlue: "#121824",
    primaryDeep: "#152A6B",
  },
  fonts: {
    display: "Montserrat Alternates",
    body: "Inter",
  },
  sports: {
    ultimate: "#2D6A4F",
    newcom: "#E07A2F",
    wingfoil: "#1D7596",
  },
  /** Escala tipográfica editorial (rem) */
  type: {
    display: {
      sm: "2.25rem",
      md: "3rem",
      lg: "3.75rem",
      xl: "4.5rem",
    },
    title: {
      sm: "1.5rem",
      md: "1.875rem",
      lg: "2.25rem",
    },
    body: {
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
    },
    eyebrow: "0.75rem",
  },
  space: {
    sectionY: { sm: "5rem", md: "6rem", lg: "7rem" },
    gutter: { sm: "1rem", md: "1.5rem" },
    content: "72rem", // max-w-6xl
  },
  radius: {
    /** Esquinas orgánicas de marca */
    organic: "2rem 1rem 2.5rem 1.2rem",
    /** Marco fotográfico (manual) */
    frame: "1.75rem 0.85rem 2.1rem 1rem",
    /** Controles / CTAs */
    pill: "9999px",
    soft: "1rem",
  },
  shadow: {
    soft: "0 20px 50px rgba(29, 29, 27, 0.08)",
    lift: "0 24px 48px rgba(29, 29, 27, 0.18)",
    glowPrimary: "0 12px 40px rgba(42, 95, 244, 0.28)",
    glowSecondary: "0 12px 40px rgba(175, 235, 0, 0.22)",
    glowAccent: "0 12px 40px rgba(255, 163, 0, 0.25)",
  },
  motion: {
    fast: "150ms",
    base: "300ms",
    slow: "600ms",
    reveal: "700ms",
    pageEnter: "500ms",
    mediaHover: "900ms",
    kenBurns: "28s",
    blob: { drift: "18s", driftReverse: "22s", pulse: "14s" },
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  z: {
    base: 0,
    raised: 10,
    sticky: 40,
    header: 50,
    overlay: 60,
    toast: 70,
  },
} as const;

export type DesignTokens = typeof designTokens;

/** Acceso tipado a colores de deporte por slug canónico */
export const sportColorBySlug: Record<string, string> = {
  "ultimate-frisbee": designTokens.sports.ultimate,
  newcom: designTokens.sports.newcom,
  wingfoil: designTokens.sports.wingfoil,
};

export function resolveSportColor(slug: string, fallback?: string): string {
  return sportColorBySlug[slug] ?? fallback ?? designTokens.colors.primary;
}
