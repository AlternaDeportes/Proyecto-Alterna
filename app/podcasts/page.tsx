import type { Metadata } from "next";
import Image from "next/image";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { EpisodeCard } from "@/modules/podcast/components/EpisodeCard";
import { podcastService } from "@/modules/podcast/services/podcast.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Podcast",
  description: `${siteConfig.podcastShow.title}, el podcast de ${siteConfig.tabName}. Voces de ultimate, newcom y wingfoil en ${siteConfig.defaultCity.name}.`,
  path: "/podcasts",
  image: siteConfig.podcastShow.cover,
});

export default async function PodcastsPage() {
  const show = await podcastService.obtenerShow();
  const hayEpisodios = show.episodios.length > 0;
  const spotify = siteConfig.podcastShow;

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Container>
          <Reveal>
            <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
              <a
                href={spotify.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-frame ds-frame--paper relative mx-auto block aspect-square w-44 overflow-hidden shadow-lift focus-ring sm:mx-0 sm:w-52"
              >
                <Image
                  src={spotify.cover}
                  alt={`Portada de ${spotify.title} en Spotify`}
                  fill
                  priority
                  sizes="208px"
                  className="object-cover"
                />
              </a>
              <div>
                <p className="ds-eyebrow ds-eyebrow--primary mb-4">Voces en primera persona</p>
                <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
                  {spotify.title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
                  {show.descripcion}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink
                    href={spotify.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="lg"
                  >
                    Escuchar en Spotify
                  </ButtonLink>
                  <ButtonLink href="/comunidad" variant="outline" size="lg">
                    Sumate
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-label="Episodios">
        <Container>
          {hayEpisodios ? (
            <>
              <h2 className="ds-display text-2xl text-brand-ink">Episodios</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {show.episodios.map((ep, i) => (
                  <Reveal key={ep.id} delay={i * 50}>
                    <EpisodeCard episodio={ep} destacada={i === 0} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal>
              <div className="max-w-xl border border-brand-ink/10 bg-white p-8 sm:p-10">
                <h2 className="ds-display text-2xl text-brand-ink">Escuchalo en Spotify</h2>
                <p className="mt-4 text-brand-ink/70">
                  Los episodios están en Spotify, con la misma portada del show. Entrá a
                  escuchar y, si querés sumar tu voz, escribinos.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </main>
  );
}
