import { createHash, randomBytes, randomInt } from "crypto";
import { AuthTokenTipo } from "@prisma/client";
import { isDatabaseConfigured } from "@/config/env";
import { prisma } from "@/lib/prisma";

const EXPIRY_MS: Record<AuthTokenTipo, number> = {
  EMAIL_VERIFY: 2 * 60 * 60 * 1000,
  PASSWORD_RESET: 60 * 60 * 1000,
  MAGIC_LINK: 15 * 60 * 1000,
};

export function generateAuthToken() {
  return randomBytes(32).toString("hex");
}

export function generateEmailVerifyCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashAuthToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashEmailCode(email: string, code: string) {
  return hashAuthToken(`${email.toLowerCase().trim()}:${code.trim()}`);
}

async function invalidateOpenTokens(email: string, tipo: AuthTokenTipo) {
  await prisma.authToken.updateMany({
    where: { email, tipo, usedAt: null },
    data: { usedAt: new Date() },
  });
}

export async function issueAuthToken(input: {
  tipo: AuthTokenTipo;
  email: string;
  usuarioId?: string | null;
}) {
  if (!isDatabaseConfigured()) return null;

  const token = generateAuthToken();
  const tokenHash = hashAuthToken(token);
  const email = input.email.toLowerCase();

  await invalidateOpenTokens(email, input.tipo);

  await prisma.authToken.create({
    data: {
      tipo: input.tipo,
      tokenHash,
      email,
      usuarioId: input.usuarioId ?? null,
      expiresAt: new Date(Date.now() + EXPIRY_MS[input.tipo]),
    },
  });

  return token;
}

/** Código de 6 dígitos ligado al email (el hash no choca entre cuentas). */
export async function issueEmailVerifyCode(input: {
  email: string;
  usuarioId?: string | null;
}) {
  if (!isDatabaseConfigured()) return null;

  const email = input.email.toLowerCase().trim();
  const code = generateEmailVerifyCode();

  await invalidateOpenTokens(email, AuthTokenTipo.EMAIL_VERIFY);

  await prisma.authToken.create({
    data: {
      tipo: AuthTokenTipo.EMAIL_VERIFY,
      tokenHash: hashEmailCode(email, code),
      email,
      usuarioId: input.usuarioId ?? null,
      expiresAt: new Date(Date.now() + EXPIRY_MS.EMAIL_VERIFY),
    },
  });

  return code;
}

export async function consumeAuthToken(tipo: AuthTokenTipo, rawToken: string) {
  if (!isDatabaseConfigured()) return null;

  const tokenHash = hashAuthToken(rawToken);
  const record = await prisma.authToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.tipo !== tipo || record.usedAt) return null;
  if (record.expiresAt.getTime() < Date.now()) return null;

  await prisma.authToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record;
}

export async function consumeEmailVerifyCode(emailRaw: string, code: string) {
  if (!isDatabaseConfigured()) return null;

  const email = emailRaw.toLowerCase().trim();
  const tokenHash = hashEmailCode(email, code);
  const record = await prisma.authToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.tipo !== AuthTokenTipo.EMAIL_VERIFY || record.usedAt) {
    return null;
  }
  if (record.email !== email) return null;
  if (record.expiresAt.getTime() < Date.now()) return null;

  await prisma.authToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record;
}
