import { AuthTokenTipo, RolNombre } from "@prisma/client";
import { isDatabaseConfigured, isEmailConfigured } from "@/config/env";
import { getAdminEmails, getModeratorEmails } from "@/lib/auth-guards";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { authEmailService } from "@/modules/autenticacion/services/auth-email.service";
import {
  consumeAuthToken,
  consumeEmailVerifyCode,
  issueAuthToken,
  issueEmailVerifyCode,
} from "@/modules/autenticacion/services/auth-token.service";
import {
  emailOnlySchema,
  registroSchema,
  resetPasswordSchema,
  verifyCodeSchema,
} from "@/modules/autenticacion/validations/auth.schema";

interface UpsertAuthUserInput {
  email: string;
  nombre: string;
  avatarUrl?: string | null;
}

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status = 400
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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

async function getRoles() {
  const [rolUser, rolAdmin, rolModerator] = await Promise.all([
    prisma.rol.findUnique({ where: { nombre: RolNombre.USER } }),
    prisma.rol.findUnique({ where: { nombre: RolNombre.ADMIN } }),
    prisma.rol.findUnique({ where: { nombre: RolNombre.MODERATOR } }),
  ]);

  if (!rolUser) {
    throw new AuthServiceError(
      "Falta el rol USER. Ejecutá npm run db:seed.",
      "DB_REQUIRED",
      503
    );
  }

  return { rolUser, rolAdmin, rolModerator };
}

function requireDatabase() {
  if (!isDatabaseConfigured()) {
    throw new AuthServiceError(
      "La base de datos no está configurada.",
      "DB_REQUIRED",
      503
    );
  }
}

function assertEmailCanSend() {
  if (process.env.NODE_ENV === "production" && !isEmailConfigured()) {
    throw new AuthServiceError(
      "El correo de Alterna no está configurado. Falta conectar el envío.",
      "EMAIL_NOT_CONFIGURED",
      503
    );
  }
}

async function emitirVerificacion(email: string, usuarioId: string) {
  assertEmailCanSend();
  const code = await issueEmailVerifyCode({ email, usuarioId });
  let verifyUrl: string | undefined;
  let emailSent = false;
  if (code) {
    try {
      verifyUrl = await authEmailService.enviarVerificacion(email, code);
      emailSent = true;
    } catch (error) {
      console.error("[auth] Email de verificación:", error);
      if (process.env.NODE_ENV === "production") {
        throw new AuthServiceError(
          "No pudimos enviar el email. Intentá de nuevo en unos minutos.",
          "EMAIL_FAILED",
          502
        );
      }
    }
  }
  return { verifyUrl, verifyCode: code, emailSent };
}

export type AuthUserRecord = {
  id: string;
  email: string;
  nombre: string;
  avatarUrl: string | null;
  emailVerificado: boolean;
  rol: { nombre: RolNombre };
};

/**
 * Sincroniza el usuario OAuth con la tabla `usuarios`.
 * Roles especiales vía env: ADMIN_EMAILS / MODERATOR_EMAILS.
 */
