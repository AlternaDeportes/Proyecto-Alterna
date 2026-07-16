export interface HistoriaDeporteRef {
  nombre: string;
  slug: string;
  colorPrimario: string;
}

export interface HistoriaListItem {
  id: string;
  slug: string;
  titulo: string;
  pullQuote: string | null;
  destacada: boolean;
  excerpt: string;
  deporte: HistoriaDeporteRef;
  publishedAt: string | null;
}

export interface HistoriaDetalle extends HistoriaListItem {
  cuerpo: string;
  seoTitle: string | null;
  seoDescription: string | null;
  /** Placeholders de galería hasta Cloudinary */
  galeria: { id: string; alt: string; label: string }[];
}
