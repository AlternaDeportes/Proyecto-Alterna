import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { EpisodeCard } from "@/modules/podcast/components/EpisodeCard";
import { PodcastHeader } from "@/modules/podcast/components/PodcastHeader";
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
      <Section tone="ink" border="bottom" blobs="section" className="pt-28 sm:pt-32">
        <Container>
          <Reveal>
            <PodcastHeader show={show} />
          </Reveal>
        </Container>
      </Section>

      <Section aria-label="Episodios" density="tight">
        <Container>
          <h2 className="ds-display text-2xl text-white">Episodios</h2>
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
