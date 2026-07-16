import { prisma } from "@/lib/prisma";
import { sinEliminados } from "@/modules/database/types";

export const documentalRepository = {
  async findFirstShow() {
    return prisma.documental.findFirst({
      where: { ...sinEliminados, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include: {
        episodios: {
          where: sinEliminados,
          orderBy: { numero: "asc" },
        },
      },
    });
  },

  async findEpisodioBySlug(slug: string) {
    return prisma.documentalEpisodio.findFirst({
      where: { slug, ...sinEliminados },
      include: {
        documental: {
          select: { slug: true, titulo: true, sinopsis: true },
        },
      },
    });
  },

  async findAllEpisodioSlugs() {
    return prisma.documentalEpisodio.findMany({
      where: sinEliminados,
      select: { slug: true },
    });
  },
};
