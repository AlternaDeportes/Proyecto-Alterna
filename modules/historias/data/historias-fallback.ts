import type { HistoriaDetalle, HistoriaListItem } from "@/modules/historias/types";
import { designTokens } from "@/config/design-tokens";
import { storyCover, storyGallery } from "@/config/media";

function excerptFrom(cuerpo: string, max = 160) {
  const clean = cuerpo.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

const CUERPOS = {
  "guillermo-calamante": `Guillermo «Lobo» Calamante juega Ultimate con Malón. En la cancha se lo ve con el disco en la mano, en pleno lance, con la camiseta del equipo.

En Santa Fe el partido se arma en el pasto, sin reflectores. ALTERNA lo suma entre quienes ya están en la cancha y abren el paso a quien quiere acercarse.`,

  "ciclo-dussex": `Adriel Dussex — «Ciclo» — entrena grupos de Ultimate con una obsesión concreta: que nadie se quede afuera. En Santa Fe arma espacios donde el primer entrenamiento no intimida y el segundo ya se siente comunidad.

Ciclo habla poco de talento y mucho de constancia. El disco enseña lectura colectiva: mirar al costado, anticipar, confiar. Por eso insiste en que entrenar no es solo mejorar el pase; es construir un lugar donde cualquiera pueda sumarse.

En ALTERNA su testimonio abre la puerta a una generación que sostiene el deporte amateur sin esperar reconocimiento masivo. La cancha es plaza, parque, cualquier rectángulo de pasto que aguante un disco volando.`,

  susana: `Susana tiene 75 años y juega Newcom. No sabía qué era el deporte: se lo dijeron el primer día, se enganchó y siguió.

Hoy va a la práctica, compite y lo disfruta. Ella lo dice así: es un deporte que la atrapó, y nunca pensó que a esta edad iba a estar haciéndolo. Hasta que le den los huesos, sigue.

En ALTERNA aparece en la cancha, con la camiseta del Newcom, como una de las voces que sostienen el juego.`,

  "lucio-cinaglia": `Lucio Cinaglia enseña Wingfoil mirando el río como parte del juego, no como decorado. En la Laguna Setúbal y costas del Paraná, el viento define la clase tanto como la tabla.

La iniciación es progresiva: respeto por el agua, paciencia con el equilibrio, comunidad entre quienes esperan la ráfaga justa. Lucio insiste en que el deporte no empieza cuando levantás el ala; empieza cuando aprendés a leer el entorno.

En ALTERNA su voz conecta territorio y práctica: Santa Fe no es solo ciudad de plazas; también es agua, costa y un deporte que crece lejos de las canchas tradicionales.`,
} as const;

export const HISTORIAS_FALLBACK: HistoriaDetalle[] = [
  {
    id: "hist-guillermo",
    slug: "guillermo-calamante",
    titulo: "Guillermo «Lobo» Calamante",
    pullQuote: null,
    destacada: true,
    cuerpo: CUERPOS["guillermo-calamante"],
    excerpt: excerptFrom(CUERPOS["guillermo-calamante"]),
    deporte: {
      nombre: "Ultimate Frisbee",
      slug: "ultimate-frisbee",
      colorPrimario: designTokens.sports.ultimate,
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    coverUrl: storyCover("guillermo-calamante"),
    seoTitle: "Guillermo Calamante — Ultimate Frisbee | ALTERNA",
    seoDescription:
      "Guillermo «Lobo» Calamante juega Ultimate con Malón, en el documental ALTERNA.",
    galeria: storyGallery("guillermo-calamante"),
  },
  {
    id: "hist-ciclo",
    slug: "ciclo-dussex",
    titulo: "Adriel «Ciclo» Dussex",
    pullQuote: "Entrenar es armar un espacio donde cualquiera puede sumarse.",
    destacada: true,
    cuerpo: CUERPOS["ciclo-dussex"],
    excerpt: excerptFrom(CUERPOS["ciclo-dussex"]),
    deporte: {
      nombre: "Ultimate Frisbee",
      slug: "ultimate-frisbee",
      colorPrimario: designTokens.sports.ultimate,
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    coverUrl: storyCover("ciclo-dussex"),
    seoTitle: "Adriel Dussex — Ultimate Frisbee | ALTERNA",
    seoDescription:
      "Historia de Ciclo Dussex, entrenador de Ultimate en Santa Fe, en ALTERNA.",
    galeria: storyGallery("ciclo-dussex"),
  },
  {
    id: "hist-susana",
    slug: "susana",
    titulo: "Susana",
    pullQuote:
      "Un deporte que me atrapó, que yo nunca pensé que a esta edad iba a estar haciendo deporte.",
    destacada: true,
    cuerpo: CUERPOS["susana"],
    excerpt: excerptFrom(CUERPOS["susana"]),
    deporte: {
      nombre: "Newcom",
      slug: "newcom",
      colorPrimario: designTokens.sports.newcom,
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    coverUrl: storyCover("susana"),
    seoTitle: "Susana — Newcom | ALTERNA",
    seoDescription:
      "Susana juega Newcom en Santa Fe y cuenta cómo el deporte la atrapó a los 75 años.",
    galeria: storyGallery("susana"),
  },
  {
    id: "hist-lucio",
    slug: "lucio-cinaglia",
    titulo: "Lucio Cinaglia",
    pullQuote: "El río no es un escenario: es parte del juego.",
    destacada: true,
    cuerpo: CUERPOS["lucio-cinaglia"],
    excerpt: excerptFrom(CUERPOS["lucio-cinaglia"]),
    deporte: {
      nombre: "Wingfoil",
      slug: "wingfoil",
      colorPrimario: designTokens.sports.wingfoil,
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    coverUrl: storyCover("lucio-cinaglia"),
    seoTitle: "Lucio Cinaglia — Wingfoil | ALTERNA",
    seoDescription:
      "Historia de Lucio Cinaglia, instructor de Wingfoil en Santa Fe.",
    galeria: storyGallery("lucio-cinaglia"),
  },
];

export function listarHistoriasFallback(): HistoriaListItem[] {
  return HISTORIAS_FALLBACK.map(
    ({ cuerpo: _c, galeria: _g, seoTitle: _s, seoDescription: _d, ...item }) => item
  );
}

export function obtenerHistoriaFallback(slug: string): HistoriaDetalle | null {
  return HISTORIAS_FALLBACK.find((h) => h.slug === slug) ?? null;
}

/** Cuerpo editorial completo para enriquecer seed / DB */
export function cuerpoHistoriaPorSlug(slug: string): string | undefined {
  return CUERPOS[slug as keyof typeof CUERPOS];
}
