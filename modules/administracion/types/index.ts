export interface AdminResumen {
  pendientes: number;
  mensajesNoLeidos: number;
  deportes: number;
  historias: number;
  ubicacionesAprobadas: number;
  usuarios: number;
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

export interface AdminMensajeContacto {
  id: string;
  nombre: string;
  email: string;
  interes: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
}
