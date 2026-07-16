import { NextResponse } from "next/server";
import {
  AuthRequiredError,
  DatabaseRequiredError,
  requireDbUserId,
} from "@/lib/auth-guards";
import {
  FavoritoValidationError,
  usuarioService,
} from "@/modules/usuarios/services/usuario.service";

export const dynamic = "force-dynamic";

/** GET /api/usuarios/favoritos */
export async function GET() {
  try {
    const session = await requireDbUserId();
    const favoritos = await usuarioService.listarFavoritos(session.user.id);
    return NextResponse.json({ ok: true, data: favoritos });
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/usuarios/favoritos — toggle */
export async function POST(request: Request) {
  try {
    const session = await requireDbUserId();
    const body = await request.json();
    const result = await usuarioService.toggleFavorito(session.user.id, body);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof AuthRequiredError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }
  if (error instanceof DatabaseRequiredError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 503 });
  }
  if (error instanceof FavoritoValidationError) {
    return NextResponse.json(
      { ok: false, errors: error.fieldErrors, message: "Datos inválidos." },
      { status: 400 }
    );
  }
  console.error("[api/usuarios/favoritos]", error);
  return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
}
