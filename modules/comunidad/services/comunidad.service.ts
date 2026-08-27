import { ModeracionEstado } from "@prisma/client";
import { isDatabaseConfigured } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { contactoService } from "@/modules/contacto/services/contacto.service";
import type {
  ComentarioInput,
  ProponerUbicacionInput,
  SumarseInput,
} from "@/modules/comunidad/validations/comunidad.schema";
import {
  comentarioSchema,
  proponerUbicacionSchema,
  sumarseSchema,
} from "@/modules/comunidad/validations/comunidad.schema";
import { OTROS_SPORT_SLUG } from "@/config/map-region";

export class ComunidadValidationError extends Error {
  constructor(public fieldErrors: Record<string, string[] | undefined>) {
    super("Datos inválidos");
    this.name = "ComunidadValidationError";
  }
}

export class ComunidadAuthError extends Error {
  constructor(message = "Necesitás iniciar sesión") {
    super(message);
    this.name = "ComunidadAuthError";
  }
}

export class ComunidadDbError extends Error {
  constructor(message = "Se requiere base de datos configurada") {
    super(message);
    this.name = "ComunidadDbError";
  }
}

function mapMotivoToInteres(motivo: SumarseInput["motivo"]): string {
  if (motivo.includes("Ultimate") || motivo.includes("practicar")) {
    return "Colaborar con ALTERNA";
  }
  if (motivo.includes("punto")) return "Colaborar con ALTERNA";
  if (motivo.includes("colaborar")) return "Colaborar con ALTERNA";
  return "Colaborar con ALTERNA";
}

export const comunidadService = {
  /** Intención de sumarse: reutiliza ContactoMensaje + email */
  async sumarse(input: unknown, usuarioId?: string) {
    const parsed = sumarseSchema.safeParse(input);
    if (!parsed.success) {
      throw new ComunidadValidationError(parsed.error.flatten().fieldErrors);
    }
    if (parsed.data.website) {
      return { ok: true as const, spam: true };
    }

    const deporteNota = parsed.data.deporteSlug
      ? `\nDeporte de interés: ${parsed.data.deporteSlug}`
      : "";

    const result = await contactoService.enviarMensaje(
      {
        nombre: parsed.data.nombre,
        email: parsed.data.email,
        interes: mapMotivoToInteres(parsed.data.motivo),
        mensaje: `[Comunidad — ${parsed.data.motivo}]${deporteNota}\n\n${parsed.data.mensaje}`,
        website: "",
      },
      { usuarioId }
    );

    return { ok: true as const, spam: false, ...result };
  },

  async proponerUbicacion(input: unknown, usuarioId: string) {
    if (!usuarioId) throw new ComunidadAuthError();
    if (!isDatabaseConfigured()) throw new ComunidadDbError();

    const parsed = proponerUbicacionSchema.safeParse(input);
    if (!parsed.success) {
      throw new ComunidadValidationError(parsed.error.flatten().fieldErrors);
    }

    const datos = parsed.data;
    const deporteSlug = datos.deporteSlug;
    const deporteOtroNombre =
      deporteSlug === OTROS_SPORT_SLUG
        ? (datos.deporteOtroNombre || "").trim()
        : null;

    const [deporte, ciudad, usuario] = await Promise.all([
      prisma.deporte.findFirst({
        where: { slug: deporteSlug, deletedAt: null },
        select: { id: true },
      }),
      prisma.ciudad.findFirst({
        where: { slug: datos.ciudadSlug, deletedAt: null },
        select: { id: true },
      }),
      prisma.usuario.findFirst({
        where: { id: usuarioId, deletedAt: null },
        select: { id: true },
      }),
    ]);

    if (!usuario) {
      throw new ComunidadAuthError(
        "Tu sesión no está vinculada a la base de datos. Volvé a ingresar con Google."
      );
    }
    if (!deporte || !ciudad) {
      throw new ComunidadDbError("Faltan deportes o ciudad en el seed.");
    }

    const ubicacion = await prisma.ubicacion.create({
      data: {
        nombre: datos.nombre,
        direccion: datos.direccion,
        lat: datos.lat,
        lng: datos.lng,
        horarios: datos.horarios,
        contacto: datos.contacto || null,
        historia: datos.historia || null,
        deporteOtroNombre,
        moderacion: ModeracionEstado.PENDIENTE,
        deporteId: deporte.id,
        ciudadId: ciudad.id,
        creadoPorId: usuario.id,
      },
      select: { id: true, nombre: true, moderacion: true },
    });

    return ubicacion;
  },

  async comentar(input: unknown, usuarioId: string) {
    if (!usuarioId) throw new ComunidadAuthError();
    if (!isDatabaseConfigured()) throw new ComunidadDbError();

    const parsed = comentarioSchema.safeParse(input);
    if (!parsed.success) {
      throw new ComunidadValidationError(parsed.error.flatten().fieldErrors);
    }

    const usuario = await prisma.usuario.findFirst({
      where: { id: usuarioId, deletedAt: null },
      select: { id: true },
    });
    if (!usuario) {
      throw new ComunidadAuthError(
        "Tu sesión no está vinculada a la base de datos. Volvé a ingresar con Google."
      );
    }

    const ubicacion = await prisma.ubicacion.findFirst({
      where: {
        id: parsed.data.ubicacionId,
        deletedAt: null,
        moderacion: ModeracionEstado.APROBADO,
      },
      select: { id: true },
    });
    if (!ubicacion) {
      throw new ComunidadValidationError({
        ubicacionId: ["Ubicación no encontrada."],
      });
    }

    const comentario = await prisma.comentario.create({
      data: {
        texto: parsed.data.texto,
        ubicacionId: ubicacion.id,
        usuarioId: usuario.id,
        moderacion: ModeracionEstado.PENDIENTE,
      },
      select: {
        id: true,
        texto: true,
        createdAt: true,
        moderacion: true,
        usuario: { select: { nombre: true } },
      },
    });

    return comentario;
  },

  async listarComentarios(ubicacionId: string) {
    if (!isDatabaseConfigured()) return [];

    try {
      return prisma.comentario.findMany({
        where: {
          ubicacionId,
          deletedAt: null,
          moderacion: ModeracionEstado.APROBADO,
        },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          texto: true,
          createdAt: true,
          usuario: { select: { nombre: true } },
        },
      });
    } catch {
      return [];
    }
  },
};
