import { prisma } from "@/lib/prisma";
import { sinEliminados } from "@/modules/database/types";
import type { ModeracionEstado } from "@prisma/client";

export interface FiltrosUbicacion {
  ciudadSlug?: string;
  deporteSlug?: string;
  moderacion?: ModeracionEstado;
}

export const ubicacionRepository = {
  async findMany(filtros: FiltrosUbicacion = {}) {
    return prisma.ubicacion.findMany({
      where: {
        ...sinEliminados,
        moderacion: filtros.moderacion ?? "APROBADO",
        ...(filtros.deporteSlug
          ? { deporte: { slug: filtros.deporteSlug, ...sinEliminados } }
          : {}),
        ...(filtros.ciudadSlug
          ? { ciudad: { slug: filtros.ciudadSlug, ...sinEliminados } }
          : {}),
      },
      include: {
        deporte: { select: { nombre: true, slug: true, colorPrimario: true } },
        ciudad: { select: { nombre: true, slug: true } },
        _count: { select: { comentarios: true } },
      },
      orderBy: { nombre: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.ubicacion.findFirst({
      where: { id, ...sinEliminados },
      include: {
        deporte: true,
        comentarios: {
          where: sinEliminados,
          include: { usuario: { select: { nombre: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
  },
};
