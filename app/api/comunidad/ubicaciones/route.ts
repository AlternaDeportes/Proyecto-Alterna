import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  ComunidadAuthError,
  ComunidadDbError,
  ComunidadValidationError,
  comunidadService,
} from "@/modules/comunidad/services/comunidad.service";

export const dynamic = "force-dynamic";

/** POST /api/comunidad/ubicaciones — proponer punto (auth + DB) */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, message: "Iniciá sesión para sumar un punto." },
      { status: 401 }
    );
  }

  const limit = checkRateLimit(`comunidad-ubi:${session.user.id}`, {
    limit: 5,
    windowMs: 10 * 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: `Límite alcanzado. Esperá ${limit.retryAfterSec}s.` },
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
    const ubicacion = await comunidadService.proponerUbicacion(body, session.user.id);
    return NextResponse.json(
      {
        ok: true,
        data: ubicacion,
        message: "Punto enviado. Quedará visible cuando el equipo lo apruebe.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ComunidadValidationError) {
      const first =
        Object.values(error.fieldErrors).flat().find(Boolean) ??
        "Revisá el formulario.";
      return NextResponse.json(
        { ok: false, errors: error.fieldErrors, message: first },
        { status: 400 }
      );
    }
    if (error instanceof ComunidadAuthError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
    }
    if (error instanceof ComunidadDbError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 });
    }
    console.error("[api/comunidad/ubicaciones]", error);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
