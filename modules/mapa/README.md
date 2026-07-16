# Módulo mapa

Hub interactivo de ALTERNA — Leaflet + OpenStreetMap (CARTO tiles).

| Capa | Archivo |
|------|---------|
| Ruta | `app/mapa/page.tsx` |
| API | `app/api/mapa/ubicaciones/route.ts` |
| Servicio | `services/ubicacion.service.ts` |
| UI | `components/MapExplorer.tsx`, `MapFilters.tsx`, `LocationPanel.tsx` |
| Fallback | `data/ubicaciones-fallback.ts` |

## URL

- `/mapa` — todos los deportes
- `/mapa?deporte=ultimate-frisbee` — filtro preseleccionado

## Dependencias

- `leaflet`, `react-leaflet`

El mapa se carga solo en cliente (`dynamic` + `ssr: false`).
