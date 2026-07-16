import { NextResponse } from "next/server";
import { ubicacionService } from "@/modules/mapa/services/ubicacion.service";

export const dynamic = "force-dynamic";

/** GET /api/mapa/ubicaciones?deporte=slug */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deporte = searchParams.get("deporte") ?? undefined;

  const ubicaciones = await ubicacionService.listar({
    deporteSlug: deporte,
  });

  return NextResponse.json({ ok: true, data: ubicaciones });
}
