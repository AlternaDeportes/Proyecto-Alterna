# Módulo `comunidad`

Participación: sumarse al proyecto, proponer puntos al mapa y comentar ubicaciones.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/comunidad` | Hub de participación |
| `POST /api/comunidad/sumarse` | Formulario de intención (público) |
| `POST /api/comunidad/ubicaciones` | Proponer punto (auth + DB) |
| `GET/POST /api/comunidad/comentarios` | Listar / crear comentarios (POST auth + DB) |

## Requisitos

- **Sumarse:** no requiere login
- **Proponer punto / comentar:** requiere sesión Google + `DATABASE_URL` + seed (`npm run db:push` / `db:seed`)
- Puntos nuevos quedan en `moderacion: PENDIENTE` hasta el panel admin (M15)

## Componentes

- `JoinCTA` — acciones principales
- `SumarseForm` — intención de participar
- `ProposeLocationForm` — alta de ubicaciones
- `LocationComments` — comentarios en panel del mapa
