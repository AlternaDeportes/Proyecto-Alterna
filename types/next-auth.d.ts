import type { DefaultSession } from "next-auth";
import type { RolNombre } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: RolNombre;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    usuarioId?: string;
    rol?: RolNombre;
  }
}
