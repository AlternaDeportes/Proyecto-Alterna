import {
  ModeracionEstado,
  type AuditAccion,
  type Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export class AdminValidationError extends Error {
  constructor(public fieldErrors: Record<string, string[] | undefined>) {
    super("Datos inválidos");
    this.name = "AdminValidationError";
  }
}

const moderarSchema = z.object({
  accion: z.enum(["aprobar", "rechazar"]),
});

const mensajeSchema = z.object({
  leido: z.boolean(),
});

async function audit(
  usuarioId: string,
  accion: AuditAccion,
  entidad: string,
  entidadId: string,
  payload?: Prisma.InputJsonValue
) {
  await prisma.auditLog.create({
    data: {
      accion,
      entidad,
      entidadId,
      usuarioId,
      payload,
    },
  });
}

function mapUbicacion(u: {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  horarios: string;
  contacto: string | null;
  historia: string | null;
  moderacion: ModeracionEstado;
  deporteOtroNombre: string | null;
  createdAt: Date;
  deporte: { nombre: string; slug: string };
  ciudad: { nombre: string };
  creadoPor: { nombre: string; email: string } | null;
}) {
  return {
    id: u.id,
    nombre: u.nombre,
    direccion: u.direccion,
    lat: u.lat,
    lng: u.lng,
    horarios: u.horarios,
    contacto: u.contacto,
    historia: u.historia,
    moderacion: u.moderacion,
    deporteNombre: u.deporteOtroNombre?.trim() || u.deporte.nombre,
    deporteSlug: u.deporte.slug,
    ciudadNombre: u.ciudad.nombre,
    creadorNombre: u.creadoPor?.nombre ?? null,
    creadorEmail: u.creadoPor?.email ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

export const adminService = {
  async obtenerResumen() {
    const [
      pendientes,
      comentariosPendientes,
      comentarios,
      mensajesNoLeidos,
      deportes,
      historias,
      ubicacionesAprobadas,
      ubicacionesRechazadas,
      usuarios,
      favoritos,
      eventos,
      episodiosPodcast,
      episodiosDoc,
    ] = await Promise.all([
      prisma.ubicacion.count({
        where: { deletedAt: null, moderacion: ModeracionEstado.PENDIENTE },
      }),
      prisma.comentario.count({
        where: { deletedAt: null, moderacion: ModeracionEstado.PENDIENTE },
      }),
      prisma.comentario.count({ where: { deletedAt: null } }),
      prisma.contactoMensaje.count({ where: { leido: false } }),
      prisma.deporte.count({ where: { deletedAt: null } }),
      prisma.historia.count({ where: { deletedAt: null } }),
      prisma.ubicacion.count({
        where: { deletedAt: null, moderacion: ModeracionEstado.APROBADO },
      }),
      prisma.ubicacion.count({
        where: { deletedAt: null, moderacion: ModeracionEstado.RECHAZADO },
      }),
      prisma.usuario.count({ where: { deletedAt: null } }),
      prisma.favorito.count(),
      prisma.evento.count({ where: { deletedAt: null } }),
      prisma.podcastEpisodio.count({ where: { deletedAt: null } }),
      prisma.documentalEpisodio.count({ where: { deletedAt: null } }),
    ]);

    return {
      pendientes,
      comentariosPendientes,
      comentarios,
      mensajesNoLeidos,
      deportes,
      historias,
      ubicacionesAprobadas,
      ubicacionesRechazadas,
      usuarios,
      favoritos,
      eventos,
      episodiosPodcast,
      episodiosDoc,
    };
  },

  async listarUbicaciones(estado?: ModeracionEstado) {
    const rows = await prisma.ubicacion.findMany({
      where: {
        deletedAt: null,
        ...(estado ? { moderacion: estado } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 80,
      include: {
        deporte: { select: { nombre: true, slug: true } },
        ciudad: { select: { nombre: true } },
        creadoPor: { select: { nombre: true, email: true } },
      },
    });
    return rows.map(mapUbicacion);
  },

  async listarUbicacionesPendientes() {
    return this.listarUbicaciones(ModeracionEstado.PENDIENTE);
  },

  async moderarUbicacion(ubicacionId: string, input: unknown, staffId: string) {
    const parsed = moderarSchema.safeParse(input);
    if (!parsed.success) {
      throw new AdminValidationError(parsed.error.flatten().fieldErrors);
    }

    const estado =
      parsed.data.accion === "aprobar"
        ? ModeracionEstado.APROBADO
        : ModeracionEstado.RECHAZADO;

    const existente = await prisma.ubicacion.findFirst({
      where: { id: ubicacionId, deletedAt: null },
      select: { id: true },
    });
    if (!existente) {
      throw new AdminValidationError({ accion: ["Ubicación no encontrada."] });
    }

    const updated = await prisma.ubicacion.update({
      where: { id: ubicacionId },
      data: { moderacion: estado },
      select: { id: true, nombre: true, moderacion: true },
    });

    await audit(staffId, "ACTUALIZAR", "ubicacion", ubicacionId, {
      moderacion: estado,
    });

    return updated;
  },

  async listarComentarios(estado?: ModeracionEstado) {
    const rows = await prisma.comentario.findMany({
      where: {
        deletedAt: null,
        ...(estado ? { moderacion: estado } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 80,
      select: {
        id: true,
        texto: true,
        moderacion: true,
        createdAt: true,
        ubicacionId: true,
        ubicacion: {
          select: {
            nombre: true,
            deporte: { select: { nombre: true } },
            deporteOtroNombre: true,
          },
        },
        usuario: { select: { nombre: true, email: true } },
      },
    });

    return rows.map((c) => ({
      id: c.id,
      texto: c.texto,
      moderacion: c.moderacion,
      createdAt: c.createdAt.toISOString(),
      ubicacionId: c.ubicacionId,
      ubicacionNombre: c.ubicacion.nombre,
      deporteNombre:
        c.ubicacion.deporteOtroNombre?.trim() || c.ubicacion.deporte.nombre,
      autorNombre: c.usuario.nombre,
      autorEmail: c.usuario.email,
    }));
  },

  async moderarComentario(comentarioId: string, input: unknown, staffId: string) {
    const parsed = moderarSchema.safeParse(input);
    if (!parsed.success) {
      throw new AdminValidationError(parsed.error.flatten().fieldErrors);
    }

    const estado =
      parsed.data.accion === "aprobar"
        ? ModeracionEstado.APROBADO
        : ModeracionEstado.RECHAZADO;

    const existente = await prisma.comentario.findFirst({
      where: { id: comentarioId, deletedAt: null },
      select: { id: true },
    });
    if (!existente) {
      throw new AdminValidationError({ accion: ["Comentario no encontrado."] });
    }

    const updated = await prisma.comentario.update({
      where: { id: comentarioId },
      data: { moderacion: estado },
      select: { id: true, moderacion: true },
    });

    await audit(staffId, "ACTUALIZAR", "comentario", comentarioId, {
      moderacion: estado,
    });

    return updated;
  },

  async listarMensajesContacto() {
    const rows = await prisma.contactoMensaje.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        nombre: true,
        email: true,
        interes: true,
        mensaje: true,
        leido: true,
        createdAt: true,
      },
    });

    return rows.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    }));
  },

  async actualizarMensaje(mensajeId: string, input: unknown, staffId: string) {
    const parsed = mensajeSchema.safeParse(input);
    if (!parsed.success) {
      throw new AdminValidationError(parsed.error.flatten().fieldErrors);
    }

    const existente = await prisma.contactoMensaje.findUnique({
      where: { id: mensajeId },
      select: { id: true },
    });
    if (!existente) {
      throw new AdminValidationError({ leido: ["Mensaje no encontrado."] });
    }

    const updated = await prisma.contactoMensaje.update({
      where: { id: mensajeId },
      data: { leido: parsed.data.leido },
      select: { id: true, leido: true },
    });

    await audit(staffId, "ACTUALIZAR", "contacto_mensaje", mensajeId, {
      leido: parsed.data.leido,
    });

    return updated;
  },

  async listarUsuarios() {
    const rows = await prisma.usuario.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 80,
      select: {
        id: true,
        nombre: true,
        email: true,
        createdAt: true,
        rol: { select: { nombre: true } },
        _count: {
          select: { comentarios: true, ubicaciones: true, favoritos: true },
        },
      },
    });

    return rows.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol.nombre,
      createdAt: u.createdAt.toISOString(),
      comentarios: u._count.comentarios,
      aportes: u._count.ubicaciones,
      favoritos: u._count.favoritos,
    }));
  },

  async listarContenido() {
    const [deportes, historias, podcasts, docs, eventos] = await Promise.all([
      prisma.deporte.findMany({
        where: { deletedAt: null },
        orderBy: { nombre: "asc" },
        select: {
          id: true,
          slug: true,
          nombre: true,
          destacado: true,
          publishedAt: true,
        },
      }),
      prisma.historia.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          slug: true,
          titulo: true,
          destacada: true,
          publishedAt: true,
        },
      }),
      prisma.podcastEpisodio.findMany({
        where: { deletedAt: null },
        orderBy: { numero: "asc" },
        take: 20,
        select: {
          id: true,
          slug: true,
          titulo: true,
          numero: true,
          publishedAt: true,
        },
      }),
      prisma.documentalEpisodio.findMany({
        where: { deletedAt: null },
        orderBy: { numero: "asc" },
        take: 20,
        select: {
          id: true,
          slug: true,
          titulo: true,
          numero: true,
          publishedAt: true,
        },
      }),
      prisma.evento.findMany({
        where: { deletedAt: null },
        orderBy: { fechaInicio: "desc" },
        take: 10,
        select: {
          id: true,
          slug: true,
          titulo: true,
          fechaInicio: true,
          publishedAt: true,
        },
      }),
    ]);

    return [
      ...deportes.map((d) => ({
        tipo: "deporte" as const,
        id: d.id,
        titulo: d.nombre,
        href: `/deportes/${d.slug}`,
        meta: d.destacado ? "Destacado" : "Catálogo",
        publishedAt: d.publishedAt?.toISOString() ?? null,
      })),
      ...historias.map((h) => ({
        tipo: "historia" as const,
        id: h.id,
        titulo: h.titulo,
        href: `/historias/${h.slug}`,
        meta: h.destacada ? "Destacada" : "Historia",
        publishedAt: h.publishedAt?.toISOString() ?? null,
      })),
      ...podcasts.map((p) => ({
        tipo: "podcast" as const,
        id: p.id,
        titulo: p.titulo,
        href: `/podcasts/${p.slug}`,
        meta: `Ep. ${p.numero}`,
        publishedAt: p.publishedAt?.toISOString() ?? null,
      })),
      ...docs.map((d) => ({
        tipo: "documental" as const,
        id: d.id,
        titulo: d.titulo,
        href: `/documentales/${d.slug}`,
        meta: `Ep. ${d.numero}`,
        publishedAt: d.publishedAt?.toISOString() ?? null,
      })),
      ...eventos.map((e) => ({
        tipo: "evento" as const,
        id: e.id,
        titulo: e.titulo,
        href: "/comunidad",
        meta: e.fechaInicio.toLocaleDateString("es-AR"),
        publishedAt: e.publishedAt?.toISOString() ?? null,
      })),
    ];
  },

  async listarAuditoria() {
    const rows = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        accion: true,
        entidad: true,
        entidadId: true,
        createdAt: true,
        usuario: { select: { nombre: true, email: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      accion: r.accion,
      entidad: r.entidad,
      entidadId: r.entidadId,
      usuarioNombre: r.usuario?.nombre ?? null,
      usuarioEmail: r.usuario?.email ?? null,
      createdAt: r.createdAt.toISOString(),
    }));
  },
};
