import { NextResponse } from "next/server";
import { AuthRequiredError, ForbiddenError, requireAdmin } from "@/lib/auth-guards";
import { EditorialError, editorialService } from "@/modules/administracion/services/editorial.service";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof AuthRequiredError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 403 });
  }
  if (error instanceof EditorialError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
  }
  console.error("[api/admin/editar]", error);
  return NextResponse.json({ ok: false, message: "No se pudo guardar." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const tipo = url.searchParams.get("tipo") ?? "";
    const id = url.searchParams.get("id") ?? "";
    if (tipo === "ubicaciones") {
      const lugares = await editorialService.listarLugares();
      return NextResponse.json({ ok: true, lugares });
    }
    const ficha = await editorialService.obtener(tipo, id);
    return NextResponse.json({ ok: true, ficha });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = (await request.json()) as {
      tipo?: string;
      id?: string;
      values?: Record<string, unknown>;
    };
    const ficha = await editorialService.guardar(
      body.tipo ?? "",
      body.id ?? "",
      body.values ?? {},
      session.user.id
    );
    return NextResponse.json({ ok: true, ficha });
  } catch (error) {
    return errorResponse(error);
  }
}
