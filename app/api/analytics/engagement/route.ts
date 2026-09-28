import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  PageViewValidationError,
  pageViewService,
} from "@/modules/analytics/services/pageview.service";

export const dynamic = "force-dynamic";

function limited(request: Request, bucket: string, limit: number) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  return checkRateLimit(`${bucket}:${ip}`, { limit, windowMs: 60_000 });
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** POST /api/analytics/engagement — duración y scroll de la visita abierta */
export async function POST(request: Request) {
  const limit = limited(request, "analytics-engagement", 30);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, message: "Rate limit." }, { status: 429 });
  }

  const body = await readJson(request);
  if (!body) {
    return NextResponse.json({ ok: false, message: "JSON inválido." }, { status: 400 });
  }

  try {
    const data = await pageViewService.registrarEngagement(body);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof PageViewValidationError) {
      return NextResponse.json(
        { ok: false, errors: error.fieldErrors },
        { status: 400 }
      );
    }
    console.error("[api/analytics/engagement]", error);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
