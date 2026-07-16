# ALTERNA Web

Plataforma transmedia **ALTERNA** — *Deportes por descubrir.*

## Stack

- **Frontend:** Next.js 15 · React 19 · TypeScript · Tailwind CSS
- **Deploy:** Vercel (principal)
- **Base de datos:** Neon PostgreSQL
- **Portabilidad:** Docker `standalone` — migrable a AWS, Railway, DigitalOcean o VPS

## Inicio rápido — ver la web

```bash
cd "PAGINA WEB"
copy .env.example .env.local
npm install
npm run dev
```

Abrir **http://localhost:3000**

> La carpeta del proyecto es `PAGINA WEB`. Todos los comandos se ejecutan desde ahí.

## Base de datos (opcional para ver deportes desde DB)

Ver `prisma/README.md`. Resumen:

```bash
# En .env.local: DATABASE_URL=postgresql://...
npm run db:push
npm run db:seed
```

Verificar: http://localhost:3000/api/health/database

## Configuración centralizada

| Archivo | Contenido |
|---------|-----------|
| `config/site.ts` | Nombre, tagline, contacto, redes (placeholders) |
| `config/design-tokens.ts` | Colores y tipografías del manual |
| `config/env.ts` | Validación de variables de entorno (Zod) |

## Estructura

```
PAGINA WEB/
├── app/              # App Router (páginas)
├── components/       # UI compartida
├── modules/          # Dominios de negocio
├── config/           # Configuración centralizada
├── lib/              # Utilidades transversales
├── public/           # Assets estáticos
├── prisma/           # Schema DB (Módulo database)
├── _referencia/      # Prototipo HTML estático (no producción)
└── middleware.ts     # Headers de seguridad
```

## Deploy en Vercel

1. Root directory: `PAGINA WEB`
2. Variables: copiar desde `.env.example`
3. `DATABASE_URL` desde Neon

## Roadmap

Ver [`../ROADMAP.md`](../ROADMAP.md)
