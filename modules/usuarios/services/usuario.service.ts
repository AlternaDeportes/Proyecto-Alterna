import { prisma } from "@/lib/prisma";
import type { FavoritoEntidad, FavoritoItem, PerfilUsuario } from "@/modules/usuarios/types";
import { favoritoSchema } from "@/modules/usuarios/validations/favorito.schema";

export class FavoritoValidationError extends Error {
  constructor(public fieldErrors: Record<string, string[] | undefined>) {
    super("Favorito inválido");
    this.name = "FavoritoValidationError";
  }
}

async function resolveFavoritoMeta(
  entidad: FavoritoEntidad,
  entidadId: string
): Promise<{ titulo: string; href: string } | null> {
  if (entidad === "deporte") {
    const d = await prisma.deporte.findFirst({
      where: { id: entidadId, deletedAt: null },
      select: { nombre: true, slug: true },
    });
    return d ? { titulo: d.nombre, href: `/deportes/${d.slug}` } : null;
  }
  if (entidad === "historia") {
    const h = await prisma.historia.findFirst({
      where: { id: entidadId, deletedAt: null },
      select: { titulo: true, slug: true },
    });
    return h ? { titulo: h.titulo, href: `/historias/${h.slug}` } : null;
  }
  const u = await prisma.ubicacion.findFirst({
    where: { id: entidadId, deletedAt: null },
    select: { nombre: true },
  });
  return u ? { titulo: u.nombre, href: "/mapa" } : null;
}

export const usuarioService = {
  async obtenerPerfil(usuarioId: string): Promise<PerfilUsuario | null> {
    const usuario = await prisma.usuario.findFirst({
      where: { id: usuarioId, deletedAt: null },
      include: {
        rol: true,
        favoritos: { orderBy: { createdAt: "desc" }, take: 50 },
        ubicaciones: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { deporte: { select: { nombre: true } } },
        },
      },
    });

    if (!usuario) return null;

    const favoritos: FavoritoItem[] = [];
    for (const fav of usuario.favoritos) {
      const entidad = fav.entidad as FavoritoEntidad;
      if (!["deporte", "historia", "ubicacion"].includes(entidad)) continue;
      const meta = await resolveFavoritoMeta(entidad, fav.entidadId);
      if (!meta) continue;
      favoritos.push({
        id: fav.id,
        entidad,
        entidadId: fav.entidadId,
        titulo: meta.titulo,
        href: meta.href,
        createdAt: fav.createdAt.toISOString(),
      });
    }

    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      avatarUrl: usuario.avatarUrl,
      rol: usuario.rol.nombre,
      favoritos,
      aportesMapa: usuario.ubicaciones.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        moderacion: u.moderacion,
        deporteNombre: u.deporte.nombre,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  },

  async listarFavoritos(usuarioId: string) {
    const perfil = await this.obtenerPerfil(usuarioId);
    return perfil?.favoritos ?? [];
  },

  async esFavorito(usuarioId: string, entidad: FavoritoEntidad, entidadId: string) {
    const row = await prisma.favorito.findUnique({
      where: {
        usuarioId_entidad_entidadId: { usuarioId, entidad, entidadId },
      },
    });
    return Boolean(row);
  },

  async toggleFavorito(usuarioId: string, input: unknown) {
    const parsed = favoritoSchema.safeParse(input);
    if (!parsed.success) {
      throw new FavoritoValidationError(parsed.error.flatten().fieldErrors);
    }

    const { entidad, entidadId } = parsed.data;
    const meta = await resolveFavoritoMeta(entidad, entidadId);
    if (!meta) {
      throw new FavoritoValidationError({
        entidadId: ["Contenido no encontrado."],
      });
    }

    const existente = await prisma.favorito.findUnique({
      where: {
        usuarioId_entidad_entidadId: { usuarioId, entidad, entidadId },
      },
    });

    if (existente) {
      await prisma.favorito.delete({ where: { id: existente.id } });
      return { favorito: false as const };
    }

    await prisma.favorito.create({
      data: { usuarioId, entidad, entidadId },
    });
    return { favorito: true as const, titulo: meta.titulo, href: meta.href };
  },
};
