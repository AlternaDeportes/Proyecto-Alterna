import { Dificultad, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class EditorialError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
    this.name = "EditorialError";
  }
}

export type CampoEditor = {
  key: string;
  label: string;
  value: string;
  kind: "text" | "textarea" | "number" | "checkbox" | "select";
  options?: { value: string; label: string }[];
};

const TIPOS = [
  "deporte",
  "historia",
  "ubicacion",
  "evento",
  "podcast",
  "podcastShow",
  "documental",
  "documentalShow",
] as const;
export type TipoEditable = (typeof TIPOS)[number];

const DIFICULTAD_OPCIONES = [
  { value: "PRINCIPIANTE", label: "Principiante" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "AVANZADO", label: "Avanzado" },
];

function campo(
  key: string,
  label: string,
  value: string | number | boolean | null | undefined,
  kind: CampoEditor["kind"],
  options?: CampoEditor["options"]
): CampoEditor {
  return {
    key,
    label,
    value: value == null ? "" : String(value),
    kind,
    options,
  };
}

function texto(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  return raw.length ? raw : null;
}

function entero(value: unknown) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new EditorialError("Usá un número entero.");
  }
  return n;
}

function decimal(value: unknown, label: string) {
  if (value == null || String(value).trim() === "") {
    throw new EditorialError(`${label} es obligatoria.`);
  }
  const n = Number(value);
  if (!Number.isFinite(n)) throw new EditorialError(`${label} no es válida.`);
  return n;
}

function publicado(value: unknown, actual: Date | null) {
  const on = value === true || value === "true";
  if (on) return actual ?? new Date();
  return null;
}

function esTipo(value: string): value is TipoEditable {
  return (TIPOS as readonly string[]).includes(value);
}

