import type { Metadata } from "next";
import Image from "next/image";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { documentalService } from "@/modules/documentales/services/documental.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Documental",
  description: `Serie documental ${siteConfig.name}: trailer y episodios sobre deportes alternativos en ${siteConfig.defaultCity.name}.`,
  path: "/documentales",
});

export default async function DocumentalesPage() {
  const show = await documentalService.obtenerShow();
  const trailer =
    show.episodios.find((e) => e.numero === 0) ?? show.episodios[0] ?? null;

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Container className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
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
            <div className="mt-8 flex flex-wrap gap-4">
              {trailer ? (
                <ButtonLink href={`/documentales/${trailer.slug}`} variant="accent" size="lg">
                  Empezar por el trailer
                </ButtonLink>
              ) : null}
              <ButtonLink
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
              >
                YouTube
              </ButtonLink>
            </div>
          </Reveal>
          {(trailer?.coverUrl ?? show.coverUrl) ? (
            <Reveal delay={80}>
              <div className="ds-frame ds-frame--accent relative aspect-video overflow-hidden shadow-lift">
                <Image
                  src={(trailer?.coverUrl ?? show.coverUrl)!}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <Section density="tight" aria-label="Capítulos">
        <Container>
          <h2 className="ds-display text-2xl text-brand-ink">Capítulos</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {show.episodios.map((ep, i) => (
              <Reveal key={ep.id} delay={i * 50}>
                <DocEpisodeCard episodio={ep} destacada={i === 0} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
