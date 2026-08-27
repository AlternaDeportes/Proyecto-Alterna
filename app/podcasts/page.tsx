import type { Metadata } from "next";
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
  description: `Podcast ${siteConfig.name}: en producción. Voces de deportes alternativos en ${siteConfig.defaultCity.name}.`,
  path: "/podcasts",
});

export default async function PodcastsPage() {
  const show = await podcastService.obtenerShow();
  const hayEpisodios = show.episodios.length > 0;

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Container>
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Voces en primera persona</p>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              {show.titulo}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
              {show.descripcion}
            </p>
            {!hayEpisodios ? (
              <p className="mt-6 inline-flex rounded-sm bg-brand-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary">
                En producción
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink
                href={siteConfig.social.spotify}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
              >
                Seguir en Spotify
              </ButtonLink>
              <ButtonLink href="/comunidad" variant="outline" size="lg">
                Comunidad
              </ButtonLink>
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
                <h2 className="ds-display text-2xl text-brand-ink">Todavía no hay episodios</h2>
                <p className="mt-4 text-brand-ink/70">
                  Estamos produciendo el podcast. Cuando haya audio publicado, va a aparecer
                  acá. Mientras tanto podés seguir el perfil en Spotify o sumarte a la
                  comunidad.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </main>
  );
}
