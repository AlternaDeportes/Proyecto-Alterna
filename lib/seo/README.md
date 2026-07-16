# SEO (M3)

Helpers de metadatos, Schema.org, sitemap y robots.

## Archivos

| Archivo | Rol |
|---------|-----|
| `lib/seo/metadata.ts` | `getSiteUrl`, `buildPageMetadata`, `buildRootMetadata` |
| `lib/seo/json-ld.ts` | Organization, WebSite, Breadcrumb, Sport |
| `components/seo/JsonLdScript.tsx` | Inyección segura de JSON-LD |
| `app/sitemap.ts` | `/sitemap.xml` |
| `app/robots.ts` | `/robots.txt` |
| `app/opengraph-image.tsx` | Imagen OG 1200×630 |

## URL canónica

Prioridad: `NEXT_PUBLIC_SITE_URL` → `config/site.ts` (`siteConfig.url`).

En producción, seteá el dominio real en `.env`:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

## Verificar

- http://localhost:3000/sitemap.xml
- http://localhost:3000/robots.txt
- http://localhost:3000/opengraph-image
- Ver código fuente: scripts `application/ld+json`
