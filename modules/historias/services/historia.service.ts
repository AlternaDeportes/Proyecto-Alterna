import { isDatabaseConfigured } from "@/config/env";
import {
  cuerpoHistoriaPorSlug,
  listarHistoriasFallback,
  obtenerHistoriaFallback,
} from "@/modules/historias/data/historias-fallback";
import { historiaRepository } from "@/modules/historias/repositories/historia.repository";
import type { HistoriaDetalle, HistoriaListItem } from "@/modules/historias/types";

function excerptFrom(cuerpo: string, max = 160) {
  const clean = cuerpo.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

function enrichCuerpo(slug: string, cuerpo: string) {
  const editorial = cuerpoHistoriaPorSlug(slug);
  if (!editorial) return cuerpo;
  if (cuerpo.includes("Historia en producción") || cuerpo.length < 80) {
    return editorial;
  }
  return cuerpo;
}

function mapList(
  row: Awaited<ReturnType<typeof historiaRepository.findAllPublicadas>>[number]
): HistoriaListItem {
  const cuerpo = enrichCuerpo(row.slug, row.cuerpo);
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    pullQuote: row.pullQuote,
    destacada: row.destacada,
    excerpt: excerptFrom(cuerpo),
    deporte: row.deporte,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}

function mapDetalle(
  row: NonNullable<Awaited<ReturnType<typeof historiaRepository.findBySlug>>>
): HistoriaDetalle {
  const cuerpo = enrichCuerpo(row.slug, row.cuerpo);
  const galeria =
    row.multimedia.length > 0
      ? row.multimedia.map((m, i) => ({
          id: m.id,
          alt: m.altText ?? row.titulo,
          label: m.altText ?? `Imagen ${i + 1}`,
        }))
      : [
          { id: "ph-1", alt: `${row.titulo} — retrato`, label: "Retrato" },
          { id: "ph-2", alt: `${row.titulo} — contexto`, label: "Contexto" },
        ];

  return {
    ...mapList(row),
    cuerpo,
    excerpt: excerptFrom(cuerpo),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    galeria,
  };
}

export const historiaService = {
  async listar(deporteSlug?: string): Promise<HistoriaListItem[]> {
    if (!isDatabaseConfigured()) {
      const all = listarHistoriasFallback();
      return deporteSlug ? all.filter((h) => h.deporte.slug === deporteSlug) : all;
    }

    try {
      const rows = await historiaRepository.findAllPublicadas(deporteSlug);
      return rows.map(mapList);
    } catch {
      const all = listarHistoriasFallback();
      return deporteSlug ? all.filter((h) => h.deporte.slug === deporteSlug) : all;
    }
  },

  async destacadas(take = 4): Promise<HistoriaListItem[]> {
    if (!isDatabaseConfigured()) {
      return listarHistoriasFallback().slice(0, take);
    }

    try {
      const rows = await historiaRepository.findDestacadas(take);
      return rows.map(mapList);
    } catch {
      return listarHistoriasFallback().slice(0, take);
    }
  },

  async obtenerPorSlug(slug: string): Promise<HistoriaDetalle | null> {
    if (!isDatabaseConfigured()) {
      return obtenerHistoriaFallback(slug);
    }

    try {
      const row = await historiaRepository.findBySlug(slug);
      return row ? mapDetalle(row) : obtenerHistoriaFallback(slug);
    } catch {
      return obtenerHistoriaFallback(slug);
    }
  },

  async listarSlugs(): Promise<string[]> {
    if (!isDatabaseConfigured()) {
      return listarHistoriasFallback().map((h) => h.slug);
    }

    try {
      const rows = await historiaRepository.findAllSlugs();
      return rows.map((r) => r.slug);
    } catch {
      return listarHistoriasFallback().map((h) => h.slug);
    }
  },
};
