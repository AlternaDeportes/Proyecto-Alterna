/**
 * Catálogo de media local — solo fotos reales del proyecto.
 * Cloudinary / DB pueden sobrescribir vía coverUrl.
 */

export const HERO_POSTER = "/media/hero/poster.webp";
export const HERO_VIDEO_MP4 = "/assets/video/hero-loop.mp4";
export const HERO_VIDEO_WEBM = "/assets/video/hero-loop.webm";

/**
 * Hero: 3 fotos por deporte. El loop arma rondas de 3
 * (una de cada deporte, orden aleatorio) y recorre las 9.
 */
export const HERO_SPORT_SLIDES = {
  ultimate: [
    "/media/hero/pool/ultimate-01.webp",
    "/media/hero/pool/ultimate-03.webp",
    "/media/hero/pool/ultimate-04.webp",
  ],
  newcom: [
    "/media/hero/pool/newcom-01.webp",
    "/media/hero/pool/newcom-02.webp",
    "/media/hero/pool/newcom-03.webp",
  ],
  wingfoil: [
    "/media/hero/pool/wingfoil-02.webp",
    "/media/hero/pool/wingfoil-04.webp",
    "/media/hero/pool/wingfoil-07.webp",
  ],
} as const;

export type HeroSportKey = keyof typeof HERO_SPORT_SLIDES;

const HERO_SPORTS = Object.keys(HERO_SPORT_SLIDES) as HeroSportKey[];

export const HERO_IMAGE_POOL = HERO_SPORTS.flatMap(
  (sport) => HERO_SPORT_SLIDES[sport]
);

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = items[i];
    const swap = items[j];
    if (current === undefined || swap === undefined) continue;
    items[i] = swap;
    items[j] = current;
  }
  return items;
}

export function sportFromHeroSrc(src: string): HeroSportKey | null {
  for (const sport of HERO_SPORTS) {
    if ((HERO_SPORT_SLIDES[sport] as readonly string[]).includes(src)) {
      return sport;
    }
  }
  return null;
}

/**
 * Playlist de 9 fotos: 3 rondas × 1 foto por deporte.
 * Orden de deportes aleatorio; no se repite el mismo deporte al cruzar rondas.
 */
export function buildHeroPlaylist(avoidFirstSport?: HeroSportKey | null): string[] {
  const queues: Record<HeroSportKey, string[]> = {
    ultimate: shuffleInPlace([...HERO_SPORT_SLIDES.ultimate]),
    newcom: shuffleInPlace([...HERO_SPORT_SLIDES.newcom]),
    wingfoil: shuffleInPlace([...HERO_SPORT_SLIDES.wingfoil]),
  };

  const playlist: string[] = [];
  let lastSport: HeroSportKey | null = avoidFirstSport ?? null;

  for (let round = 0; round < 3; round++) {
    const order = shuffleInPlace([...HERO_SPORTS]);
    if (lastSport && order[0] === lastSport) {
      const swapAt = order.findIndex((sport, i) => i > 0 && sport !== lastSport);
      if (swapAt > 0) {
        const first = order[0];
        const other = order[swapAt];
        if (first !== undefined && other !== undefined) {
          order[0] = other;
          order[swapAt] = first;
        }
      }
    }

    for (const sport of order) {
      const next = queues[sport].shift();
      if (!next) continue;
      playlist.push(next);
      lastSport = sport;
    }
  }

  return playlist.length > 0 ? playlist : [HERO_POSTER];
}

export function pickRandomHeroImage(): string {
  const i = Math.floor(Math.random() * HERO_IMAGE_POOL.length);
  return HERO_IMAGE_POOL[i] ?? HERO_POSTER;
}

/** Intervalo entre fotos del hero (ms). */
export const HERO_SLIDE_MS = 5000;
/** Duración del crossfade entre fotos (ms). */
export const HERO_FADE_MS = 2000;

export const IMAGE_QUALITY = 88;

export const sportCovers: Record<string, string | undefined> = {
  "ultimate-frisbee": "/media/deportes/ultimate-frisbee.webp",
  newcom: "/media/deportes/newcom.webp",
  wingfoil: "/media/deportes/wingfoil.webp",
};

/** Portada del teaser / bloque documental (cancha de Ultimate). */
export const documentaryCovers = {
  trailer: "/media/documentales/teaser-cover.webp",
} as const;

/** Galería por deporte (fotos reales) — sección detalle. */
export const sportGalleries: Record<
  string,
  { src: string; alt: string; label: string; width: number; height: number }[]
> = {
  "ultimate-frisbee": [
    {
      src: "/media/deportes/ultimate-frisbee.webp",
      alt: "Ultimate — jugador con el disco, listo para el pase",
      label: "El disco",
      width: 2400,
      height: 1600,
    },
    {
      src: "/media/hero/pool/ultimate-02.webp",
      alt: "Cancha de Ultimate, con el rodaje en primer plano",
      label: "En la cancha",
      width: 1500,
      height: 2000,
    },
    {
      src: "/media/hero/pool/ultimate-05.webp",
      alt: "Partido de Ultimate en un parque de Santa Fe",
      label: "Partido",
      width: 2000,
      height: 1500,
    },
  ],
  newcom: [
    {
      src: "/media/deportes/newcom.webp",
      alt: "Newcom — partido en el club",
      label: "Partido",
      width: 1350,
      height: 2400,
    },
    {
      src: "/media/deportes/newcom-02.webp",
      alt: "Newcom — jugadoras en cancha",
      label: "Juego",
      width: 1350,
      height: 2400,
    },
    {
      src: "/media/deportes/newcom-03.webp",
      alt: "Newcom — entrenamiento",
      label: "Entrenamiento",
      width: 1350,
      height: 2400,
    },
  ],
  wingfoil: [
    {
      src: "/media/deportes/wingfoil.webp",
      alt: "Wingfoil en el agua",
      label: "En el agua",
      width: 1350,
      height: 2400,
    },
    {
      src: "/media/historias/lucio-cinaglia.webp",
      alt: "Wingfoil — equipo en la costa",
      label: "Equipo",
      width: 1350,
      height: 2400,
    },
    {
      src: "/media/historias/lucio-cinaglia-g2.webp",
      alt: "Wingfoil en la laguna",
      label: "Laguna",
      width: 1350,
      height: 2400,
    },
  ],
};

