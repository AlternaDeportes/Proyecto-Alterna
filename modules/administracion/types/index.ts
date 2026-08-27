export interface AdminResumen {
  pendientes: number;
  comentariosPendientes: number;
  comentarios: number;
  mensajesNoLeidos: number;
  deportes: number;
  historias: number;
  ubicacionesAprobadas: number;
  ubicacionesRechazadas: number;
  usuarios: number;
  favoritos: number;
  eventos: number;
  episodiosPodcast: number;
  episodiosDoc: number;
}

export interface AdminUbicacionPendiente {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  horarios: string;
  contacto: string | null;
  historia: string | null;
  moderacion: string;
  deporteNombre: string;
  deporteSlug: string;
  ciudadNombre: string;
  creadorNombre: string | null;
  creadorEmail: string | null;
  createdAt: string;
}

export interface AdminComentario {
  id: string;
  texto: string;
  moderacion: string;
  createdAt: string;
  ubicacionId: string;
  ubicacionNombre: string;
  deporteNombre: string;
  autorNombre: string;
  autorEmail: string;
}

export interface AdminMensajeContacto {
  id: string;
  nombre: string;
  email: string;
  interes: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
}

export interface AdminUsuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  createdAt: string;
  comentarios: number;
  aportes: number;
  favoritos: number;
}

export interface AdminContenidoItem {
  tipo: "deporte" | "historia" | "podcast" | "documental" | "evento";
  id: string;
  titulo: string;
  href: string;
  meta: string;
  publishedAt: string | null;
}

export interface AdminAuditItem {
  id: string;
  accion: string;
  entidad: string;
  entidadId: string | null;
  usuarioNombre: string | null;
  usuarioEmail: string | null;
  createdAt: string;
}

export interface AdminConteoPeriodo {
  visitas: number;
  sesiones: number;
  usuariosNuevos: number;
  comentarios: number;
  puntosPropuestos: number;
  puntosAprobados: number;
  mensajes: number;
  favoritos: number;
}

export interface AdminSerieDia {
  fecha: string;
  visitas: number;
  usuarios: number;
  comentarios: number;
  puntos: number;
  mensajes: number;
}

export interface AdminHueco {
  id: string;
  titulo: string;
  detalle: string;
  estado: "listo" | "parcial" | "falta";
}

export interface AdminMetricas {
  etiquetaMes: string;
  etiquetaMesAnterior: string;
  mesActual: AdminConteoPeriodo;
  mesAnterior: AdminConteoPeriodo;
  ultimos30: AdminSerieDia[];
  topPaginas: { path: string; vistas: number }[];
  dispositivos: { device: string; total: number }[];
  huecos: AdminHueco[];
}

export type AdminTabId =
  | "resumen"
  | "moderacion"
  | "mensajes"
  | "comunidad"
  | "contenido"
  | "metricas"
  | "auditoria";
