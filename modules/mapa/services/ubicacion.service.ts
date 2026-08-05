import { MAP_REGION } from "@/config/map-region";
import { isDatabaseConfigured } from "@/config/env";
import { distanciaKm } from "@/lib/geo";
import { UBICACIONES_FALLBACK } from "@/modules/mapa/data/ubicaciones-fallback";
import { ubicacionRepository } from "@/modules/mapa/repositories/ubicacion.repository";
import type { MapUbicacion } from "@/modules/mapa/types";

function mapFromDb(
  row: Awaited<ReturnType<typeof ubicacionRepository.findMany>>[number]
): MapUbicacion {
  return {
    id: row.id,
    nombre: row.nombre,
    direccion: row.direccion,
    lat: row.lat,
    lng: row.lng,
    horarios: row.horarios,
    contacto: row.contacto,
    historia: row.historia,
    deporteOtroNombre: row.deporteOtroNombre,
    deporte: row.deporte,
    ciudad: row.ciudad,
    comentariosCount: row._count.comentarios,
  };
}

function dentroDeRegion(u: { lat: number; lng: number }): boolean {
  return distanciaKm(MAP_REGION.center, u) <= MAP_REGION.radiusKm;
}

export const ubicacionService = {
  /**
   * Lista puntos aprobados de la región Santa Fe ±100 km.
   * Opcionalmente filtra por deporte (slug exacto) antes del filtro de región.
   */
  async listar(opciones?: {
    deporteSlug?: string;
  }): Promise<MapUbicacion[]> {
    const deporteSlug = opciones?.deporteSlug;

    if (!isDatabaseConfigured()) {
      return UBICACIONES_FALLBACK.filter(
        (u) =>
          dentroDeRegion(u) &&
          (!deporteSlug || u.deporte.slug === deporteSlug)
      );
    }

    try {
      const rows = await ubicacionRepository.findMany({
        deporteSlug: deporteSlug || undefined,
      });
      const mapped = (rows.length ? rows.map(mapFromDb) : UBICACIONES_FALLBACK).filter(
        dentroDeRegion
      );
      return mapped;
    } catch {
      return UBICACIONES_FALLBACK.filter(
        (u) =>
          dentroDeRegion(u) &&
          (!deporteSlug || u.deporte.slug === deporteSlug)
      );
    }
  },
};
