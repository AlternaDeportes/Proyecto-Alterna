import { Prisma } from "@prisma/client";

/** Filtro estándar: excluye registros con soft delete */
export const sinEliminados = {
  deletedAt: null,
} as const;

/** Helper para marcar soft delete en updates Prisma */
export function marcarEliminado() {
  return { deletedAt: new Date() };
}

export type { Prisma };
