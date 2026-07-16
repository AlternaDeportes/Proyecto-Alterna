# Módulo `historias`

Relatos editoriales de protagonistas del documental ALTERNA.

## Rutas

- `/historias` — listado (filtro opcional `?deporte=slug`)
- `/historias/[slug]` — ficha con pull quote, cuerpo y galería placeholder

## Datos

- DB: modelo `Historia` (publicado + soft delete)
- Fallback sin DB: `modules/historias/data/historias-fallback.ts`
- Seed reutiliza los cuerpos editoriales del fallback

## Componentes

- `StoryCard`, `StoryHero`, `StoryGallery`
- `HistoriasTeaser` en la home
