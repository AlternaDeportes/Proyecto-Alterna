import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/config/env";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** GET /api/health/database — verifica conexión a PostgreSQL */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        status: "not_configured",
        message: "DATABASE_URL no está definida en .env.local",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    const [deportes, ubicaciones] = await Promise.all([
      prisma.deporte.count({ where: { deletedAt: null } }),
      prisma.ubicacion.count({ where: { deletedAt: null } }),
    ]);

    return NextResponse.json({
      ok: true,
      status: "connected",
      counts: { deportes, ubicaciones },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { ok: false, status: "error", message },
      { status: 503 }
    );
  }
}
