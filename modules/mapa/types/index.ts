export interface MapDeporteRef {
  nombre: string;
  slug: string;
  colorPrimario: string;
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
  deporte: MapDeporteRef;
  comentariosCount: number;
}

export type FiltroDeporteSlug = "todos" | "ultimate-frisbee" | "newcom" | "wingfoil";

export const FILTROS_DEPORTE: { slug: FiltroDeporteSlug; label: string; color?: string }[] = [
  { slug: "todos", label: "Todos" },
  { slug: "ultimate-frisbee", label: "Ultimate", color: "#2d6a4f" },
  { slug: "newcom", label: "Newcom", color: "#e07a2f" },
  { slug: "wingfoil", label: "Wingfoil", color: "#1d7596" },
];

export interface LatLng {
  lat: number;
  lng: number;
}

export const SANTA_FE_CENTER: LatLng = { lat: -31.6333, lng: -60.7 };
