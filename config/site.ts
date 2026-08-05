/**
 * Configuración centralizada del sitio ALTERNA.
 * Contacto, redes y metadatos: modificar SOLO este archivo.
 */
export const siteConfig = {
  name: "ALTERNA",
  tagline: "Deportes por descubrir.",
  description:
    "Narrativa transmedia documental sobre deportes alternativos y amateurs en Santa Fe. Historias reales, comunidades vivas y un mapa para explorar.",
  /** Dominio de producción — pendiente; SEO usa NEXT_PUBLIC_SITE_URL. */
  url: "https://alterna.example.com",
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
    spotify:
      "https://open.spotify.com/user/31vfbgez4p7unw33yrhfo75cmjzm?si=ebd4e28019fa46da",
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

/** Enlaces de redes con etiqueta para UI */
export const socialLinks = [
  { key: "youtube" as const, label: "YouTube", hint: "Documental" },
  { key: "instagram" as const, label: "Instagram", hint: "Comunidad" },
  { key: "spotify" as const, label: "Spotify", hint: "Perfil" },
] as const;

/** Nav completa para footer (primaria + secundaria) */
export const footerNavigation = [
  ...siteConfig.navigation,
  ...siteConfig.secondaryNav,
] as const;
