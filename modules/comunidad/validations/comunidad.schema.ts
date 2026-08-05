import { z } from "zod";
import { MAP_CIUDADES, MAP_REGION, OTROS_SPORT_SLUG } from "@/config/map-region";
import { distanciaKm } from "@/lib/geo";

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

const ciudadSlugs = MAP_CIUDADES.map((c) => c.slug) as [
  (typeof MAP_CIUDADES)[number]["slug"],
  ...(typeof MAP_CIUDADES)[number]["slug"][],
];

export const proponerUbicacionSchema = z
  .object({
    nombre: z.string().trim().min(2).max(100),
    direccion: z.string().trim().min(4).max(200),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    horarios: z.string().trim().min(2).max(120),
    contacto: z.string().trim().max(120).optional().or(z.literal("")),
    historia: z.string().trim().max(1000).optional().or(z.literal("")),
    ciudadSlug: z.enum(ciudadSlugs),
    deporteSlug: z.enum([
      "ultimate-frisbee",
      "newcom",
      "wingfoil",
      OTROS_SPORT_SLUG,
    ]),
    deporteOtroNombre: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (distanciaKm(MAP_REGION.center, { lat: data.lat, lng: data.lng }) > MAP_REGION.radiusKm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El punto debe estar a menos de ${MAP_REGION.radiusKm} km de Santa Fe.`,
        path: ["lat"],
      });
    }
    if (data.deporteSlug === OTROS_SPORT_SLUG) {
      const nombre = (data.deporteOtroNombre ?? "").trim();
      if (nombre.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indicá el nombre del deporte.",
          path: ["deporteOtroNombre"],
        });
      }
    }
  });

export type ProponerUbicacionInput = z.infer<typeof proponerUbicacionSchema>;

export const comentarioSchema = z.object({
  ubicacionId: z.string().min(1),
  texto: z.string().trim().min(3).max(500),
});

export type ComentarioInput = z.infer<typeof comentarioSchema>;
