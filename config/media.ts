/**
 * Catálogo de media local — Fase B.
 * Rutas públicas bajo /media. Cloudinary puede sobrescribir vía coverUrl en DB.
 */

export const HERO_POSTER = "/media/hero/poster.webp";
export const HERO_VIDEO_MP4 = "/assets/video/hero-loop.mp4";
export const HERO_VIDEO_WEBM = "/assets/video/hero-loop.webm";

/** Fondo del bloque manifiesto — comunidad en juego (no el poster del hero). */
export const MANIFESTO_BG = "/media/manifiesto/personas.webp";

export const sportCovers: Record<string, string> = {
  "ultimate-frisbee": "/media/deportes/ultimate-frisbee.webp",
  newcom: "/media/deportes/newcom.webp",
  wingfoil: "/media/deportes/wingfoil.webp",
};

export const storyMedia: Record<
  string,
  { cover: string; gallery: { src: string; alt: string; label: string }[] }
> = {
  "luchi-farias": {
    cover: "/media/historias/luchi-farias.webp",
    gallery: [
      {
        src: "/media/historias/luchi-farias.webp",
        alt: "Retrato — Lucila Farías",
        label: "Retrato",
      },
      {
        src: "/media/historias/luchi-farias-g2.webp",
        alt: "Ultimate en el parque",
        label: "Entrenamiento",
      },
    ],
  },
  "ciclo-dussex": {
    cover: "/media/historias/ciclo-dussex.webp",
    gallery: [
      {
        src: "/media/historias/ciclo-dussex.webp",
        alt: "Retrato — Adriel Dussex",
        label: "Retrato",
      },
      {
        src: "/media/historias/ciclo-dussex-g2.webp",
        alt: "Práctica de Ultimate",
        label: "Práctica",
      },
    ],
  },
  "monica-lovecchio": {
    cover: "/media/historias/monica-lovecchio.webp",
    gallery: [
      {
        src: "/media/historias/monica-lovecchio.webp",
        alt: "Retrato — Mónica Lovecchio",
        label: "Retrato",
      },
      {
        src: "/media/historias/monica-lovecchio-g2.webp",
        alt: "Comunidad Newcom",
        label: "Comunidad",
      },
    ],
  },
  "lucio-cinaglia": {
    cover: "/media/historias/lucio-cinaglia.webp",
    gallery: [
      {
        src: "/media/historias/lucio-cinaglia.webp",
        alt: "Retrato — Lucio Cinaglia",
        label: "Retrato",
      },
      {
        src: "/media/historias/lucio-cinaglia-g2.webp",
        alt: "Wingfoil en el agua",
        label: "Laguna",
      },
    ],
  },
};

export const documentalCovers: Record<string, string> = {
  "alterna-documental": "/media/documentales/trailer.webp",
  trailer: "/media/documentales/trailer.webp",
  "episodio-01-ultimate": "/media/documentales/episodio-01.webp",
  "episodio-02-newcom-wingfoil": "/media/documentales/episodio-02.webp",
};

export const podcastCovers: Record<string, string> = {
  "alterna-podcast": "/media/podcast/cover.webp",
  "entrenar-en-comunidad": "/media/podcast/entrenar-en-comunidad.webp",
  "jugar-fuera-del-foco": "/media/podcast/jugar-fuera-del-foco.webp",
  "viento-y-rio": "/media/podcast/viento-y-rio.webp",
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

export function documentalCover(slug: string, override?: string | null): string | null {
  return resolveCover(override, documentalCovers[slug]);
}

export function podcastCover(slug: string, override?: string | null): string | null {
  return resolveCover(override, podcastCovers[slug]);
}
