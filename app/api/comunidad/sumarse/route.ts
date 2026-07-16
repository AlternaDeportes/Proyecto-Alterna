import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  ComunidadValidationError,
  comunidadService,
} from "@/modules/comunidad/services/comunidad.service";
import {
  ContactoDeliveryError,
  ContactoValidationError,
} from "@/modules/contacto/services/contacto.service";

export const dynamic = "force-dynamic";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** POST /api/comunidad/sumarse */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = checkRateLimit(`comunidad-sumarse:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: `Demasiados intentos. Esperá ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "JSON inválido." }, { status: 400 });
  }

  try {
    const session = await auth();
    const result = await comunidadService.sumarse(body, session?.user?.id);

    if ("spam" in result && result.spam) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (error) {
    if (
      error instanceof ComunidadValidationError ||
      error instanceof ContactoValidationError
    ) {
      return NextResponse.json(
        { ok: false, errors: error.fieldErrors, message: "Revisá el formulario." },
        { status: 400 }
      );
    }
    if (error instanceof ContactoDeliveryError) {
      return NextResponse.json(
        { ok: false, message: "No pudimos registrar tu mensaje. Escribinos por email." },
        { status: 503 }
      );
    }
    console.error("[api/comunidad/sumarse]", error);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
