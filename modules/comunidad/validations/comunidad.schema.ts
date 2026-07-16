import { z } from "zod";

export const MOTIVOS_SUMARSE = [
  "Quiero practicar un deporte",
  "Quiero sumar un punto al mapa",
  "Quiero colaborar con ALTERNA",
  "Soy parte de una comunidad deportiva",
  "Otro",
] as const;

export const sumarseSchema = z.object({
  nombre: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  motivo: z.enum(MOTIVOS_SUMARSE, {
    errorMap: () => ({ message: "Elegí un motivo." }),
  }),
  mensaje: z.string().trim().min(10).max(2000),
  deporteSlug: z
    .enum(["ultimate-frisbee", "newcom", "wingfoil", ""])
    .optional()
    .default(""),
  website: z.string().optional().default(""),
});

export type SumarseInput = z.infer<typeof sumarseSchema>;

export const proponerUbicacionSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  direccion: z.string().trim().min(4).max(200),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  horarios: z.string().trim().min(2).max(120),
  contacto: z.string().trim().max(120).optional().or(z.literal("")),
  historia: z.string().trim().max(1000).optional().or(z.literal("")),
  deporteSlug: z.enum(["ultimate-frisbee", "newcom", "wingfoil"]),
});

export type ProponerUbicacionInput = z.infer<typeof proponerUbicacionSchema>;

export const comentarioSchema = z.object({
  ubicacionId: z.string().min(1),
  texto: z.string().trim().min(3).max(500),
});

export type ComentarioInput = z.infer<typeof comentarioSchema>;
