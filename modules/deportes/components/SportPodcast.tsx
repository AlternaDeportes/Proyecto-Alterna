import Link from "next/link";
import { EpisodeCard } from "@/modules/podcast/components/EpisodeCard";
import { podcastService } from "@/modules/podcast/services/podcast.service";
import { Reveal } from "@/components/ui/reveal";

interface SportPodcastProps {
  deporteSlug: string;
}

export async function SportPodcast({ deporteSlug }: SportPodcastProps) {
  const episodios = await podcastService.listarEpisodios(deporteSlug);
  if (!episodios.length) return null;

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
          <p className="mt-2 text-brand-ink/65">
            Episodios relacionados con esta disciplina.
          </p>
        </div>
        <Link
          href="/podcasts"
          className="rounded-sm text-sm font-semibold text-brand-primary hover:underline focus-ring"
        >
          Ver todos →
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {episodios.map((ep, i) => (
          <Reveal key={ep.id} delay={i * 50}>
            <EpisodeCard episodio={ep} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
