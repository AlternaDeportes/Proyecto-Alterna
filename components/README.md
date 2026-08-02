# Componentes compartidos — Design System ALTERNA

## `components/brand/`

| Componente | Uso |
|------------|-----|
| `BrandLogo` | Wordmark oficial (PNG transparente del manual). Variantes `blanco` / `azul`. |

## `components/ui/` — Átomos del sistema

| Componente | Archivo | Uso |
|------------|---------|-----|
| Button / ButtonLink | `button.tsx` | CTAs |
| Card (`surface`: ink \| paper \| plain) | `card.tsx` | Superficies |
| Badge (`primary` \| `secondary` \| `accent` \| `soft` \| `muted` \| `mutedLight`) | `badge.tsx` | Eyebrows, chips, estados |
| Container | `container.tsx` | Ancho + gutters |
| Section | `section.tsx` | Ritmo vertical, tono, blobs, patrones |
| PageHeader | `page-header.tsx` | Cabecera de página unificada |
| PhotoFrame | `photo-frame.tsx` | Marcos fotográficos de marca |
| BrandPattern | `brand-pattern.tsx` | Patrones dots/grid |
| BlobBackground | `blob-background.tsx` | Blobs orgánicos (tokens) |
| Reveal | `reveal.tsx` | Entrada sutil |

## `components/layout/`

Navbar (con BrandLogo), Footer, Hero, HeroVideo, SiteShell.

## Tokens

Fuente de verdad: `config/design-tokens.ts` → Tailwind + `app/globals.css`.

**No hardcodear hex de marca.** Importar desde tokens o usar clases `brand.*` / `sport.*`.

Los componentes de negocio viven en `modules/<dominio>/components/`.
