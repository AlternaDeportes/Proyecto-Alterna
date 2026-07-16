import { prisma } from "@/lib/prisma";
import { sinEliminados } from "@/modules/database/types";

export const podcastRepository = {
  async findShowBySlug(slug: string) {
    return prisma.podcast.findFirst({
      where: { slug, ...sinEliminados, publishedAt: { not: null } },
      include: {
        episodios: {
          where: sinEliminados,
          orderBy: { numero: "asc" },
          include: {
            deportes: {
              include: {
                deporte: {
                  select: { nombre: true, slug: true, colorPrimario: true },
                },
              },
            },
          },
        },
      },
    });
  },

  async findFirstShow() {
    return prisma.podcast.findFirst({
      where: { ...sinEliminados, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include: {
        episodios: {
          where: sinEliminados,
          orderBy: { numero: "asc" },
          include: {
            deportes: {
              include: {
                deporte: {
                  select: { nombre: true, slug: true, colorPrimario: true },
                },
              },
            },
          },
        },
      },
    });
  },

  async findEpisodioBySlug(slug: string) {
    return prisma.podcastEpisodio.findFirst({
      where: { slug, ...sinEliminados },
      include: {
        podcast: {
          select: { slug: true, titulo: true, descripcion: true },
        },
        deportes: {
          include: {
            deporte: {
              select: { nombre: true, slug: true, colorPrimario: true },
            },
          },
        },
      },
    });
  },

  async findEpisodiosByDeporte(deporteSlug: string) {
    return prisma.podcastEpisodio.findMany({
      where: {
        ...sinEliminados,
        deportes: { some: { deporte: { slug: deporteSlug } } },
      },
      orderBy: { numero: "asc" },
      include: {
        deportes: {
          include: {
            deporte: {
              select: { nombre: true, slug: true, colorPrimario: true },
            },
          },
        },
      },
    });
  },

  async findAllEpisodioSlugs() {
    return prisma.podcastEpisodio.findMany({
      where: sinEliminados,
      select: { slug: true },
    });
  },
};
