# Módulo database

Capa de datos compartida: tipos, helpers de soft delete y repositorio de auditoría.

| Archivo | Rol |
|---------|-----|
| `types.ts` | `sinEliminados`, `marcarEliminado()` |
| `repositories/audit.repository.ts` | Log de acciones admin |

Schema y seed: `prisma/`. Cliente singleton: `lib/prisma.ts`.
