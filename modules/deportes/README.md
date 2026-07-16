# Módulo deportes

| Capa | Archivo |
|------|---------|
| Rutas | `app/deportes/page.tsx`, `app/deportes/[slug]/page.tsx` |
| Servicio | `services/deporte.service.ts` |
| Repositorio | `repositories/deporte.repository.ts` |
| Validación | `validations/deporte.schema.ts` |
| Tipos | `types/index.ts` |
| Fallback | `data/deportes-fallback.ts` |
| UI | `components/SportCard.tsx`, `SportHero.tsx`, `SportMeta.tsx`, `SportSections.tsx` |

## URLs

- `/deportes` — listado
- `/deportes/ultimate-frisbee`
- `/deportes/newcom`
- `/deportes/wingfoil`

Funciona con PostgreSQL o datos fallback si no hay `DATABASE_URL`.