export const storyMedia: Record<
  string,
  {
    cover?: string;
    gallery: { src: string; alt: string; label: string }[];
  }
> = {
  "guillermo-calamante": {
    cover: "/media/historias/guillermo-calamante.webp",
    gallery: [
      {
        src: "/media/historias/guillermo-calamante.webp",
        alt: "Guillermo «Lobo» Calamante lanza el disco con la camiseta de Malón",
        label: "En la cancha",
      },
    ],
  },
  "ciclo-dussex": {
    cover: "/media/historias/ciclo-dussex-retrato.webp",
    gallery: [
      {
        src: "/media/historias/ciclo-dussex-retrato.webp",
        alt: "Adriel «Ciclo» Dussex con el disco, camiseta de Malón",
        label: "En la cancha",
      },
    ],
  },
  susana: {
    cover: "/media/historias/susana-brazos.webp",
    gallery: [
      {
        src: "/media/historias/susana-brazos.webp",
        alt: "Susana en la cancha de Newcom, con los brazos cruzados y la camiseta 37",
        label: "En la cancha",
      },
    ],
  },
  "lucio-cinaglia": {
    cover: "/media/historias/lucio-cinaglia.webp",
    gallery: [
      {
        src: "/media/historias/lucio-cinaglia.webp",
        alt: "Wingfoil — costa",
        label: "Costa",
      },
      {
        src: "/media/historias/lucio-cinaglia-g2.webp",
        alt: "Wingfoil en el agua",
        label: "Laguna",
      },
    ],
  },
};

/**
 * Fotos de la clínica en Malón Querandí.
 * No incluyen los retratos que ya están en las historias.
 */
export const clinicGallery: { src: string; alt: string; label: string; width: number; height: number }[] = [
  {
    src: "/media/clinica/clinica-01.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 780,
    height: 1386,
  },
  {
    src: "/media/clinica/clinica-02.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-03.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 838,
    height: 1489,
  },
  {
    src: "/media/clinica/clinica-04.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 865,
    height: 1538,
  },
  {
    src: "/media/clinica/clinica-05.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-06.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 799,
    height: 1420,
  },
  {
    src: "/media/clinica/clinica-07.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 860,
    height: 1529,
  },
  {
    src: "/media/clinica/clinica-08.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-09.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-10.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-11.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-12.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/clinica/clinica-13.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-14.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/clinica/clinica-15.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 894,
    height: 1590,
  },
  {
    src: "/media/clinica/clinica-16.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 889,
    height: 1580,
  },
  {
    src: "/media/clinica/clinica-17.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-18.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-19.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 899,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-20.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-21.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 793,
    height: 1410,
  },
  {
    src: "/media/clinica/clinica-22.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-23.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-24.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 874,
    height: 1553,
  },
  {
    src: "/media/clinica/clinica-25.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-26.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/clinica/clinica-27.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-28.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-29.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-30.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 1482,
    height: 834,
  },
  {
    src: "/media/clinica/clinica-31.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 838,
    height: 1490,
  },
  {
    src: "/media/clinica/clinica-32.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-33.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-34.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-35.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-36.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 833,
    height: 1481,
  },
  {
    src: "/media/clinica/clinica-37.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-38.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-39.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 724,
    height: 1287,
  },
  {
    src: "/media/clinica/clinica-40.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-41.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-42.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-43.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
  {
    src: "/media/clinica/clinica-44.webp",
    alt: "Clínica de Ultimate en la cancha de Malón Querandí",
    label: "Clínica",
    width: 900,
    height: 1600,
  },
];

/** Prefiere URL de CMS/Cloudinary; si no, catálogo local. */
export function resolveCover(
  override: string | null | undefined,
  catalogPath: string | undefined
): string | null {
  if (override) return override;
  return catalogPath ?? null;
}

export function sportCover(slug: string, override?: string | null): string | null {
  return resolveCover(override, sportCovers[slug]);
}

export function sportGallery(slug: string): { src: string; alt: string; label: string; width: number; height: number }[] {
  return sportGalleries[slug] ?? [];
}

export function storyCover(slug: string, override?: string | null): string | null {
  return resolveCover(override, storyMedia[slug]?.cover);
}

export function storyGallery(
  slug: string,
  fromDb?: { id: string; src: string; alt: string; label: string }[]
): { id: string; src: string; alt: string; label: string }[] {
  if (fromDb && fromDb.length > 0 && fromDb.every((i) => i.src)) return fromDb;
  const local = storyMedia[slug]?.gallery;
  if (!local) return fromDb ?? [];
  return local.map((item, i) => ({
    id: `local-${slug}-${i}`,
    ...item,
  }));
}
