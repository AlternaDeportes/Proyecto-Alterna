import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { restablecerPassword } from "@/modules/autenticacion/services/usuario-auth.service";
import {
  clientIp,
  handleAuthApiError,
  readJsonBody,
} from "@/modules/autenticacion/utils/auth-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`auth-reset:${clientIp(request)}`, {
    limit: 8,
    windowMs: 15 * 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: `Demasiados intentos. Esperá ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await readJsonBody(request);
    await restablecerPassword(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAuthApiError(error);
  }
}
