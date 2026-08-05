export interface DocumentalEpisodioListItem {
  id: string;
  slug: string;
  titulo: string;
  sinopsis: string | null;
  numero: number;
  duracionSeg: number | null;
  videoUrl: string | null;
  coverUrl: string | null;
  publishedAt: string | null;
  proximo: boolean;
  etiqueta?: string;
}

export interface DocumentalEpisodioDetalle extends DocumentalEpisodioListItem {
  documental: {
    slug: string;
    titulo: string;
    sinopsis: string;
  };
}

export interface DocumentalShow {
  id: string;
  slug: string;
  titulo: string;
  sinopsis: string;
  coverUrl: string | null;
  publishedAt: string | null;
  episodios: DocumentalEpisodioListItem[];
}
