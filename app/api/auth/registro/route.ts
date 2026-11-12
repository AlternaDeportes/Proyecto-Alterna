import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { registrarUsuario } from "@/modules/autenticacion/services/usuario-auth.service";
import {
  clientIp,
  handleAuthApiError,
  publicVerifyPayload,
  readJsonBody,
} from "@/modules/autenticacion/utils/auth-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`auth-registro:${clientIp(request)}`, {
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
    const result = await registrarUsuario(body);
    return NextResponse.json(
      {
        ok: true,
        alreadyVerified: result.alreadyVerified,
        ...publicVerifyPayload({
          verifyUrl: "verifyUrl" in result ? result.verifyUrl : undefined,
          verifyCode: "verifyCode" in result ? result.verifyCode : undefined,
          emailSent: "emailSent" in result ? result.emailSent : undefined,
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAuthApiError(error);
  }
}
