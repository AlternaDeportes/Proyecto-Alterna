import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth-guards";
import { handleAdminError } from "@/modules/administracion/lib/api-errors";
import { adminService } from "@/modules/administracion/services/admin.service";

export const dynamic = "force-dynamic";

/** GET /api/admin/ubicaciones?estado=PENDIENTE|APROBADO|RECHAZADO */
export async function GET(request: Request) {
  try {
    await requireStaff();
    const estado = new URL(request.url).searchParams.get("estado");
    const filtro =
      estado === "PENDIENTE" || estado === "APROBADO" || estado === "RECHAZADO"
        ? estado
        : undefined;
    const data = await adminService.listarUbicaciones(filtro);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return handleAdminError(error);
  }
}
