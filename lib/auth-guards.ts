import { auth } from "@/lib/auth";
import { isDatabaseConfigured } from "@/config/env";
import type { RolNombre } from "@prisma/client";

export class AuthRequiredError extends Error {
  constructor(message = "Necesitás iniciar sesión") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "No tenés permisos") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class DatabaseRequiredError extends Error {
  constructor(message = "Se requiere base de datos configurada") {
    super(message);
    this.name = "DatabaseRequiredError";
  }
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    throw new AuthRequiredError();
  }
  return session;
}

export async function requireDbUserId() {
  if (!isDatabaseConfigured()) {
    throw new DatabaseRequiredError();
  }
  const session = await requireSession();
  const { prisma } = await import("@/lib/prisma");
  const usuario = await prisma.usuario.findFirst({
    where: { id: session.user.id, deletedAt: null },
    select: { id: true },
  });
  if (!usuario) {
    throw new DatabaseRequiredError(
      "Tu sesión no está vinculada a la base de datos. Volvé a ingresar con Google."
    );
  }
  return session;
}

export function isStaffRole(rol: RolNombre | string | undefined) {
  return rol === "ADMIN" || rol === "MODERATOR";
}

export async function requireStaff() {
  const session = await requireDbUserId();
  if (!isStaffRole(session.user.rol)) {
    throw new ForbiddenError("Solo moderadores o administradores.");
  }
  return session;
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
