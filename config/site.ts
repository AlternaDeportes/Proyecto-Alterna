/**
 * Configuración centralizada del sitio ALTERNA.
 * Contacto, redes y metadatos: modificar SOLO este archivo.
 */
export const siteConfig = {
  name: "ALTERNA",
  /** Nombre que ve Google y la pestaña del navegador. */
  tabName: "Alterna",
  tagline: "Deportes por descubrir.",
  description:
    "ALTERNA es el puente entre quienes juegan ultimate, newcom y wingfoil en Santa Fe y quienes quieren encontrarlos. Mirá las historias, ubicá el lugar y sumate.",
  /** Dominio canónico de producción (Vercel). */
  url: "https://proyecto-alterna.vercel.app",
  locale: "es-AR",
  defaultCity: {
    name: "Santa Fe",
    region: "Santa Fe",
    country: "Argentina",
    slug: "santa-fe",
  },
  contact: {
    email: "alterna.transmedia@gmail.com",
    phone: null as string | null,
  },
  social: {
    youtube: "https://www.youtube.com/@alterna.transmedia",
    instagram: "https://www.instagram.com/alterna_sf/",
    spotify: "https://open.spotify.com/show/6IW62cfYvSnhQphY6YpF9T",
  },
  podcastShow: {
    title: "Alternando voces",
    href: "https://open.spotify.com/show/6IW62cfYvSnhQphY6YpF9T",
    cover: "/media/podcast/alternando-voces.webp",
  },
  /** Teaser documental — publicado en YouTube. */
  teaser: {
    youtubeId: "EVA-VO6IL14",
    published: true,
    title: 'Teaser: Proyecto "Alterna"',
    label: "Ya disponible",
    shortLabel: "En YouTube",
  },
  /**
   * Nav primaria — máx. 6 ítems (manual: comunicación simple).
   * Comunidad y Contacto viven en footer / secondaryNav.
   */
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Documental", href: "/documentales" },
    { label: "Podcast", href: "/podcasts" },
    { label: "Deportes", href: "/deportes" },
    { label: "Historias", href: "/historias" },
    { label: "Mapa", href: "/mapa" },
  ],
  secondaryNav: [
    { label: "Comunidad", href: "/comunidad" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export function isTeaserLive(): boolean {
  return siteConfig.teaser.published;
}

export function teaserWatchUrl(): string {
  return `https://youtu.be/${siteConfig.teaser.youtubeId}`;
}

export function teaserEmbedUrl(autoplay = false): string {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${siteConfig.teaser.youtubeId}?${params.toString()}`;
}

/** Enlaces de redes con etiqueta para UI */
export const socialLinks = [
  { key: "youtube" as const, label: "YouTube", hint: "Teaser disponible" },
  { key: "instagram" as const, label: "Instagram", hint: "Comunidad" },
  { key: "spotify" as const, label: "Spotify", hint: "Alternando voces" },
] as const;

/** Nav completa para footer (primaria + secundaria) */
export const footerNavigation = [
  ...siteConfig.navigation,
  ...siteConfig.secondaryNav,
] as const;
