# Módulo `documentales`

Serie documental ALTERNA: trailer + episodios.

## Rutas

- `/documentales` — show + capítulos
- `/documentales/[slug]` — ficha con player (YouTube embed o video HTML5)

## Datos

- Prisma: `Documental`, `DocumentalEpisodio`
- Fallback sin DB + seed
- YouTube CTA desde `config/site.ts`

## Componentes

- `DocEpisodeCard`, `DocVideoPlayer`, `DocumentalHeader`
- `DocumentalesTeaser` (home)
