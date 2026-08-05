import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { documentalService } from "@/modules/documentales/services/documental.service";

/**
 * Capítulo audiovisual — un trailer dominante, no grilla de episodios.
 */
export async function AudiovisualChapter() {
  const show = await documentalService.obtenerShow();
  const trailer =
    show.episodios.find((e) => e.numero === 0) ?? show.episodios[0] ?? null;

  if (!trailer) return null;

  return (
    <section
      className="relative overflow-hidden bg-brand-surface py-20 sm:py-28"
      aria-labelledby="audiovisual-capitulo"
    >
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container className="relative z-raised">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <Link
              href={`/documentales/${trailer.slug}`}
              className="group relative block rounded-frame focus-ring"
            >
              <div className="ds-frame ds-frame--accent relative aspect-video overflow-hidden bg-brand-primary-deep shadow-lift">
                {trailer.coverUrl || show.coverUrl ? (
                  <Image
                    src={(trailer.coverUrl ?? show.coverUrl)!}
                    alt={trailer.titulo}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="ds-media-zoom object-cover"
                    priority={false}
                  />
                ) : null}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent"
                  aria-hidden
                />
                <span className="absolute bottom-5 left-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-brand-ink shadow-glow-accent transition-transform duration-base group-hover:scale-105">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5L8 5.5z" />
                  </svg>
                  <span className="sr-only">Ver {trailer.titulo}</span>
                </span>
              </div>
            </Link>
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
            <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-ink/50">
              {trailer.etiqueta ?? "Trailer"} · {trailer.titulo}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <ButtonLink href={`/documentales/${trailer.slug}`} variant="accent" size="lg">
                Empezar por el trailer
              </ButtonLink>
              <Link
                href="/podcasts"
                className="rounded-sm text-sm font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-ink focus-ring"
              >
                También en podcast →
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
