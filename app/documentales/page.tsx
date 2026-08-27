import type { Metadata } from "next";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { documentalService } from "@/modules/documentales/services/documental.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Documental",
  description: `Documental ${siteConfig.name}: en producción. Ultimate, Newcom y Wingfoil en ${siteConfig.defaultCity.name}.`,
  path: "/documentales",
});

export default async function DocumentalesPage() {
  const show = await documentalService.obtenerShow();
  const hayEpisodios = show.episodios.length > 0;

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Container>
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--accent mb-4">Narrativa audiovisual</p>
            <h1 className="ds-display text-display-sm text-brand-ink sm:text-display-md">
              Documental
            </h1>
            <p className="mt-3 font-display text-lg font-bold text-brand-primary">
              {show.titulo}
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-ink/70">
              {show.sinopsis}
            </p>
            {!hayEpisodios ? (
              <p className="mt-6 inline-flex rounded-sm bg-brand-accent/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-ink">
                En producción
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                size="lg"
              >
                Seguir en YouTube
              </ButtonLink>
              <ButtonLink href="/deportes" variant="outline" size="lg">
                Ver los deportes
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-label="Capítulos">
        <Container>
          {hayEpisodios ? (
            <>
              <h2 className="ds-display text-2xl text-brand-ink">Capítulos</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {show.episodios.map((ep, i) => (
                  <Reveal key={ep.id} delay={i * 50}>
                    <DocEpisodeCard episodio={ep} destacada={i === 0} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal>
              <div className="max-w-xl border border-brand-ink/10 bg-white p-8 sm:p-10">
                <h2 className="ds-display text-2xl text-brand-ink">
                  Trailer y capítulos en producción
                </h2>
                <p className="mt-4 text-brand-ink/70">
                  Todavía no hay video publicado. Cuando el teaser o los episodios estén
                  listos, van a aparecer acá. Podés seguir el canal de YouTube para enterarte.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </main>
  );
}
