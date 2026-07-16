/**
 * Tokens de diseño — Manual de Identidad ALTERNA
 * Única fuente de verdad para colores de marca en Tailwind y CSS.
 */
export const designTokens = {
  colors: {
    /** Exploración, confianza, acción */
    primary: "#2A5FF4",
    /** Energía, comunidad, vitalidad */
    secondary: "#AFEB00",
    /** Calidez, descubrimiento */
    accent: "#FFA300",
    ink: "#1D1D1B",
    surface: "#FFFFFF",
  },
  fonts: {
    display: "Montserrat Alternates",
    body: "Inter",
  },
  sports: {
    ultimate: "#2d6a4f",
    newcom: "#e07a2f",
    wingfoil: "#1d7596",
  },
} as const;

export type DesignTokens = typeof designTokens;
