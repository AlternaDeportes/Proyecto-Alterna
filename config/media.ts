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

/** Portada del teaser / bloque documental (foto de Drive). */
export const documentaryCovers = {
  trailer: "/media/documentales/trailer.webp",
} as const;

/** Galería por deporte (fotos reales) — sección detalle. */
export const sportGalleries: Record<
  string,
  { src: string; alt: string; label: string }[]
> = {
  "ultimate-frisbee": [
    {
      src: "/media/deportes/ultimate-frisbee.webp",
      alt: "Ultimate Frisbee — práctica en cancha",
      label: "Práctica",
    },
    {
      src: "/media/historias/luchi-farias-g2.webp",
      alt: "Ultimate — entrenamiento en el parque",
      label: "Entrenamiento",
    },
    {
      src: "/media/historias/ciclo-dussex-g2.webp",
      alt: "Ultimate — juego con jersey Ciclo",
      label: "Partido",
    },
  ],
  newcom: [
    {
      src: "/media/deportes/newcom.webp",
      alt: "Newcom — partido en el club",
      label: "Partido",
    },
    {
      src: "/media/deportes/newcom-02.webp",
      alt: "Newcom — jugadoras en cancha",
      label: "Juego",
    },
    {
      src: "/media/deportes/newcom-03.webp",
      alt: "Newcom — entrenamiento",
      label: "Entrenamiento",
    },
  ],
  wingfoil: [
    {
      src: "/media/deportes/wingfoil.webp",
      alt: "Wingfoil en el agua",
      label: "En el agua",
    },
    {
      src: "/media/historias/lucio-cinaglia.webp",
      alt: "Wingfoil — equipo en la costa",
      label: "Equipo",
    },
    {
      src: "/media/historias/lucio-cinaglia-g2.webp",
      alt: "Wingfoil en la laguna",
      label: "Laguna",
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
  "luchi-farias": {
    cover: "/media/historias/luchi-farias.webp",
    gallery: [
      {
        src: "/media/historias/luchi-farias.webp",
        alt: "Ultimate en el parque",
        label: "Entrenamiento",
      },
      {
        src: "/media/historias/luchi-farias-g2.webp",
        alt: "Ultimate — escena de juego",
        label: "Juego",
      },
    ],
  },
  "ciclo-dussex": {
    cover: "/media/historias/ciclo-dussex.webp",
    gallery: [
      {
        src: "/media/historias/ciclo-dussex.webp",
        alt: "Ultimate — práctica Ciclo",
        label: "Práctica",
      },
      {
        src: "/media/historias/ciclo-dussex-g2.webp",
        alt: "Ultimate en cancha",
        label: "Cancha",
      },
    ],
  },
  "monica-lovecchio": {
    cover: "/media/deportes/newcom-02.webp",
    gallery: [
      {
        src: "/media/deportes/newcom-02.webp",
        alt: "Newcom — jugadoras en cancha",
        label: "Juego",
      },
      {
        src: "/media/deportes/newcom.webp",
        alt: "Newcom — partido",
        label: "Partido",
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

export function sportGallery(slug: string): { src: string; alt: string; label: string }[] {
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
