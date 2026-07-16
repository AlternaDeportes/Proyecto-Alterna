import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  ContactoDeliveryError,
  ContactoValidationError,
  contactoService,
} from "@/modules/contacto/services/contacto.service";

export const dynamic = "force-dynamic";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** POST /api/contacto — recibe mensajes del formulario */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = checkRateLimit(`contacto:${ip}`, { limit: 5, windowMs: 60_000 });

  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: `Demasiados intentos. Esperá ${limit.retryAfterSec} segundos.`,
      },
      { status: 429 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Cuerpo de solicitud inválido." },
      { status: 400 }
    );
  }

  try {
    const result = await contactoService.enviarMensaje(body);

    return NextResponse.json(
      {
        ok: true,
        data: {
          id: result.id,
          guardadoEnDb: result.guardadoEnDb,
          emailEnviado: result.emailEnviado,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ContactoValidationError) {
      return NextResponse.json(
        { ok: false, errors: error.fieldErrors, message: "Revisá los campos del formulario." },
        { status: 400 }
      );
    }

    if (error instanceof ContactoDeliveryError) {
      return NextResponse.json(
        {
          ok: false,
          message: "No pudimos registrar tu mensaje. Intentá por email directo.",
        },
        { status: 503 }
      );
    }

    console.error("[api/contacto]", error);
    return NextResponse.json(
      { ok: false, message: "Error interno. Intentá más tarde." },
      { status: 500 }
    );
  }
}
