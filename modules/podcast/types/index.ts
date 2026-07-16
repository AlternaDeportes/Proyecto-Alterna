export interface PodcastDeporteRef {
  nombre: string;
  slug: string;
  colorPrimario: string;
}

export interface PodcastCapitulo {
  titulo: string;
  inicioSeg?: number;
}

export interface PodcastEpisodioListItem {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string | null;
  numero: number;
  duracionSeg: number | null;
  audioUrl: string | null;
  publishedAt: string | null;
  /** true si aún no hay audio publicado */
  proximo: boolean;
  deportes: PodcastDeporteRef[];
}

export interface PodcastEpisodioDetalle extends PodcastEpisodioListItem {
  capitulos: PodcastCapitulo[];
  podcast: {
    slug: string;
    titulo: string;
    descripcion: string;
  };
}

export interface PodcastShow {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  coverUrl: string | null;
  episodios: PodcastEpisodioListItem[];
  publishedAt: string | null;
}
