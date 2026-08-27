import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { EpisodeCard } from "@/modules/podcast/components/EpisodeCard";
import { podcastService } from "@/modules/podcast/services/podcast.service";

interface SportPodcastProps {
  deporteSlug: string;
}

export async function SportPodcast({ deporteSlug }: SportPodcastProps) {
  const episodios = await podcastService.listarEpisodios(deporteSlug);

  return (
    <section aria-labelledby="podcast-deporte">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ds-eyebrow mb-3">Voces</p>
          <h2
            id="podcast-deporte"
            className="ds-display text-2xl text-brand-ink sm:text-3xl"
          >
            Podcast
          </h2>
          <p className="mt-2 max-w-lg text-brand-ink/65">
            {episodios.length
              ? "Episodios relacionados con esta disciplina."
              : "El podcast está en producción. Cuando haya episodios publicados van a aparecer acá."}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/podcasts"
            className="rounded-sm text-sm font-semibold text-brand-primary hover:underline focus-ring"
          >
            Ir al podcast →
          </Link>
          <a
            href={siteConfig.social.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-sm font-semibold text-brand-ink/55 hover:text-brand-ink focus-ring"
          >
            Spotify
          </a>
        </div>
      </div>
      {episodios.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {episodios.map((ep, i) => (
            <Reveal key={ep.id} delay={i * 50}>
              <EpisodeCard episodio={ep} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}
