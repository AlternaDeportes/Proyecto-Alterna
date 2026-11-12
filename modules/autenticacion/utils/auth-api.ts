import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/config/env";
import { AuthServiceError } from "@/modules/autenticacion/services/usuario-auth.service";

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AuthServiceError("Cuerpo de solicitud inválido.", "VALIDATION");
  }
}

/**
 * El código y el enlace solo se muestran en desarrollo.
 * En producción llegan por email. Nunca se devuelven en la respuesta pública.
 */
export function publicVerifyPayload(result: {
  verifyUrl?: string;
  verifyCode?: string | null;
  emailSent?: boolean;
}) {
  const emailReady = isEmailConfigured() && result.emailSent === true;
  const reveal = process.env.NODE_ENV !== "production";

  return {
    emailReady,
    verifyUrl: reveal ? result.verifyUrl : undefined,
    verifyCode: reveal && !emailReady ? result.verifyCode ?? undefined : undefined,
  };
}

export function handleAuthApiError(error: unknown) {
  if (error instanceof AuthServiceError) {
    return NextResponse.json(
      { ok: false, message: error.message, code: error.code },
      { status: error.status }
    );
  }

  console.error("[api/auth]", error);
  return NextResponse.json(
    { ok: false, message: "Error interno. Intentá más tarde." },
    { status: 500 }
  );
}
