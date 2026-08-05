import { RolNombre } from "@prisma/client";
import { isDatabaseConfigured } from "@/config/env";
import { getAdminEmails, getModeratorEmails } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

interface UpsertAuthUserInput {
  email: string;
  nombre: string;
  avatarUrl?: string | null;
}

function resolveRolId(input: {
  email: string;
  rolUserId: string;
  rolAdminId?: string;
  rolModeratorId?: string;
}): string {
  const email = input.email.toLowerCase();
  if (getAdminEmails().includes(email) && input.rolAdminId) {
    return input.rolAdminId;
  }
  if (getModeratorEmails().includes(email) && input.rolModeratorId) {
    return input.rolModeratorId;
  }
  return input.rolUserId;
}

/**
 * Sincroniza el usuario OAuth con la tabla `usuarios`.
 * Roles especiales vía env: ADMIN_EMAILS / MODERATOR_EMAILS.
 */
export async function upsertUsuarioDesdeOAuth(input: UpsertAuthUserInput) {
  if (!isDatabaseConfigured()) return null;

  try {
    const [rolUser, rolAdmin, rolModerator] = await Promise.all([
      prisma.rol.findUnique({ where: { nombre: RolNombre.USER } }),
      prisma.rol.findUnique({ where: { nombre: RolNombre.ADMIN } }),
      prisma.rol.findUnique({ where: { nombre: RolNombre.MODERATOR } }),
    ]);

    if (!rolUser) {
      console.error("[auth] Rol USER no encontrado — ejecutá npm run db:seed");
      return null;
    }

    const rolId = resolveRolId({
      email: input.email,
      rolUserId: rolUser.id,
      rolAdminId: rolAdmin?.id,
      rolModeratorId: rolModerator?.id,
    });

    const existente = await prisma.usuario.findUnique({
      where: { email: input.email },
      include: { rol: true },
    });

    if (existente) {
      return prisma.usuario.update({
        where: { id: existente.id },
        data: {
          nombre: input.nombre || existente.nombre,
          avatarUrl: input.avatarUrl ?? existente.avatarUrl,
          emailVerificado: true,
          deletedAt: null,
          rolId,
        },
        include: { rol: true },
      });
    }

    return prisma.usuario.create({
      data: {
        email: input.email,
        nombre: input.nombre || input.email.split("@")[0] || "Usuario",
        avatarUrl: input.avatarUrl,
        emailVerificado: true,
        rolId,
      },
      include: { rol: true },
    });
  } catch (error) {
    console.error("[auth] Error al sincronizar usuario:", error);
    return null;
  }
}
