# Módulo `pwa`

Progressive Web App: instalable, iconos, manifest y caché offline básico.

## Qué incluye

| Pieza | Ubicación |
|-------|-----------|
| Web App Manifest | `app/manifest.ts` → `/manifest.webmanifest` |
| Service Worker | `public/sw.js` |
| Iconos | `public/icons/` (192, 512, maskable, apple-touch) |
| Página offline | `/offline` |
| Registro SW | `ServiceWorkerRegister` (solo producción) |
| Prompt instalar | `InstallPrompt` (`beforeinstallprompt`) |

## Comportamiento

- **Navegación:** network-first → fallback a caché o `/offline`
- **Estáticos** (`/_next/static`, `/icons`, `/brand`, `/assets`): cache-first
- **No cachea:** `/api/*`, auth, perfil, panel-admin

## Regenerar iconos

```bash
node scripts/generate-pwa-icons.mjs
```

## Probar

1. `npm run build && npm start` (HTTPS o localhost)
2. Chrome DevTools → Application → Manifest / Service Workers
3. “Add to Home Screen” / Instalar
