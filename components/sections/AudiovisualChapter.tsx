import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { documentalService } from "@/modules/documentales/services/documental.service";

/**
 * Capítulo audiovisual — estado real (en producción o trailer publicado).
 */
export async function AudiovisualChapter() {
  const show = await documentalService.obtenerShow();
  const trailer = show.episodios.find((e) => e.numero === 0) ?? show.episodios[0] ?? null;

  return (
    <section
      className="relative overflow-hidden bg-brand-surface py-20 sm:py-28"
      aria-labelledby="audiovisual-capitulo"
    >
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container className="relative z-raised">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <div className="ds-frame ds-frame--accent relative flex aspect-video flex-col items-center justify-center overflow-hidden bg-brand-ink px-8 text-center shadow-lift">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
                {trailer ? "Disponible" : "En producción"}
              </p>
              <p className="mt-4 font-display text-2xl font-black uppercase text-white sm:text-3xl">
                {trailer ? trailer.titulo : "Documental y teaser"}
              </p>
              <p className="mt-3 max-w-sm text-sm text-white/70">
                {trailer
                  ? "Mirá el material publicado."
                  : "Estamos filmando y editando. Todavía no hay trailer ni episodios online."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2
              id="audiovisual-capitulo"
              className="ds-display text-display-sm text-brand-ink sm:text-display-md"
            >
              La mirada documental
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-ink/70">
              {show.sinopsis}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              {trailer ? (
                <ButtonLink href={`/documentales/${trailer.slug}`} variant="accent" size="lg">
                  Ver capítulo
                </ButtonLink>
              ) : (
                <ButtonLink
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="accent"
                  size="lg"
                >
                  Seguir en YouTube
                </ButtonLink>
              )}
              <Link
                href="/documentales"
                className="rounded-sm text-sm font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-ink focus-ring"
              >
                Más sobre el documental →
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
