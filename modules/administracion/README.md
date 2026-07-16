# Módulo `administracion`

Panel interno para staff (ADMIN / MODERATOR): moderación del mapa y mensajes de contacto.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/panel-admin` | Dashboard (auth staff; noindex) |
| `GET /api/admin/resumen` | Contadores |
| `GET /api/admin/ubicaciones` | Puntos `PENDIENTE` |
| `PATCH /api/admin/ubicaciones/[id]` | `{ "accion": "aprobar" \| "rechazar" }` |
| `GET /api/admin/mensajes` | Mensajes de contacto |
| `PATCH /api/admin/mensajes/[id]` | `{ "leido": true \| false }` |

## Acceso

1. Configurar `ADMIN_EMAILS=tu@email.com` en `.env.local`
2. Ingresar con Google (upsert asigna rol ADMIN)
3. Abrir `/panel-admin` o el link Admin en el menú

## Alcance actual (MVP)

- Moderación de ubicaciones propuestas
- Lectura / marcar leídos mensajes de contacto
- Resumen de contenido

CRUD completo de deportes/historias/media queda para una iteración posterior.
