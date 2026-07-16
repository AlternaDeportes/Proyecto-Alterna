import { NextResponse } from "next/server";
import {
  AuthRequiredError,
  DatabaseRequiredError,
  ForbiddenError,
} from "@/lib/auth-guards";
import { AdminValidationError } from "@/modules/administracion/services/admin.service";

export function handleAdminError(error: unknown) {
  if (error instanceof AuthRequiredError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 403 });
  }
  if (error instanceof DatabaseRequiredError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 503 });
  }
  if (error instanceof AdminValidationError) {
    return NextResponse.json(
      { ok: false, errors: error.fieldErrors, message: "Datos inválidos." },
      { status: 400 }
    );
  }
  console.error("[api/admin]", error);
  return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
}
