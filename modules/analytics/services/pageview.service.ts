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

const utmSchema = z
  .string()
  .max(40)
  .regex(/^[A-Za-z0-9._~+-]+$/)
  .optional()
  .nullable();

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
  utmSource: utmSchema,
  utmMedium: utmSchema,
  utmCampaign: utmSchema,
});

const engagementSchema = z.object({
  path: visitaSchema.shape.path,
  sessionId: visitaSchema.shape.sessionId,
  durationMs: z.number().int().min(0).max(60 * 60 * 1000),
  scrollPct: z.number().int().min(0).max(100),
});

const eventSchema = z.object({
  type: z.enum(["play", "progress", "map_filter", "map_pin"]),
  target: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .refine((value) => !/[\u0000-\u001f<>]/.test(value)),
  sessionId: visitaSchema.shape.sessionId,
  path: visitaSchema.shape.path,
  value: z.number().int().min(0).max(100).optional().nullable(),
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

export function browserFromUserAgent(ua: string | null) {
  const value = (ua ?? "").toLowerCase();
  if (value.includes("edg/")) return "edge";
  if (value.includes("opr/") || value.includes("opera")) return "opera";
  if (value.includes("chrome/") || value.includes("crios/")) return "chrome";
  if (value.includes("firefox/") || value.includes("fxios/")) return "firefox";
  if (value.includes("safari/")) return "safari";
  return "otro";
}

function cleanUtm(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 40) : null;
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
        browser: browserFromUserAgent(userAgent),
        utmSource: cleanUtm(parsed.data.utmSource),
        utmMedium: cleanUtm(parsed.data.utmMedium),
        utmCampaign: cleanUtm(parsed.data.utmCampaign),
      },
    });

    return { ok: true as const };
  },

  async registrarEngagement(input: unknown) {
    if (!isDatabaseConfigured()) return { skipped: true as const };

    const parsed = engagementSchema.safeParse(input);
    if (!parsed.success) {
      throw new PageViewValidationError(parsed.error.flatten().fieldErrors);
    }
    if (!isTrackablePath(parsed.data.path)) return { skipped: true as const };

    const reciente = await prisma.pageView.findFirst({
      where: {
        sessionId: parsed.data.sessionId,
        path: parsed.data.path,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, durationMs: true, scrollPct: true },
    });
    if (!reciente) return { skipped: true as const };

    await prisma.pageView.update({
      where: { id: reciente.id },
      data: {
        durationMs: Math.max(reciente.durationMs ?? 0, parsed.data.durationMs),
        scrollPct: Math.max(reciente.scrollPct ?? 0, parsed.data.scrollPct),
      },
    });
    return { ok: true as const };
  },

  async registrarEvento(input: unknown) {
    if (!isDatabaseConfigured()) return { skipped: true as const };

    const parsed = eventSchema.safeParse(input);
    if (!parsed.success) {
      throw new PageViewValidationError(parsed.error.flatten().fieldErrors);
    }
    if (!isTrackablePath(parsed.data.path)) return { skipped: true as const };

    await prisma.analyticsEvent.create({
      data: {
        type: parsed.data.type,
        target: parsed.data.target,
        sessionId: parsed.data.sessionId,
        path: parsed.data.path,
        value: parsed.data.value ?? null,
      },
    });
    return { ok: true as const };
  },
};
