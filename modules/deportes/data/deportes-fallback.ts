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
        id: "u-querandi",
        nombre: "Querandi RC",
        direccion: "Raúl Tacca 707",
        horarios: "Consultar horarios",
      },
      {
        id: "u-quilla",
        nombre: "Club Náutico El Quilla",
        direccion: "Av. de Circunvalación de Sta. Fe 4264",
        horarios: "Consultar horarios",
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
    ubicacionesCount: 7,
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
        id: "u-gallego",
        nombre: "Centro Gallego",
        direccion: "Av. Galicia 1357",
        horarios: "Consultar horarios",
      },
      {
        id: "u-revoltosos",
        nombre: "Revoltosos",
        direccion: "Club San Martín de Monte Vera, Monte Vera",
        horarios: "Consultar horarios",
      },
      {
        id: "u-colon",
        nombre: "C.A. Colón",
        direccion: "Av. J. J. Paso 3535",
        horarios: "Consultar horarios",
      },
      {
        id: "u-cust",
        nombre: "C.U.S.T",
        direccion: "San Martín 1850",
        horarios: "Consultar horarios",
      },
      {
        id: "u-villa-dora",
        nombre: "C.A. Villa Dora",
        direccion: "Ruperto Godoy 1231",
        horarios: "Consultar horarios",
      },
      {
        id: "u-regatas",
        nombre: "Regatas",
        direccion: "Av. Leandro N. Alem 3288",
        horarios: "Consultar horarios",
      },
      {
        id: "u-santoto",
        nombre: "Santoto Voley",
        direccion: "Obispo Gelabert 1731",
        horarios: "Consultar horarios",
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
        id: "u-yacht",
        nombre: "Yacht Club Santa Fe",
        direccion: "RN 168 80",
        horarios: "Consultar horarios",
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
