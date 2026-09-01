import type { Dificultad } from "@prisma/client";
import type { DeporteDetalle, DeporteListItem } from "@/modules/deportes/types";
import { designTokens } from "@/config/design-tokens";
import { sportCover } from "@/config/media";

/** Datos estáticos cuando DATABASE_URL no está configurada */
export const DEPORTES_FALLBACK: DeporteDetalle[] = [
  {
    id: "fallback-ultimate",
    slug: "ultimate-frisbee",
    nombre: "Ultimate Frisbee",
    descripcion:
      "7 vs 7 con disco, en césped y sin árbitro. Anotás agarrando en la zona de gol.",
    historia:
      "En Santa Fe, los grupos de Ultimate crecen por recomendación entre amigos, plazas y parques.",
    dificultad: "INTERMEDIO" as Dificultad,
    jugadoresMin: 7,
    jugadoresMax: 14,
    equipamiento: "Disco, cancha amplia, calzado deportivo",
    colorPrimario: designTokens.sports.ultimate,
    destacado: true,
    ubicacionesCount: 2,
    historiasCount: 2,
    coverUrl: sportCover("ultimate-frisbee"),
    seoTitle: "Ultimate Frisbee en Santa Fe | ALTERNA",
    seoDescription: "Comunidad, entrenamiento y espíritu deportivo sin árbitros.",
    historias: [
      {
        id: "h1",
        slug: "luchi-farias",
        titulo: "Lucila «Luchi» Farías",
        pullQuote: "El Ultimate me enseñó que el equipo es más grande que el resultado.",
      },
      {
        id: "h2",
        slug: "ciclo-dussex",
        titulo: "Adriel «Ciclo» Dussex",
        pullQuote: "Entrenar es armar un espacio donde cualquiera puede sumarse.",
      },
    ],
    ubicaciones: [
      {
        id: "u1",
        nombre: "Parque Federal",
        direccion: "Salvador del Carril 2200",
        horarios: "Lun y jue 20:00",
      },
      {
        id: "u2",
        nombre: "Parque Garay",
        direccion: "Av. Perón 3600",
        horarios: "Mié 19:00",
      },
    ],
  },
  {
    id: "fallback-newcom",
    slug: "newcom",
    nombre: "Newcom",
    descripcion:
      "Como el vóley, pero la pelota se agarra y se lanza. Red más baja; se juega en clubes.",
    historia: "Muy arraigado en clubes santafesinos con participación intergeneracional.",
    dificultad: "PRINCIPIANTE" as Dificultad,
    jugadoresMin: 6,
    jugadoresMax: 12,
    equipamiento: "Red baja, pelota, espacio cubierto",
    colorPrimario: designTokens.sports.newcom,
    destacado: true,
    ubicacionesCount: 2,
    historiasCount: 1,
    coverUrl: sportCover("newcom"),
    seoTitle: "Newcom en Santa Fe | ALTERNA",
    seoDescription: "Vóley adaptado con fuerte espíritu comunitario.",
    historias: [
      {
        id: "h3",
        slug: "monica-lovecchio",
        titulo: "Mónica Lovecchio",
        pullQuote: "En Newcom encontré una familia que no sabía que necesitaba.",
      },
    ],
    ubicaciones: [
      {
        id: "u3",
        nombre: "Club Regatas Santa Fe",
        direccion: "Av. Alem 3288",
        horarios: "Mar y vie 18:30",
      },
      {
        id: "u4",
        nombre: "C.I.C. Facundo Zuviría",
        direccion: "Facundo Zuviría 8000",
        horarios: "Lun, mié y vie 17:00",
      },
    ],
  },
  {
    id: "fallback-wingfoil",
    slug: "wingfoil",
    nombre: "Wingfoil",
    descripcion:
      "Tabla, foil y un ala inflable. El viento te lleva sobre el río o la laguna.",
    historia: "Práctica en crecimiento sobre el Paraná y lagunas de la región.",
    dificultad: "AVANZADO" as Dificultad,
    jugadoresMin: 1,
    jugadoresMax: 1,
    equipamiento: "Tabla, ala, arnés, traje según temporada",
    colorPrimario: designTokens.sports.wingfoil,
    destacado: true,
    ubicacionesCount: 1,
    historiasCount: 1,
    coverUrl: sportCover("wingfoil"),
    seoTitle: "Wingfoil en Santa Fe | ALTERNA",
    seoDescription: "Libertad, viento y aprendizaje sobre el agua.",
    historias: [
      {
        id: "h4",
        slug: "lucio-cinaglia",
        titulo: "Lucio Cinaglia",
        pullQuote: "El río no es un escenario: es parte del juego.",
      },
    ],
    ubicaciones: [
      {
        id: "u5",
        nombre: "Laguna Setúbal",
        direccion: "Costanera Este",
        horarios: "Sáb y dom 10:00",
      },
    ],
  },
];

export function listarDeportesFallback(): DeporteListItem[] {
  return DEPORTES_FALLBACK.map(
    ({ historias, ubicaciones, historia, equipamiento, jugadoresMin, jugadoresMax, dificultad, seoTitle, seoDescription, ...rest }) =>
      rest
  );
}

export function obtenerDeporteFallback(slug: string): DeporteDetalle | null {
  return DEPORTES_FALLBACK.find((d) => d.slug === slug) ?? null;
}
