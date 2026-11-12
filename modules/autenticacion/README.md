# Módulo `autenticacion`

Login con Google (OAuth) y cuenta por email vía Auth.js / NextAuth v5.

## Rutas

- `/ingresar` — Google, email/contraseña, enlace mágico y código de 6 dígitos
- `/verificar-email` — confirma el correo (enlace o código)
- `/recuperar` y `/recuperar/nueva` — restablecer contraseña
- `/ingresar/magic` — consume el enlace de ingreso
- `GET|POST /api/auth/*` — handlers de Auth.js
- `POST /api/auth/registro` — crear cuenta
- `POST /api/auth/magic-link` — pedir enlace de ingreso
- `POST /api/auth/recuperar` — pedir reset
- `POST /api/auth/reset` — guardar nueva contraseña
- `POST /api/auth/verificar/reenviar` — reenviar código
- `POST /api/auth/verificar/codigo` — validar código de 6 dígitos

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `AUTH_SECRET` | Secreto de sesión (mín. 32 chars) |
| `AUTH_GOOGLE_ID` | Client ID de Google Cloud (tipo **Aplicación web**, debe estar habilitado) |
| `AUTH_GOOGLE_SECRET` | Client Secret de Google Cloud |
| `AUTH_URL` | URL pública **de producción** (nunca localhost en Vercel) |
| `NEXT_PUBLIC_SITE_URL` | Igual que `AUTH_URL` en producción |
| `DATABASE_URL` | Necesaria para email/contraseña, códigos y magic link |
| `RESEND_API_KEY` / `EMAIL_FROM` | Emails de verificación, magic link y reset |

Generar secret:

```bash
openssl rand -base64 32
```

Redirect URI en Google Cloud Console (las dos):

```
http://localhost:3000/api/auth/callback/google
https://proyecto-alterna.vercel.app/api/auth/callback/google
```

Orígenes de JavaScript autorizados:

```
http://localhost:3000
https://proyecto-alterna.vercel.app
```

Si Google muestra `401 disabled_client`, el cliente OAuth está apagado o no es de tipo web. Hay que crear uno nuevo y actualizar las variables en Vercel.

En Vercel → Settings → Environment Variables (Production): `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL=https://proyecto-alterna.vercel.app`, `NEXT_PUBLIC_SITE_URL=https://proyecto-alterna.vercel.app`, `DATABASE_URL`, y si hay Resend `RESEND_API_KEY` + `EMAIL_FROM`.

## Comportamiento

- Sesión **JWT** (portable; no depende de Vercel KV)
- Google marca el email como verificado
- Registro por email envía un **código de 6 dígitos** y un enlace (2 h)
- Enlace mágico: entra o crea cuenta y verifica (15 min)
- Reset de contraseña (1 h); también sirve para poner clave a una cuenta de Google
- Sin Google configurado, `/ingresar` igual permite email si hay `DATABASE_URL`

## Componentes

- `LoginButton` — dispara `signIn("google")`
- `EmailAuthForm` — registro, login, enlace y código
- `VerifyCodeForm` — confirma el código de 6 dígitos
- `UserMenu` — estado de sesión en Navbar
- `SignOutButton` — cierra sesión
