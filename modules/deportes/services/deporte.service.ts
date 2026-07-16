import { isDatabaseConfigured } from "@/config/env";
import { siteConfig } from "@/config/site";
import {
  listarDeportesFallback,
  obtenerDeporteFallback,
} from "@/modules/deportes/data/deportes-fallback";
import { deporteRepository } from "@/modules/deportes/repositories/deporte.repository";
import type { DeporteDetalle, DeporteListItem } from "@/modules/deportes/types";
import { deporteSlugSchema } from "@/modules/deportes/validations/deporte.schema";

function mapDeporteList(
  deporte: Awaited<ReturnType<typeof deporteRepository.findAllPublicados>>[number]
): DeporteListItem {
  return {
    id: deporte.id,
    slug: deporte.slug,
    nombre: deporte.nombre,
    descripcion: deporte.descripcion,
    colorPrimario: deporte.colorPrimario,
    destacado: deporte.destacado,
    ubicacionesCount: deporte._count.ubicaciones,
    historiasCount: deporte._count.historias,
  };
}

function mapDeporteDetalle(
  deporte: NonNullable<Awaited<ReturnType<typeof deporteRepository.findBySlug>>>
): DeporteDetalle {
  return {
    id: deporte.id,
    slug: deporte.slug,
    nombre: deporte.nombre,
    descripcion: deporte.descripcion,
    historia: deporte.historia,
    dificultad: deporte.dificultad,
    jugadoresMin: deporte.jugadoresMin,
    jugadoresMax: deporte.jugadoresMax,
    equipamiento: deporte.equipamiento,
    colorPrimario: deporte.colorPrimario,
    destacado: deporte.destacado,
    ubicacionesCount: deporte._count.ubicaciones,
    historiasCount: deporte._count.historias,
    seoTitle: deporte.seoTitle,
    seoDescription: deporte.seoDescription,
    historias: deporte.historias,
    ubicaciones: deporte.ubicaciones,
  };
}

export const deporteService = {
  async listar(ciudadSlug = siteConfig.defaultCity.slug): Promise<DeporteListItem[]> {
    if (!isDatabaseConfigured()) {
      return listarDeportesFallback();
    }

    try {
      const deportes = await deporteRepository.findAllPublicados(ciudadSlug);
      return deportes.map(mapDeporteList);
    } catch {
      return listarDeportesFallback();
    }
  },

  async obtenerPorSlug(slug: string): Promise<DeporteDetalle | null> {
    const parsed = deporteSlugSchema.safeParse(slug);
    if (!parsed.success) return null;

    if (!isDatabaseConfigured()) {
      return obtenerDeporteFallback(parsed.data);
    }

    try {
      const deporte = await deporteRepository.findBySlug(parsed.data);
      return deporte ? mapDeporteDetalle(deporte) : obtenerDeporteFallback(parsed.data);
    } catch {
      return obtenerDeporteFallback(parsed.data);
    }
  },

  async listarSlugs(): Promise<string[]> {
    if (!isDatabaseConfigured()) {
      return listarDeportesFallback().map((d) => d.slug);
    }

    try {
      const rows = await deporteRepository.findAllSlugs();
      return rows.map((r) => r.slug);
    } catch {
      return listarDeportesFallback().map((d) => d.slug);
    }
  },
};
