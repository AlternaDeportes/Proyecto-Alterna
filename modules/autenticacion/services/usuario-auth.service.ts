import { RolNombre } from "@prisma/client";
import { isDatabaseConfigured } from "@/config/env";
import { getAdminEmails } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

interface UpsertAuthUserInput {
  email: string;
  nombre: string;
  avatarUrl?: string | null;
}

/**
 * Sincroniza el usuario OAuth con la tabla `usuarios`.
 * Si el email está en ADMIN_EMAILS, asigna rol ADMIN.
 */
export async function upsertUsuarioDesdeOAuth(input: UpsertAuthUserInput) {
  if (!isDatabaseConfigured()) return null;

  try {
    const [rolUser, rolAdmin] = await Promise.all([
      prisma.rol.findUnique({ where: { nombre: RolNombre.USER } }),
      prisma.rol.findUnique({ where: { nombre: RolNombre.ADMIN } }),
    ]);

    if (!rolUser) {
      console.error("[auth] Rol USER no encontrado — ejecutá npm run db:seed");
      return null;
    }

    const esAdmin = getAdminEmails().includes(input.email.toLowerCase());
    const rolId = esAdmin && rolAdmin ? rolAdmin.id : rolUser.id;

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
          ...(esAdmin && rolAdmin ? { rolId: rolAdmin.id } : {}),
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
