import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { historiaService } from "@/modules/historias/services/historia.service";

/**
 * Capítulo Voces — retratos y citas, no fichas.
 */
export async function VocesChapter() {
  const historias = await historiaService.destacadas(4);

  if (!historias.length) return null;

  return (
    <section
      className="relative bg-brand-surface py-20 text-brand-ink sm:py-28"
      aria-labelledby="voces-capitulo"
    >
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-4">
                <BrandIcon id="pasion" size="sm" />
              </div>
              <h2
                id="voces-capitulo"
                className="ds-display max-w-xl text-display-sm sm:text-display-md"
              >
                Quiénes hacen vivo el juego
              </h2>
              <p className="mt-4 max-w-md text-brand-ink/70">
                Jugadoras, entrenadores y referentes de Santa Fe. Entrá a cada historia y
                escuchá cómo se vive el deporte desde adentro.
              </p>
            </div>
            <Link
              href="/historias"
              className="rounded-sm text-sm font-semibold uppercase tracking-wider text-brand-accent transition-colors hover:text-brand-ink focus-ring"
            >
              Todas las historias →
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {historias.map((historia, i) => (
            <Reveal key={historia.id} delay={i * 70}>
              <Link
                href={`/historias/${historia.slug}`}
                className="group block rounded-frame focus-ring"
              >
                <div className="ds-frame ds-frame--paper relative aspect-[4/5] overflow-hidden bg-brand-ink sm:aspect-[3/4]">
                  {historia.coverUrl ? (
                    <Image
                      src={historia.coverUrl}
                      alt={historia.titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="ds-media-zoom object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(160deg, ${historia.deporte.colorPrimario}, var(--color-brand-ink))`,
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-brand-ink/20 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                      {historia.deporte.nombre}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-black uppercase text-white sm:text-2xl">
                      {historia.titulo}
                    </h3>
                    {historia.pullQuote ? (
                      <p className="mt-3 line-clamp-3 text-sm italic leading-relaxed text-white/80">
                        «{historia.pullQuote}»
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
