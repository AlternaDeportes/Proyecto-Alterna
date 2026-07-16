# Módulo `contacto`

Formulario de contacto, canales directos y API para recibir mensajes.

## Rutas

- `/contacto` — página con formulario + email/redes desde `config/site.ts`
- `POST /api/contacto` — procesa el envío

## Flujo

1. Validación Zod (`contactoFormSchema`)
2. Guardado en `ContactoMensaje` si hay `DATABASE_URL`
3. Notificación por email vía `lib/email/` (Resend o consola en dev)

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Persistir mensajes en PostgreSQL |
| `RESEND_API_KEY` | Enviar email real |
| `EMAIL_FROM` | Remitente verificado en Resend |

Sin Resend, el provider de consola registra el mensaje en logs del servidor.

## Admin

Los mensajes guardados se gestionarán desde el panel admin (M15).
