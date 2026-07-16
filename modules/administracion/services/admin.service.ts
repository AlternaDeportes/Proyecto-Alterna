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

export const adminService = {
  async obtenerResumen() {
    const [
      pendientes,
      mensajesNoLeidos,
      deportes,
      historias,
      ubicacionesAprobadas,
      usuarios,
      episodiosPodcast,
      episodiosDoc,
    ] = await Promise.all([
      prisma.ubicacion.count({
        where: { deletedAt: null, moderacion: ModeracionEstado.PENDIENTE },
      }),
      prisma.contactoMensaje.count({ where: { leido: false } }),
      prisma.deporte.count({ where: { deletedAt: null } }),
      prisma.historia.count({ where: { deletedAt: null } }),
      prisma.ubicacion.count({
        where: { deletedAt: null, moderacion: ModeracionEstado.APROBADO },
      }),
      prisma.usuario.count({ where: { deletedAt: null } }),
      prisma.podcastEpisodio.count({ where: { deletedAt: null } }),
      prisma.documentalEpisodio.count({ where: { deletedAt: null } }),
    ]);

    return {
      pendientes,
      mensajesNoLeidos,
      deportes,
      historias,
      ubicacionesAprobadas,
      usuarios,
      episodiosPodcast,
      episodiosDoc,
    };
  },

  async listarUbicacionesPendientes() {
    const rows = await prisma.ubicacion.findMany({
      where: { deletedAt: null, moderacion: ModeracionEstado.PENDIENTE },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        deporte: { select: { nombre: true, slug: true } },
        ciudad: { select: { nombre: true } },
        creadoPor: { select: { nombre: true, email: true } },
      },
    });

    return rows.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      direccion: u.direccion,
      lat: u.lat,
      lng: u.lng,
      horarios: u.horarios,
      contacto: u.contacto,
      historia: u.historia,
      moderacion: u.moderacion,
      deporteNombre: u.deporte.nombre,
      deporteSlug: u.deporte.slug,
      ciudadNombre: u.ciudad.nombre,
      creadorNombre: u.creadoPor?.nombre ?? null,
      creadorEmail: u.creadoPor?.email ?? null,
      createdAt: u.createdAt.toISOString(),
    }));
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
};
