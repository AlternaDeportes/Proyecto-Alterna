# Módulo `autenticacion`

Login con Google (OAuth) vía Auth.js / NextAuth v5.

## Rutas

- `/ingresar` — pantalla de login / sesión activa
- `GET|POST /api/auth/*` — handlers de Auth.js

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `AUTH_SECRET` | Secreto de sesión (mín. 32 chars) |
| `AUTH_GOOGLE_ID` | Client ID de Google Cloud |
| `AUTH_GOOGLE_SECRET` | Client Secret de Google Cloud |
| `AUTH_URL` | URL pública (opcional; Auth.js usa host actual con `trustHost`) |

Generar secret:

```bash
openssl rand -base64 32
```

Redirect URI en Google Cloud Console:

```
http://localhost:3000/api/auth/callback/google
https://TU_DOMINIO/api/auth/callback/google
```

## Comportamiento

- Sesión **JWT** (portable; no depende de Vercel KV)
- Si hay `DATABASE_URL`, sincroniza usuario en tabla `usuarios` con rol `USER`
- Sin Google configurado, `/ingresar` muestra instrucciones (no rompe el sitio)

## Componentes

- `LoginButton` — dispara `signIn("google")`
- `UserMenu` — estado de sesión en Navbar
- `SignOutButton` — cierra sesión
