import type { Metadata } from "next";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ClinicBand } from "@/components/clinic/ClinicBand";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { documentalEmbedUrl, documentalWatchUrl, siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { TeaserPlayer } from "@/modules/documentales/components/TeaserPlayer";
import { documentalService } from "@/modules/documentales/services/documental.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Documental",
  description: `Documental ${siteConfig.name}, para ver en la web. Ultimate, Newcom y Wingfoil en ${siteConfig.defaultCity.name}.`,
  path: "/documentales",
});

export default async function DocumentalesPage() {
  const show = await documentalService.obtenerShow();
  const episodios = show.episodios.filter(
    (ep) => ep.slug !== "trailer" && ep.slug !== "documental"
  );
  const hayEpisodios = episodios.length > 0;

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-24 pb-10 sm:pt-28 sm:pb-12">
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
              {show.sinopsis ||
                "El documental ya se ve acá. Mirá a quienes juegan ultimate, newcom y wingfoil en Santa Fe, y después andá a buscarlos."}
            </p>
            <p className="mt-6 inline-flex rounded-sm bg-brand-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-ink">
              Para ver en la web
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink
                href={documentalWatchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                size="lg"
              >
                Abrir en YouTube
              </ButtonLink>
              <ButtonLink href="/clinica" variant="secondary" size="lg">
                Ver la clínica
              </ButtonLink>
              <ButtonLink href="/mapa" variant="outline" size="lg">
                Encontrá dónde juegan
              </ButtonLink>
            </div>
          </Reveal>
          <div className="mt-10 overflow-hidden rounded-sm">
            <div className="ds-frame ds-frame--primary overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={documentalEmbedUrl()}
                  title={siteConfig.documental.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14" aria-label="Teaser y capítulos">
        <Container>
          <Reveal>
            <h2 className="ds-display text-2xl text-brand-ink">Teaser</h2>
            <p className="mt-3 max-w-xl text-brand-ink/70">
              Primer vistazo, si querés entrar por la versión corta.
            </p>
            <div className="mt-8 max-w-4xl">
              <TeaserPlayer featured />
            </div>
          </Reveal>

          {hayEpisodios ? (
            <div className="mt-16">
              <h2 className="ds-display text-2xl text-brand-ink">Capítulos</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {episodios.map((ep, i) => (
                  <Reveal key={ep.id} delay={i * 50}>
                    <DocEpisodeCard episodio={ep} destacada={i === 0} />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>
      <ClinicBand />
    </main>
  );
}
