import { isDatabaseConfigured } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PRIVATE_PREFIXES = [
  "/api",
  "/panel-admin",
  "/perfil",
  "/ingresar",
  "/offline",
];

const visitaSchema = z.object({
  path: z
    .string()
    .min(1)
    .max(180)
    .regex(/^\/[A-Za-z0-9\-._/~]*$/)
    .refine((value) => !value.includes("//")),
  referrer: z.string().max(240).optional().nullable(),
  sessionId: z
    .string()
    .min(8)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export class PageViewValidationError extends Error {
  constructor(public fieldErrors: Record<string, string[] | undefined>) {
    super("Datos inválidos");
    this.name = "PageViewValidationError";
  }
}

export function isTrackablePath(path: string) {
  if (!path.startsWith("/")) return false;
  return !PRIVATE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

export function deviceFromUserAgent(ua: string | null) {
  const value = (ua ?? "").toLowerCase();
  if (!value) return "desktop";
  if (/bot|crawl|spider|slurp|bingpreview/.test(value)) return "bot";
  if (/ipad|tablet/.test(value)) return "tablet";
  if (/mobi|iphone|android/.test(value)) return "mobile";
  return "desktop";
}

function sanitizeReferrer(raw: string | null | undefined) {
  if (!raw?.trim()) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.host.slice(0, 120);
  } catch {
    return null;
  }
}

export const pageViewService = {
  async registrar(input: unknown, userAgent: string | null) {
    if (!isDatabaseConfigured()) return { skipped: true as const };

    const parsed = visitaSchema.safeParse(input);
    if (!parsed.success) {
      throw new PageViewValidationError(parsed.error.flatten().fieldErrors);
    }

    const path = parsed.data.path;
    if (!isTrackablePath(path)) {
      return { skipped: true as const };
    }

    const device = deviceFromUserAgent(userAgent);
    if (device === "bot") {
      return { skipped: true as const };
    }

    await prisma.pageView.create({
      data: {
        path,
        referrer: sanitizeReferrer(parsed.data.referrer),
        sessionId: parsed.data.sessionId,
        device,
      },
    });

    return { ok: true as const };
  },
};