export async function upsertUsuarioDesdeOAuth(input: UpsertAuthUserInput) {
  if (!isDatabaseConfigured()) return null;

  try {
    const { rolUser, rolAdmin, rolModerator } = await getRoles();
    const email = normalizeEmail(input.email);

    const rolId = resolveRolId({
      email,
      rolUserId: rolUser.id,
      rolAdminId: rolAdmin?.id,
      rolModeratorId: rolModerator?.id,
    });

    const existente = await prisma.usuario.findUnique({
      where: { email },
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
        email,
        nombre: input.nombre || email.split("@")[0] || "Usuario",
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

export async function registrarUsuario(input: unknown) {
  requireDatabase();
  const parsed = registroSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError(
      parsed.error.issues[0]?.message ?? "Revisá los datos.",
      "VALIDATION"
    );
  }

  const email = parsed.data.email;
  const { rolUser, rolAdmin, rolModerator } = await getRoles();
  const existente = await prisma.usuario.findUnique({ where: { email } });
  const passwordHash = await hashPassword(parsed.data.password);

  if (existente) {
    if (existente.passwordHash) {
      throw new AuthServiceError(
        "Ese email ya tiene cuenta. Ingresá o recuperá la contraseña.",
        "EMAIL_TAKEN"
      );
    }

    const updated = await prisma.usuario.update({
      where: { id: existente.id },
      data: {
        nombre: parsed.data.nombre || existente.nombre,
        passwordHash,
        deletedAt: null,
      },
      include: { rol: true },
    });

    if (!updated.emailVerificado) {
      const verification = await emitirVerificacion(email, updated.id);
      return {
        usuario: updated,
        ...verification,
        alreadyVerified: false,
      };
    }

    return { usuario: updated, alreadyVerified: true as const };
  }

  const rolId = resolveRolId({
    email,
    rolUserId: rolUser.id,
    rolAdminId: rolAdmin?.id,
    rolModeratorId: rolModerator?.id,
  });

  const usuario = await prisma.usuario.create({
    data: {
      email,
      nombre: parsed.data.nombre,
      passwordHash,
      emailVerificado: false,
      rolId,
    },
    include: { rol: true },
  });

  const verification = await emitirVerificacion(email, usuario.id);
  return { usuario, ...verification, alreadyVerified: false };
}

export async function loginConPassword(
  emailRaw: string,
  password: string
): Promise<AuthUserRecord> {
  requireDatabase();
  const email = normalizeEmail(emailRaw);
  const usuario = await prisma.usuario.findFirst({
    where: { email, deletedAt: null },
    include: { rol: true },
  });

  if (!usuario?.passwordHash) {
    throw new AuthServiceError(
      "Email o contraseña incorrectos.",
      "INVALID_CREDENTIALS",
      401
    );
  }

  const ok = await verifyPassword(password, usuario.passwordHash);
  if (!ok) {
    throw new AuthServiceError(
      "Email o contraseña incorrectos.",
      "INVALID_CREDENTIALS",
      401
    );
  }

  if (!usuario.emailVerificado) {
    throw new AuthServiceError(
      "Verificá tu email antes de ingresar. Te reenviamos el enlace si lo pedís.",
      "EMAIL_NOT_VERIFIED",
      403
    );
  }

  return usuario;
}

export async function reenviarVerificacion(input: unknown) {
  requireDatabase();
  const parsed = emailOnlySchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError("Ingresá un email válido.", "VALIDATION");
  }

  const email = parsed.data.email;
  const usuario = await prisma.usuario.findFirst({
    where: { email, deletedAt: null },
  });

  if (!usuario || usuario.emailVerificado) {
    return { sent: true as const };
  }

  const verification = await emitirVerificacion(email, usuario.id);
  return { sent: true as const, ...verification };
}

async function marcarEmailVerificado(email: string) {
  return prisma.usuario.update({
    where: { email },
    data: { emailVerificado: true, deletedAt: null },
    include: { rol: true },
  });
}

export async function verificarEmail(rawToken: string, emailRaw?: string) {
  requireDatabase();
  const token = rawToken.trim();
  const email = emailRaw ? normalizeEmail(emailRaw) : "";

  if (email && /^\d{6}$/.test(token)) {
    const record = await consumeEmailVerifyCode(email, token);
    if (!record) {
      throw new AuthServiceError(
        "El código no es válido o ya caducó. Pedí uno nuevo.",
        "TOKEN_INVALID"
      );
    }
    return marcarEmailVerificado(record.email);
  }

  const record = await consumeAuthToken(AuthTokenTipo.EMAIL_VERIFY, token);
  if (!record) {
    throw new AuthServiceError(
      "El enlace no es válido o ya caducó. Pedí uno nuevo.",
      "TOKEN_INVALID"
    );
  }

  return marcarEmailVerificado(record.email);
}

export async function verificarEmailConCodigo(input: unknown) {
  requireDatabase();
  const parsed = verifyCodeSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError(
      parsed.error.issues[0]?.message ?? "Revisá el código.",
      "VALIDATION"
    );
  }

  return verificarEmail(parsed.data.code, parsed.data.email);
}

export async function solicitarMagicLink(input: unknown) {
  requireDatabase();
  const parsed = emailOnlySchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError("Ingresá un email válido.", "VALIDATION");
  }

  const email = parsed.data.email;
  assertEmailCanSend();
  const usuario = await prisma.usuario.findFirst({
    where: { email, deletedAt: null },
  });

  const token = await issueAuthToken({
    tipo: AuthTokenTipo.MAGIC_LINK,
    email,
    usuarioId: usuario?.id,
  });
  let magicUrl: string | undefined;
  let emailSent = false;
  if (token) {
    try {
      magicUrl = await authEmailService.enviarMagicLink(email, token);
      emailSent = true;
    } catch (error) {
      console.error("[auth] Email magic link:", error);
      if (process.env.NODE_ENV === "production") {
        throw new AuthServiceError(
          "No pudimos enviar el email. Intentá de nuevo en unos minutos.",
          "EMAIL_FAILED",
          502
        );
      }
    }
  }
  return { sent: true as const, magicUrl, emailSent };
}

