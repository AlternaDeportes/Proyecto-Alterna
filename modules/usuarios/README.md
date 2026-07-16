# Módulo `usuarios`

Perfil de cuenta, favoritos y aportes al mapa del usuario autenticado.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/perfil` | Perfil (auth; noindex) |
| `GET /api/usuarios/favoritos` | Listar favoritos |
| `POST /api/usuarios/favoritos` | Toggle favorito (`deporte` \| `historia` \| `ubicacion`) |

## Requisitos

- Auth Google configurada (`AUTH_*`)
- `DATABASE_URL` + sync de usuario al ingresar
- `ADMIN_EMAILS` (opcional) promueve a ADMIN al upsert

## Componentes

- `FavoriteButton` — guardar / quitar favorito (deportes e historias)
