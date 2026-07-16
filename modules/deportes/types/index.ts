import type { Dificultad } from "@prisma/client";

/** Vista unificada de deporte (DB o fallback estático) */
export interface DeporteListItem {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  colorPrimario: string;
  destacado: boolean;
  ubicacionesCount: number;
  historiasCount: number;
}

export interface DeporteHistoriaItem {
  id: string;
  slug: string;
  titulo: string;
  pullQuote: string | null;
}

export interface DeporteUbicacionItem {
  id: string;
  nombre: string;
  direccion: string;
  horarios: string;
}

export interface DeporteDetalle extends DeporteListItem {
  historia: string | null;
  dificultad: Dificultad;
  jugadoresMin: number | null;
  jugadoresMax: number | null;
  equipamiento: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  historias: DeporteHistoriaItem[];
  ubicaciones: DeporteUbicacionItem[];
}

export const DIFICULTAD_LABEL: Record<Dificultad, string> = {
  PRINCIPIANTE: "Principiante",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
};
