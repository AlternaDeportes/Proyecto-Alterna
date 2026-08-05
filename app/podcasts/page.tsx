import type { Metadata } from "next";
import Image from "next/image";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { EpisodeCard } from "@/modules/podcast/components/EpisodeCard";
import { podcastService } from "@/modules/podcast/services/podcast.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Podcast",
  description: `Podcast ${siteConfig.name}: charlas con referentes de deportes alternativos en ${siteConfig.defaultCity.name}.`,
  path: "/podcasts",
});

export default async function PodcastsPage() {
  const show = await podcastService.obtenerShow();

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Container className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Voces en primera persona</p>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              {show.titulo}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
              {show.descripcion}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink
                href={siteConfig.social.spotify}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
              >
                Abrir en Spotify
              </ButtonLink>
              <ButtonLink href="/documentales" variant="outline" size="lg">
                Ver documental
              </ButtonLink>
            </div>
          </Reveal>
          {show.coverUrl ? (
            <Reveal delay={80}>
              <div className="ds-frame ds-frame--primary relative mx-auto aspect-square max-w-xs overflow-hidden shadow-lift lg:max-w-sm">
                <Image
                  src={show.coverUrl}
                  alt=""
                  fill
                  priority
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <Section aria-label="Episodios" density="tight">
        <Container>
          <h2 className="ds-display text-2xl text-brand-ink">Episodios</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {show.episodios.map((ep, i) => (
              <Reveal key={ep.id} delay={i * 50}>
                <EpisodeCard episodio={ep} destacada={i === 0} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