export const editorialService = {
  async obtener(tipoRaw: string, id: string) {
    if (!esTipo(tipoRaw) || !id) {
      throw new EditorialError("No encontramos esa ficha.");
    }

    if (tipoRaw === "deporte") {
      const row = await prisma.deporte.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.nombre,
        campos: [
          campo("descripcion", "Descripción", row.descripcion, "textarea"),
          campo("historia", "Por qué se quedan", row.historia, "textarea"),
          campo("dificultad", "Dificultad", row.dificultad, "select", DIFICULTAD_OPCIONES),
          campo("jugadoresMin", "Jugadores mín.", row.jugadoresMin, "number"),
          campo("jugadoresMax", "Jugadores máx.", row.jugadoresMax, "number"),
          campo("equipamiento", "Equipamiento", row.equipamiento, "textarea"),
          campo("seoTitle", "Título para Google", row.seoTitle, "text"),
          campo("seoDescription", "Descripción para Google", row.seoDescription, "textarea"),
          campo("destacado", "Destacado en la home", row.destacado, "checkbox"),
        ],
      };
    }

    if (tipoRaw === "historia") {
      const row = await prisma.historia.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.titulo,
        campos: [
          campo("titulo", "Título", row.titulo, "text"),
          campo("cuerpo", "Texto", row.cuerpo, "textarea"),
          campo("pullQuote", "Frase", row.pullQuote, "textarea"),
          campo("destacada", "Destacada", row.destacada, "checkbox"),
          campo("publicado", "Publicada", Boolean(row.publishedAt), "checkbox"),
          campo("seoTitle", "Título para Google", row.seoTitle, "text"),
          campo("seoDescription", "Descripción para Google", row.seoDescription, "textarea"),
        ],
      };
    }

    if (tipoRaw === "ubicacion") {
      const row = await prisma.ubicacion.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.nombre,
        campos: [
          campo("nombre", "Nombre", row.nombre, "text"),
          campo("direccion", "Dirección", row.direccion, "text"),
          campo("horarios", "Horarios", row.horarios, "text"),
          campo("contacto", "Contacto", row.contacto, "text"),
          campo("historia", "Nota", row.historia, "textarea"),
          campo("lat", "Latitud", row.lat, "number"),
          campo("lng", "Longitud", row.lng, "number"),
        ],
      };
    }

    if (tipoRaw === "evento") {
      const row = await prisma.evento.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.titulo,
        campos: [
          campo("titulo", "Título", row.titulo, "text"),
          campo("descripcion", "Descripción", row.descripcion, "textarea"),
          campo("lugar", "Lugar", row.lugar, "text"),
          campo("publicado", "Publicado", Boolean(row.publishedAt), "checkbox"),
        ],
      };
    }

    if (tipoRaw === "podcastShow") {
      const row = await prisma.podcast.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.titulo,
        campos: [
          campo("titulo", "Título", row.titulo, "text"),
          campo("descripcion", "Descripción", row.descripcion, "textarea"),
          campo("publicado", "Publicado", Boolean(row.publishedAt), "checkbox"),
        ],
      };
    }

    if (tipoRaw === "podcast") {
      const row = await prisma.podcastEpisodio.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.titulo,
        campos: [
          campo("titulo", "Título", row.titulo, "text"),
          campo("descripcion", "Descripción", row.descripcion, "textarea"),
          campo("publicado", "Publicado", Boolean(row.publishedAt), "checkbox"),
        ],
      };
    }

    if (tipoRaw === "documentalShow") {
      const row = await prisma.documental.findFirst({ where: { id, deletedAt: null } });
      if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
      return {
        tipo: tipoRaw,
        id: row.id,
        titulo: row.titulo,
        campos: [
          campo("titulo", "Título", row.titulo, "text"),
          campo("sinopsis", "Sinopsis", row.sinopsis, "textarea"),
          campo("publicado", "Publicado", Boolean(row.publishedAt), "checkbox"),
        ],
      };
    }

    const row = await prisma.documentalEpisodio.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw new EditorialError("No encontramos esa ficha.", 404);
    return {
      tipo: tipoRaw,
      id: row.id,
      titulo: row.titulo,
      campos: [
        campo("titulo", "Título", row.titulo, "text"),
        campo("sinopsis", "Sinopsis", row.sinopsis, "textarea"),
        campo("publicado", "Publicado", Boolean(row.publishedAt), "checkbox"),
      ],
    };
  },

  async guardar(tipoRaw: string, id: string, values: Record<string, unknown>, usuarioId: string) {
    const actual = await this.obtener(tipoRaw, id);
    const data = values ?? {};

    if (tipoRaw === "deporte") {
      const descripcion = texto(data.descripcion);
      if (!descripcion) throw new EditorialError("La descripción no puede quedar vacía.");
      const dificultad = String(data.dificultad ?? "");
      if (!Object.values(Dificultad).includes(dificultad as Dificultad)) {
        throw new EditorialError("Elegí una dificultad.");
      }
      await prisma.deporte.update({
        where: { id },
        data: {
          descripcion,
          historia: texto(data.historia),
          dificultad: dificultad as Dificultad,
          jugadoresMin: entero(data.jugadoresMin),
          jugadoresMax: entero(data.jugadoresMax),
          equipamiento: texto(data.equipamiento),
          seoTitle: texto(data.seoTitle),
          seoDescription: texto(data.seoDescription),
          destacado: data.destacado === true || data.destacado === "true",
        },
      });
    } else if (tipoRaw === "historia") {
      const titulo = texto(data.titulo);
      const cuerpo = texto(data.cuerpo);
      if (!titulo || !cuerpo) throw new EditorialError("El título y el texto son obligatorios.");
      const row = await prisma.historia.findUnique({ where: { id } });
      await prisma.historia.update({
        where: { id },
        data: {
          titulo,
          cuerpo,
          pullQuote: texto(data.pullQuote),
          destacada: data.destacada === true || data.destacada === "true",
          seoTitle: texto(data.seoTitle),
          seoDescription: texto(data.seoDescription),
          publishedAt: publicado(data.publicado, row?.publishedAt ?? null),
        },
      });
    } else if (tipoRaw === "ubicacion") {
      const nombre = texto(data.nombre);
      const direccion = texto(data.direccion);
      const horarios = texto(data.horarios);
      if (!nombre || !direccion || !horarios) {
        throw new EditorialError("Nombre, dirección y horarios son obligatorios.");
      }
      await prisma.ubicacion.update({
        where: { id },
        data: {
          nombre,
          direccion,
          horarios,
          contacto: texto(data.contacto),
          historia: texto(data.historia),
          lat: decimal(data.lat, "Latitud"),
          lng: decimal(data.lng, "Longitud"),
        },
      });
    } else if (tipoRaw === "evento") {
      const titulo = texto(data.titulo);
      const descripcion = texto(data.descripcion);
      if (!titulo || !descripcion) throw new EditorialError("El título y la descripción son obligatorios.");
      const row = await prisma.evento.findUnique({ where: { id } });
      await prisma.evento.update({
        where: { id },
        data: {
          titulo,
          descripcion,
          lugar: texto(data.lugar),
          publishedAt: publicado(data.publicado, row?.publishedAt ?? null),
        },
      });
    } else if (tipoRaw === "podcastShow") {
      const titulo = texto(data.titulo);
      const descripcion = texto(data.descripcion);
      if (!titulo || !descripcion) {
        throw new EditorialError("El título y la descripción son obligatorios.");
      }
      const row = await prisma.podcast.findUnique({ where: { id } });
      await prisma.podcast.update({
        where: { id },
        data: {
          titulo,
          descripcion,
          publishedAt: publicado(data.publicado, row?.publishedAt ?? null),
        },
      });
    } else if (tipoRaw === "podcast") {
      const titulo = texto(data.titulo);
      if (!titulo) throw new EditorialError("El título no puede quedar vacío.");
      const row = await prisma.podcastEpisodio.findUnique({ where: { id } });
      await prisma.podcastEpisodio.update({
        where: { id },
        data: {
          titulo,
          descripcion: texto(data.descripcion),
          publishedAt: publicado(data.publicado, row?.publishedAt ?? null),
        },
      });
    } else if (tipoRaw === "documentalShow") {
      const titulo = texto(data.titulo);
      const sinopsis = texto(data.sinopsis);
      if (!titulo || !sinopsis) {
        throw new EditorialError("El título y la sinopsis son obligatorios.");
      }
      const row = await prisma.documental.findUnique({ where: { id } });
      await prisma.documental.update({
        where: { id },
        data: {
          titulo,
          sinopsis,
          publishedAt: publicado(data.publicado, row?.publishedAt ?? null),
        },
      });
    } else {
      const titulo = texto(data.titulo);
      if (!titulo) throw new EditorialError("El título no puede quedar vacío.");
      const row = await prisma.documentalEpisodio.findUnique({ where: { id } });
      await prisma.documentalEpisodio.update({
        where: { id },
        data: {
          titulo,
          sinopsis: texto(data.sinopsis),
          publishedAt: publicado(data.publicado, row?.publishedAt ?? null),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        accion: "ACTUALIZAR",
        entidad: tipoRaw,
        entidadId: id,
        usuarioId,
        payload: { titulo: actual.titulo } satisfies Prisma.InputJsonValue,
      },
    });

    return this.obtener(tipoRaw, id);
  },

  async listarLugares() {
    const rows = await prisma.ubicacion.findMany({
      where: { deletedAt: null },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, direccion: true, horarios: true },
    });
    return rows.map((row) => ({
      tipo: "ubicacion" as const,
      id: row.id,
      titulo: row.nombre,
      href: "/mapa",
      meta: row.horarios || row.direccion,
      publishedAt: null,
    }));
  },
};