export async function consumirMagicLink(rawToken: string): Promise<AuthUserRecord> {
  requireDatabase();
  const record = await consumeAuthToken(AuthTokenTipo.MAGIC_LINK, rawToken);
  if (!record) {
    throw new AuthServiceError(
      "El enlace no es válido o ya caducó.",
      "TOKEN_INVALID",
      401
    );
  }

  const { rolUser, rolAdmin, rolModerator } = await getRoles();
  const existente = await prisma.usuario.findUnique({
    where: { email: record.email },
    include: { rol: true },
  });

  if (existente) {
    return prisma.usuario.update({
      where: { id: existente.id },
      data: { emailVerificado: true, deletedAt: null },
      include: { rol: true },
    });
  }

  const rolId = resolveRolId({
    email: record.email,
    rolUserId: rolUser.id,
    rolAdminId: rolAdmin?.id,
    rolModeratorId: rolModerator?.id,
  });

  return prisma.usuario.create({
    data: {
      email: record.email,
      nombre: record.email.split("@")[0] || "Usuario",
      emailVerificado: true,
      rolId,
    },
    include: { rol: true },
  });
}

export async function solicitarReset(input: unknown) {
  requireDatabase();
  const parsed = emailOnlySchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError("Ingresá un email válido.", "VALIDATION");
  }

  const email = parsed.data.email;
  assertEmailCanSend();
  const usuario = await prisma.usuario.findFirst({
    where: { email, deletedAt: null },
  });

  if (!usuario) {
    return { sent: true as const };
  }

  const token = await issueAuthToken({
    tipo: AuthTokenTipo.PASSWORD_RESET,
    email,
    usuarioId: usuario.id,
  });
  let resetUrl: string | undefined;
  let emailSent = false;
  if (token) {
    try {
      resetUrl = await authEmailService.enviarReset(email, token);
      emailSent = true;
    } catch (error) {
      console.error("[auth] Email reset:", error);
      if (process.env.NODE_ENV === "production") {
        throw new AuthServiceError(
          "No pudimos enviar el email. Intentá de nuevo en unos minutos.",
          "EMAIL_FAILED",
          502
        );
      }
    }
  }
  return { sent: true as const, resetUrl, emailSent };
}

export async function restablecerPassword(input: unknown) {
  requireDatabase();
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError(
      parsed.error.issues[0]?.message ?? "Revisá los datos.",
      "VALIDATION"
    );
  }

  const record = await consumeAuthToken(
    AuthTokenTipo.PASSWORD_RESET,
    parsed.data.token
  );
  if (!record) {
    throw new AuthServiceError(
      "El enlace no es válido o ya caducó.",
      "TOKEN_INVALID"
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.usuario.update({
    where: { email: record.email },
    data: {
      passwordHash,
      emailVerificado: true,
      deletedAt: null,
    },
  });

  return { ok: true as const };
}
