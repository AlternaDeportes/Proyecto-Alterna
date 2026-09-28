import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  PageViewValidationError,
  pageViewService,
} from "@/modules/analytics/services/pageview.service";

export const dynamic = "force-dynamic";

/** POST /api/analytics/evento — play, mapa. Sin IP persistida. */
export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  const limit = checkRateLimit(`analytics-evento:${ip}`, {
    limit: 40,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, message: "Rate limit." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "JSON inválido." }, { status: 400 });
  }

  try {
    const data = await pageViewService.registrarEvento(body);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof PageViewValidationError) {
      return NextResponse.json(
        { ok: false, errors: error.fieldErrors },
        { status: 400 }
      );
    }
    console.error("[api/analytics/evento]", error);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
