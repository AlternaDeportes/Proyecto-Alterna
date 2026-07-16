import { prisma } from "@/lib/prisma";
import type { AuditAccion } from "@prisma/client";

interface AuditInput {
  accion: AuditAccion;
  entidad: string;
  entidadId?: string;
  usuarioId?: string;
  payload?: Record<string, unknown>;
}

export const auditRepository = {
  async registrar(datos: AuditInput) {
    return prisma.auditLog.create({
      data: {
        accion: datos.accion,
        entidad: datos.entidad,
        entidadId: datos.entidadId,
        usuarioId: datos.usuarioId,
        payload: datos.payload as object | undefined,
      },
    });
  },
};
