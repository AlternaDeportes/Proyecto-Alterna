import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { solicitarMagicLink } from "@/modules/autenticacion/services/usuario-auth.service";
import {
  clientIp,
  handleAuthApiError,
  publicVerifyPayload,
  readJsonBody,
} from "@/modules/autenticacion/utils/auth-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`auth-magic:${clientIp(request)}`, {
    limit: 5,
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
    const result = await solicitarMagicLink(body);
    const revealed = publicVerifyPayload({
      verifyUrl: result.magicUrl,
      emailSent: result.emailSent,
    });
    return NextResponse.json({
      ok: true,
      emailReady: revealed.emailReady,
      magicUrl: revealed.verifyUrl,
    });
  } catch (error) {
    return handleAuthApiError(error);
  }
}
