import type { RolNombre } from "@prisma/client";

/** Datos de sesión expuestos al cliente */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  rol: RolNombre;
}

export interface AuthStatus {
  configured: boolean;
  googleEnabled: boolean;
}
