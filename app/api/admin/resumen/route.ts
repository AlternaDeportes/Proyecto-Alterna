import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth-guards";
import { handleAdminError } from "@/modules/administracion/lib/api-errors";
import { adminService } from "@/modules/administracion/services/admin.service";

export const dynamic = "force-dynamic";

/** GET /api/admin/resumen */
export async function GET() {
  try {
    await requireStaff();
    const data = await adminService.obtenerResumen();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return handleAdminError(error);
  }
}
