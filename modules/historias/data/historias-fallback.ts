import type { HistoriaDetalle, HistoriaListItem } from "@/modules/historias/types";

function excerptFrom(cuerpo: string, max = 160) {
  const clean = cuerpo.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

const CUERPOS = {
  "luchi-farias": `Lucila Farías — «Luchi» para el equipo — llegó al Ultimate casi de casualidad. Una amiga la invitó a un entrenamiento en el Parque Federal y, en pocas semanas, el disco pasó de ser un juego raro a una forma de habitar la ciudad.

En Santa Fe, el Ultimate crece por recomendación. No hay reflectores ni contratos: hay pases, corridas y un pacto tácito de fair play. Luchi lo resume sin dramatizar: el equipo es más grande que el resultado.

Hoy juega, invita a principiantes y aparece en el documental ALTERNA como una de las voces que sostienen la disciplina lejos del show mediático. Su historia es la de muchas: descubrir un deporte porque alguien te dijo “vení, probá”.`,

  "ciclo-dussex": `Adriel Dussex — «Ciclo» — entrena grupos de Ultimate con una obsesión concreta: que nadie se quede afuera. En Santa Fe arma espacios donde el primer entrenamiento no intimida y el segundo ya se siente comunidad.

Ciclo habla poco de talento y mucho de constancia. El disco enseña lectura colectiva: mirar al costado, anticipar, confiar. Por eso insiste en que entrenar no es solo mejorar el pase; es construir un lugar donde cualquiera pueda sumarse.

En ALTERNA su testimonio abre la puerta a una generación que sostiene el deporte amateur sin esperar reconocimiento masivo. La cancha es plaza, parque, cualquier rectángulo de pasto que aguante un disco volando.`,

  "monica-lovecchio": `Mónica Lovecchio encontró en el Newcom algo que no buscaba: una red. Clubes, centros vecinales y torneos barriales tejen una escena intergeneracional donde el partido dura más que el marcador.

En Santa Fe el Newcom se sostiene con autogestión. Hay redes bajas, reglas propias y un clima que mezcla competencia con cuidado. Mónica lo describe como una familia que no sabía que necesitaba: gente con quien entrenar, charlar y volver la semana siguiente.

Su historia en el documental es también la de un deporte poco mediático que, sin embargo, llena gimnasios y armarios de clubes. ALTERNA la escucha para que esa comunidad deje de ser invisible.`,

  "lucio-cinaglia": `Lucio Cinaglia enseña Wingfoil mirando el río como parte del juego, no como decorado. En la Laguna Setúbal y costas del Paraná, el viento define la clase tanto como la tabla.

La iniciación es progresiva: respeto por el agua, paciencia con el equilibrio, comunidad entre quienes esperan la ráfaga justa. Lucio insiste en que el deporte no empieza cuando levantás el ala; empieza cuando aprendés a leer el entorno.

En ALTERNA su voz conecta territorio y práctica: Santa Fe no es solo ciudad de plazas; también es agua, costa y un deporte que crece lejos de las canchas tradicionales.`,
} as const;

export const HISTORIAS_FALLBACK: HistoriaDetalle[] = [
  {
    id: "hist-luchi",
    slug: "luchi-farias",
    titulo: "Lucila «Luchi» Farías",
    pullQuote: "El Ultimate me enseñó que el equipo es más grande que el resultado.",
    destacada: true,
    cuerpo: CUERPOS["luchi-farias"],
    excerpt: excerptFrom(CUERPOS["luchi-farias"]),
    deporte: {
      nombre: "Ultimate Frisbee",
      slug: "ultimate-frisbee",
      colorPrimario: "#2d6a4f",
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    seoTitle: "Lucila Farías — Ultimate Frisbee | ALTERNA",
    seoDescription:
      "Historia de Luchi Farías, jugadora de Ultimate Frisbee en Santa Fe, en el documental ALTERNA.",
    galeria: [
      { id: "g1", alt: "Entrenamiento de Ultimate", label: "Entrenamiento" },
      { id: "g2", alt: "Equipo en el parque", label: "Equipo" },
    ],
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
      colorPrimario: "#2d6a4f",
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    seoTitle: "Adriel Dussex — Ultimate Frisbee | ALTERNA",
    seoDescription:
      "Historia de Ciclo Dussex, entrenador de Ultimate en Santa Fe, en ALTERNA.",
    galeria: [
      { id: "g1", alt: "Práctica de pases", label: "Práctica" },
      { id: "g2", alt: "Grupo de principiantes", label: "Comunidad" },
    ],
  },
  {
    id: "hist-monica",
    slug: "monica-lovecchio",
    titulo: "Mónica Lovecchio",
    pullQuote: "En Newcom encontré una familia que no sabía que necesitaba.",
    destacada: true,
    cuerpo: CUERPOS["monica-lovecchio"],
    excerpt: excerptFrom(CUERPOS["monica-lovecchio"]),
    deporte: {
      nombre: "Newcom",
      slug: "newcom",
      colorPrimario: "#e07a2f",
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    seoTitle: "Mónica Lovecchio — Newcom | ALTERNA",
    seoDescription:
      "Historia de Mónica Lovecchio y la comunidad de Newcom en Santa Fe.",
    galeria: [
      { id: "g1", alt: "Partido de Newcom", label: "Partido" },
      { id: "g2", alt: "Club y red baja", label: "Club" },
    ],
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
      colorPrimario: "#1d7596",
    },
    publishedAt: "2026-07-01T12:00:00.000Z",
    seoTitle: "Lucio Cinaglia — Wingfoil | ALTERNA",
    seoDescription:
      "Historia de Lucio Cinaglia, instructor de Wingfoil en Santa Fe.",
    galeria: [
      { id: "g1", alt: "Wingfoil en la laguna", label: "Laguna" },
      { id: "g2", alt: "Clase de iniciación", label: "Clase" },
    ],
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
