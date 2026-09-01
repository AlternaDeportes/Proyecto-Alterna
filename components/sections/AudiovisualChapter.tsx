import Image from "next/image";
import Link from "next/link";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { documentaryCovers, IMAGE_QUALITY } from "@/config/media";
import { isTeaserLive, siteConfig } from "@/config/site";

/**
 * Capítulo audiovisual — teaser con fecha de estreno y portada de Drive.
 */
export function AudiovisualChapter() {
  const live = isTeaserLive();

  return (
    <section
      id="audiovisual-capitulo"
      className="relative scroll-mt-20 overflow-hidden bg-brand-surface py-20 sm:py-28"
      aria-labelledby="audiovisual-titulo"
    >
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container className="relative z-raised">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <Link
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group ds-frame ds-frame--accent relative block aspect-video overflow-hidden bg-brand-ink shadow-lift focus-ring"
            >
              <Image
                src={documentaryCovers.trailer}
                alt="Teaser ALTERNA — Ultimate en Santa Fe"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={IMAGE_QUALITY}
                className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/25 to-transparent"
                aria-hidden
              />
              <span
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-secondary text-brand-ink shadow-glow-secondary transition-transform duration-300 group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 h-7 w-7 fill-current" role="presentation">
                  <path d="M8 5.14v13.72L19.5 12 8 5.14Z" />
                </svg>
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  {live ? "Disponible en YouTube" : "Estreno"}
                </p>
                <p className="mt-2 font-display text-2xl font-black uppercase text-white sm:text-3xl">
                  Teaser
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {live ? "Mirá el primer vistazo al documental." : siteConfig.teaser.label}
                </p>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <h2
              id="audiovisual-titulo"
              className="ds-display text-display-sm text-brand-ink sm:text-display-md"
            >
              La mirada documental
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-ink/70">
              {live
                ? "El teaser ya está en YouTube. La serie sigue a quienes juegan ultimate, newcom y wingfoil en Santa Fe."
                : `El teaser se estrena el ${siteConfig.teaser.label} en Argentina.`}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <ButtonLink
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                size="lg"
              >
                {live ? "Ver el teaser" : "Seguir en YouTube"}
              </ButtonLink>
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
