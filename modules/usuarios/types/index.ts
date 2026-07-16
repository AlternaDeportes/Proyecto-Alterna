export const FAVORITO_ENTIDADES = ["deporte", "historia", "ubicacion"] as const;

export type FavoritoEntidad = (typeof FAVORITO_ENTIDADES)[number];

export interface FavoritoItem {
  id: string;
  entidad: FavoritoEntidad;
  entidadId: string;
  titulo: string;
  href: string;
  createdAt: string;
}

export interface PerfilUsuario {
  id: string;
  email: string;
  nombre: string;
  avatarUrl: string | null;
  rol: string;
  favoritos: FavoritoItem[];
  aportesMapa: {
    id: string;
    nombre: string;
    moderacion: string;
    deporteNombre: string;
    createdAt: string;
  }[];
}
