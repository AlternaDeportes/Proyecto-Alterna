import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { BlobBackground } from "@/components/ui/blob-background";
import { Reveal } from "@/components/ui/reveal";
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
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <PodcastHeader show={show} />
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-label="Episodios">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-black uppercase text-white">
            Episodios
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {show.episodios.map((ep, i) => (
              <Reveal key={ep.id} delay={i * 50}>
                <EpisodeCard episodio={ep} destacada={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
