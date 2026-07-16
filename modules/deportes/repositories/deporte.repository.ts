import { prisma } from "@/lib/prisma";
import { sinEliminados } from "@/modules/database/types";

export const deporteRepository = {
  async findAllPublicados(ciudadSlug?: string) {
    return prisma.deporte.findMany({
      where: {
        ...sinEliminados,
        publishedAt: { not: null },
        ...(ciudadSlug
          ? { ciudad: { slug: ciudadSlug, ...sinEliminados } }
          : {}),
      },
      include: {
        ciudad: true,
        categoria: true,
        _count: { select: { ubicaciones: true, historias: true } },
      },
      orderBy: { nombre: "asc" },
    });
  },

  async findBySlug(slug: string) {
    return prisma.deporte.findFirst({
      where: {
        slug,
        ...sinEliminados,
        publishedAt: { not: null },
      },
      include: {
        ciudad: true,
        categoria: true,
        multimedia: { orderBy: { orden: "asc" } },
        historias: {
          where: { ...sinEliminados, publishedAt: { not: null } },
          orderBy: { publishedAt: "desc" },
          take: 6,
          select: {
            id: true,
            slug: true,
            titulo: true,
            pullQuote: true,
          },
        },
        ubicaciones: {
          where: { ...sinEliminados, moderacion: "APROBADO" },
          orderBy: { nombre: "asc" },
          take: 8,
          select: {
            id: true,
            nombre: true,
            direccion: true,
            horarios: true,
          },
        },
        _count: { select: { ubicaciones: true, historias: true } },
      },
    });
  },

  async findAllSlugs() {
    return prisma.deporte.findMany({
      where: { ...sinEliminados, publishedAt: { not: null } },
      select: { slug: true },
    });
  },
};
