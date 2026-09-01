import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { documentaryCovers, IMAGE_QUALITY } from "@/config/media";
import { isTeaserLive, siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { documentalService } from "@/modules/documentales/services/documental.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Documental",
  description: `Documental ${siteConfig.name}. Teaser: ${siteConfig.teaser.label}. Ultimate, Newcom y Wingfoil en ${siteConfig.defaultCity.name}.`,
  path: "/documentales",
});

export default async function DocumentalesPage() {
  const show = await documentalService.obtenerShow();
  const hayEpisodios = show.episodios.length > 0;
  const live = isTeaserLive();

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
              {live
                ? "El teaser ya está en YouTube. La serie sigue a quienes juegan ultimate, newcom y wingfoil en Santa Fe."
                : `El teaser se estrena el ${siteConfig.teaser.label} en Argentina.`}
            </p>
            {!hayEpisodios ? (
              <p className="mt-6 inline-flex rounded-sm bg-brand-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-ink">
                {live ? "Teaser en YouTube" : `Teaser · ${siteConfig.teaser.shortLabel}`}
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
                {live ? "Ver el teaser" : "Seguir en YouTube"}
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
              <Link
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block max-w-3xl overflow-hidden rounded-frame bg-brand-ink focus-ring"
              >
                <div className="relative aspect-video">
                  <Image
                    src={documentaryCovers.trailer}
                    alt="Teaser ALTERNA — Ultimate en Santa Fe"
                    fill
                    sizes="(max-width: 768px) 100vw, 48rem"
                    quality={IMAGE_QUALITY}
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/20 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
                      {live ? "Disponible en YouTube" : "Estreno"}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-black uppercase text-white sm:text-3xl">
                      Teaser
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-white/80">
                      {live
                        ? "Mirá el primer vistazo al documental."
                        : siteConfig.teaser.label}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}
        </Container>
      </section>
    </main>
  );
}
