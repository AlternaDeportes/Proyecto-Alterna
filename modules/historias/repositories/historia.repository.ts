import { prisma } from "@/lib/prisma";
import { sinEliminados } from "@/modules/database/types";

export const historiaRepository = {
  async findAllPublicadas(deporteSlug?: string) {
    return prisma.historia.findMany({
      where: {
        ...sinEliminados,
        publishedAt: { not: null },
        ...(deporteSlug
          ? { deporte: { slug: deporteSlug, ...sinEliminados } }
          : {}),
      },
      include: {
        deporte: {
          select: { nombre: true, slug: true, colorPrimario: true },
        },
      },
      orderBy: [{ destacada: "desc" }, { publishedAt: "desc" }],
    });
  },

  async findBySlug(slug: string) {
    return prisma.historia.findFirst({
      where: {
        slug,
        ...sinEliminados,
        publishedAt: { not: null },
      },
      include: {
        deporte: {
          select: { nombre: true, slug: true, colorPrimario: true },
        },
        multimedia: { orderBy: { orden: "asc" } },
      },
    });
  },

  async findAllSlugs() {
    return prisma.historia.findMany({
      where: { ...sinEliminados, publishedAt: { not: null } },
      select: { slug: true },
    });
  },

  async findDestacadas(take = 4) {
    return prisma.historia.findMany({
      where: {
        ...sinEliminados,
        publishedAt: { not: null },
        destacada: true,
      },
      include: {
        deporte: {
          select: { nombre: true, slug: true, colorPrimario: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      take,
    });
  },
};
