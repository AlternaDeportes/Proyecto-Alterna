import { designTokens } from "@/config/design-tokens";
import {
  FEATURED_SPORT_LABELS,
  FEATURED_SPORT_SLUGS,
  MAP_REGION,
  OTROS_SPORT_COLOR,
  OTROS_SPORT_SLUG,
  type FeaturedSportSlug,
} from "@/config/map-region";

export interface MapDeporteRef {
  nombre: string;
  slug: string;
  colorPrimario: string;
}

export interface MapCiudadRef {
  nombre: string;
  slug: string;
}

export interface MapUbicacion {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  horarios: string;
  contacto: string | null;
  historia: string | null;
  /** Nombre libre si el deporte no es uno de los tres foco. */
  deporteOtroNombre: string | null;
  deporte: MapDeporteRef;
  ciudad: MapCiudadRef;
  comentariosCount: number;
}

export type MapaModo = "cerca" | "explorar";

export type FiltroDeporteSlug =
  | "todos"
  | FeaturedSportSlug
  | typeof OTROS_SPORT_SLUG;

export const FILTROS_DEPORTE: {
  slug: FiltroDeporteSlug;
  label: string;
  color?: string;
}[] = [
  { slug: "todos", label: "Todos" },
  {
    slug: "ultimate-frisbee",
    label: FEATURED_SPORT_LABELS["ultimate-frisbee"],
    color: designTokens.sports.ultimate,
  },
  {
    slug: "newcom",
    label: FEATURED_SPORT_LABELS.newcom,
    color: designTokens.sports.newcom,
  },
  {
    slug: "wingfoil",
    label: FEATURED_SPORT_LABELS.wingfoil,
    color: designTokens.sports.wingfoil,
  },
  {
    slug: OTROS_SPORT_SLUG,
    label: "Otros (mapa)",
    color: OTROS_SPORT_COLOR,
  },
];

export interface LatLng {
  lat: number;
  lng: number;
}

/** @deprecated Preferí MAP_REGION.center */
export const SANTA_FE_CENTER: LatLng = MAP_REGION.center;

export function etiquetaDeporte(u: MapUbicacion): string {
  if (u.deporteOtroNombre?.trim()) return u.deporteOtroNombre.trim();
  return u.deporte.nombre;
}

export function ubicacionMatchFiltro(
  u: MapUbicacion,
  filtro: FiltroDeporteSlug
): boolean {
  if (filtro === "todos") return true;
  if (filtro === OTROS_SPORT_SLUG) {
    return !(FEATURED_SPORT_SLUGS as readonly string[]).includes(u.deporte.slug);
  }
  return u.deporte.slug === filtro;
}
