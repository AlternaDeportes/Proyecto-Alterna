import { NextResponse, type NextRequest } from "next/server";
import { handlers, isAuthConfigured } from "@/lib/auth";

async function guard(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<Response>
) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Auth no configurado. Completá AUTH_SECRET, AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET en .env.local. " +
          "No abras /api/auth/callback/google a mano: esa URL solo la usa Google después del login. " +
          "Para ingresar andá a /ingresar.",
        hint: "/ingresar",
      },
      { status: 503 }
    );
  }

  return handler(request);
}

export async function GET(request: NextRequest) {
  return guard(request, handlers.GET);
}

export async function POST(request: NextRequest) {
  return guard(request, handlers.POST);
}
