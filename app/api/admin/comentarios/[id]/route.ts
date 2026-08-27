import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth-guards";
import { handleAdminError } from "@/modules/administracion/lib/api-errors";
import { adminService } from "@/modules/administracion/services/admin.service";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** PATCH /api/admin/comentarios/[id] — aprobar | rechazar */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireStaff();
    const { id } = await context.params;
    const body = await request.json();
    const data = await adminService.moderarComentario(id, body, session.user.id);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return handleAdminError(error);
  }
}
