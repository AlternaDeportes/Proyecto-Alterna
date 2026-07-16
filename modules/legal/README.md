# Módulo `legal-cookies`

Páginas legales y consentimiento de cookies.

## Rutas

- `/privacidad`
- `/terminos`
- `/cookies`

## Componentes

- `CookieBanner` — banner de consentimiento + botón para cambiar preferencia
- `AnalyticsGate` — hook post-consentimiento (listo para Plausible/GA)
- `LegalDocument` — plantilla tipográfica de documentos legales

## Almacenamiento

`localStorage` clave `alterna-cookie-consent`:

```json
{ "version": 1, "necessary": true, "analytics": false, "decidedAt": "..." }
```

Las cookies de sesión Auth.js son necesarias y no dependen de analytics.
