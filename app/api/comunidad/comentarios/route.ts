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

/** GET /api/comunidad/comentarios?ubicacionId= */
export async function GET(request: Request) {
  const ubicacionId = new URL(request.url).searchParams.get("ubicacionId");
  if (!ubicacionId) {
    return NextResponse.json(
      { ok: false, message: "Falta ubicacionId." },
      { status: 400 }
    );
  }

  const comentarios = await comunidadService.listarComentarios(ubicacionId);
  return NextResponse.json({ ok: true, data: comentarios });
}

/** POST /api/comunidad/comentarios — auth + DB */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, message: "Iniciá sesión para comentar." },
      { status: 401 }
    );
  }

  const limit = checkRateLimit(`comunidad-com:${session.user.id}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: `Demasiados comentarios. Esperá ${limit.retryAfterSec}s.` },
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
    const comentario = await comunidadService.comentar(body, session.user.id);
    return NextResponse.json({ ok: true, data: comentario }, { status: 201 });
  } catch (error) {
    if (error instanceof ComunidadValidationError) {
      return NextResponse.json(
        { ok: false, errors: error.fieldErrors, message: "Revisá el comentario." },
        { status: 400 }
      );
    }
    if (error instanceof ComunidadAuthError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
    }
    if (error instanceof ComunidadDbError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 });
    }
    console.error("[api/comunidad/comentarios]", error);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
