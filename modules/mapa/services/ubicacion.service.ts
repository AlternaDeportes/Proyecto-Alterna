import { siteConfig } from "@/config/site";
import { isDatabaseConfigured } from "@/config/env";
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
    deporte: row.deporte,
    comentariosCount: row._count.comentarios,
  };
}

export const ubicacionService = {
  async listar(opciones?: {
    ciudadSlug?: string;
    deporteSlug?: string;
  }): Promise<MapUbicacion[]> {
    const ciudadSlug = opciones?.ciudadSlug ?? siteConfig.defaultCity.slug;
    const deporteSlug = opciones?.deporteSlug;

    if (!isDatabaseConfigured()) {
      return UBICACIONES_FALLBACK.filter(
        (u) => !deporteSlug || u.deporte.slug === deporteSlug
      );
    }

    try {
      const rows = await ubicacionRepository.findMany({
        ciudadSlug,
        deporteSlug: deporteSlug || undefined,
      });
      if (!rows.length) return UBICACIONES_FALLBACK;
      return rows.map(mapFromDb);
    } catch {
      return UBICACIONES_FALLBACK.filter(
        (u) => !deporteSlug || u.deporte.slug === deporteSlug
      );
    }
  },
};
