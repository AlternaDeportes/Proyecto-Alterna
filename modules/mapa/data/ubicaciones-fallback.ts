import type { MapUbicacion } from "@/modules/mapa/types";
import { designTokens } from "@/config/design-tokens";
import { MAP_CIUDADES, OTROS_SPORT_COLOR, OTROS_SPORT_SLUG } from "@/config/map-region";
import { UBICACIONES_CATALOGO } from "@/modules/mapa/data/ubicaciones-catalogo";

const DEPORTE_META: Record<string, { nombre: string; colorPrimario: string }> = {
  "ultimate-frisbee": {
    nombre: "Ultimate Frisbee",
    colorPrimario: designTokens.sports.ultimate,
  },
  newcom: {
    nombre: "Newcom",
    colorPrimario: designTokens.sports.newcom,
  },
  wingfoil: {
    nombre: "Wingfoil",
    colorPrimario: designTokens.sports.wingfoil,
  },
  [OTROS_SPORT_SLUG]: {
    nombre: "Otros deportes",
    colorPrimario: OTROS_SPORT_COLOR,
  },
};

const ciudadPorSlug = Object.fromEntries(MAP_CIUDADES.map((c) => [c.slug, c]));

export const UBICACIONES_FALLBACK: MapUbicacion[] = UBICACIONES_CATALOGO.map((u) => {
  const deporte = DEPORTE_META[u.deporteSlug] ?? DEPORTE_META[OTROS_SPORT_SLUG];
  const ciudad = ciudadPorSlug[u.ciudadSlug] ?? ciudadPorSlug["santa-fe"];
  return {
    id: `fb-${u.slugKey}`,
    nombre: u.nombre,
    direccion: u.direccion,
    lat: u.lat,
    lng: u.lng,
    horarios: u.horarios,
    contacto: u.contacto,
    historia: u.historia,
    deporteOtroNombre: u.deporteOtroNombre,
    deporte: {
      nombre: deporte.nombre,
      slug: u.deporteSlug,
      colorPrimario: deporte.colorPrimario,
    },
    ciudad: { nombre: ciudad.nombre, slug: ciudad.slug },
    comentariosCount: 0,
  };
});
