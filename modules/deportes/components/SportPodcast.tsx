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
          <h2
            id="podcast-deporte"
            className="font-display text-2xl font-black uppercase text-white sm:text-3xl"
          >
            Podcast
          </h2>
          <p className="mt-2 text-white/65">
            Episodios relacionados con esta disciplina.
          </p>
        </div>
        <Link
          href="/podcasts"
          className="text-sm font-semibold text-brand-secondary hover:underline"
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
