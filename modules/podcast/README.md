# Módulo `podcast`

Show ALTERNA Podcast + episodios (estados «próximamente» hasta tener audio).

## Rutas

- `/podcasts` — show + listado de episodios
- `/podcasts/[slug]` — ficha con reproductor / capítulos

## Datos

- Modelos Prisma: `Podcast`, `PodcastEpisodio`, `PodcastEpisodioDeporte`
- Fallback: `modules/podcast/data/podcast-fallback.ts`
- Spotify CTA desde `config/site.ts` → `social.spotify`

## Componentes

- `EpisodeCard`, `EpisodePlayer`, `PodcastHeader`
- `PodcastTeaser` (home)
- `SportPodcast` (ficha de deporte)
