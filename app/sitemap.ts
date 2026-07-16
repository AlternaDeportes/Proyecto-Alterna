import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/metadata";
import { documentalService } from "@/modules/documentales/services/documental.service";
import { deporteService } from "@/modules/deportes/services/deporte.service";
import { historiaService } from "@/modules/historias/services/historia.service";
import { podcastService } from "@/modules/podcast/services/podcast.service";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/deportes", changeFrequency: "weekly", priority: 0.9 },
  { path: "/documentales", changeFrequency: "weekly", priority: 0.85 },
  { path: "/historias", changeFrequency: "weekly", priority: 0.85 },
  { path: "/podcasts", changeFrequency: "weekly", priority: 0.8 },
  { path: "/mapa", changeFrequency: "daily", priority: 0.9 },
  { path: "/comunidad", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let deporteEntries: MetadataRoute.Sitemap = [];
  let historiaEntries: MetadataRoute.Sitemap = [];
  let podcastEntries: MetadataRoute.Sitemap = [];
  let documentalEntries: MetadataRoute.Sitemap = [];

  try {
    const slugs = await deporteService.listarSlugs();
    deporteEntries = slugs.map((slug) => ({
      url: `${base}/deportes/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    deporteEntries = [];
  }

  try {
    const slugs = await historiaService.listarSlugs();
    historiaEntries = slugs.map((slug) => ({
      url: `${base}/historias/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    historiaEntries = [];
  }

  try {
    const slugs = await podcastService.listarSlugs();
    podcastEntries = slugs.map((slug) => ({
      url: `${base}/podcasts/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    podcastEntries = [];
  }

  try {
    const slugs = await documentalService.listarSlugs();
    documentalEntries = slugs.map((slug) => ({
      url: `${base}/documentales/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    documentalEntries = [];
  }

  return [
    ...staticEntries,
    ...deporteEntries,
    ...historiaEntries,
    ...podcastEntries,
    ...documentalEntries,
  ];
}
