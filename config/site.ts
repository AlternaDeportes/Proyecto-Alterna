/**
 * Configuración centralizada del sitio ALTERNA.
 * Contacto, redes y metadatos: modificar SOLO este archivo.
 */
export const siteConfig = {
  name: "ALTERNA",
  tagline: "Deportes por descubrir.",
  description:
    "Narrativa transmedia documental sobre deportes alternativos y amateurs en Santa Fe. Historias reales, comunidades vivas y un mapa para explorar.",
  url: "https://alterna.example.com",
  locale: "es-AR",
  defaultCity: {
    name: "Santa Fe",
    region: "Santa Fe",
    country: "Argentina",
    slug: "santa-fe",
  },
  contact: {
    email: "hola@alterna.example.com",
    phone: "+54 342 000 0000",
  },
  social: {
    youtube: "https://youtube.com/@alterna-ejemplo",
    instagram: "https://instagram.com/alterna.ejemplo",
    tiktok: "https://tiktok.com/@alterna.ejemplo",
    spotify: "https://open.spotify.com/show/ejemplo-alterna",
  },
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Documental", href: "/documentales" },
    { label: "Deportes", href: "/deportes" },
    { label: "Historias", href: "/historias" },
    { label: "Mapa", href: "/mapa" },
    { label: "Podcast", href: "/podcasts" },
    { label: "Comunidad", href: "/comunidad" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Enlaces de redes con etiqueta para UI */
export const socialLinks = [
  { key: "youtube" as const, label: "YouTube", hint: "Documental" },
  { key: "instagram" as const, label: "Instagram", hint: "Comunidad" },
  { key: "tiktok" as const, label: "TikTok", hint: "Clips" },
  { key: "spotify" as const, label: "Spotify", hint: "Podcast" },
] as const;
