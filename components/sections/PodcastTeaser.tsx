import { EpisodeCard } from "@/modules/podcast/components/EpisodeCard";
import { podcastService } from "@/modules/podcast/services/podcast.service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export async function PodcastTeaser() {
  const show = await podcastService.obtenerShow();
  const episodios = show.episodios.slice(0, 2);

  if (!episodios.length) return null;

  return (
    <section
      className="border-y border-white/10 py-20 sm:py-24"
      aria-labelledby="podcast-home-titulo"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="secondary">Podcast</Badge>
              <h2
                id="podcast-home-titulo"
                className="mt-3 font-display text-3xl font-black uppercase text-white sm:text-4xl"
              >
                Voces en primera persona
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/70">
                Charlas con entrenadores, jugadoras y referentes para ampliar la historia más
                allá de la imagen.
              </p>
            </div>
            <ButtonLink href="/podcasts" variant="outline" size="sm">
              Ver podcast
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {episodios.map((ep, i) => (
            <Reveal key={ep.id} delay={i * 70}>
              <EpisodeCard episodio={ep} destacada={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
