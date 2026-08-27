# Módulo `administracion`

Panel interno para staff (ADMIN / MODERATOR): moderación, comunidad, catálogo y métricas.

## Dónde está

| Ruta | Descripción |
|------|-------------|
| `/panel-admin` | Dashboard (auth staff; noindex) |
| `/panel-admin?tab=moderacion` | Cola de puntos y comentarios |
| `/panel-admin?tab=mensajes` | Bandeja de contacto |
| `/panel-admin?tab=comunidad` | Usuarios |
| `/panel-admin?tab=contenido` | Inventario editorial |
| `/panel-admin?tab=metricas` | Visitas, comparativa mensual, CSV |
| `/panel-admin?tab=auditoria` | Acciones del staff |
| `GET /api/admin/resumen` | Contadores |
| `GET /api/admin/ubicaciones` | Puntos (`?estado=PENDIENTE`) |
| `PATCH /api/admin/ubicaciones/[id]` | `{ "accion": "aprobar" \| "rechazar" }` |
| `GET /api/admin/comentarios` | Comentarios |
| `PATCH /api/admin/comentarios/[id]` | `{ "accion": "aprobar" \| "rechazar" }` |
| `GET /api/admin/mensajes` | Mensajes de contacto |
| `PATCH /api/admin/mensajes/[id]` | `{ "leido": true \| false }` |
| `POST /api/analytics/visita` | Pageview first-party (post-consentimiento) |

## Acceso

1. Configurar `ADMIN_EMAILS=tu@email.com` en `.env.local`
2. Ingresar con Google (upsert asigna rol ADMIN)
3. Abrir `/panel-admin` o el link **Admin** en el menú

## Alcance actual

- Moderación de puntos del mapa y comentarios (cola + historial)
- Mensajes de contacto / sumarse
- Usuarios, favoritos y aportes
- Inventario de deportes, historias, podcast, documentales y eventos
- Métricas propias: visitas, sesiones, dispositivos, top páginas, comparativa vs mes anterior
- Export CSV para el cierre mensual
- Auditoría de acciones de staff

CRUD editorial (crear/editar fichas) y analytics de player/mapa fino quedan para una iteración posterior.
