import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { breadcrumbJsonLd, sportJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SportHero } from "@/modules/deportes/components/SportHero";
import { SportMeta } from "@/modules/deportes/components/SportMeta";
import {
  SportHistorias,
  SportUbicaciones,
} from "@/modules/deportes/components/SportSections";
import { SportPodcast } from "@/modules/deportes/components/SportPodcast";
import { deporteService } from "@/modules/deportes/services/deporte.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await deporteService.listarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const deporte = await deporteService.obtenerPorSlug(slug);

  if (!deporte) {
    return { title: "Deporte no encontrado", robots: { index: false } };
  }

  return buildPageMetadata({
    title: deporte.nombre,
    description: deporte.seoDescription ?? deporte.descripcion,
    path: `/deportes/${deporte.slug}`,
    type: "article",
  });
}

export default async function DeporteDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const deporte = await deporteService.obtenerPorSlug(slug);

  if (!deporte) {
    notFound();
  }

  return (
    <main id="contenido-principal">
      <JsonLdScript
        id={`ld-sport-${deporte.slug}`}
        data={[
          sportJsonLd({
            name: deporte.nombre,
            description: deporte.descripcion,
            slug: deporte.slug,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Deportes", path: "/deportes" },
            { name: deporte.nombre, path: `/deportes/${deporte.slug}` },
          ]),
        ]}
      />
      <SportHero deporte={deporte} />

      <Section tone="paper" density="tight" aria-labelledby="historia-deporte">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Reveal>
            <p className="ds-eyebrow mb-4 !text-brand-primary">La historia</p>
            <h2
              id="historia-deporte"
              className="ds-display text-display-sm text-brand-ink sm:text-4xl"
            >
              Por qué se quedan
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-ink/80">
              {deporte.historia ?? deporte.descripcion}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <SportMeta deporte={deporte} />
          </Reveal>
        </Container>
      </Section>

      <Section border="y" density="tight" aria-labelledby="mirada-deporte">
        <Container>
          <Reveal>
            <p className="ds-eyebrow mb-4">Mirada</p>
            <h2
              id="mirada-deporte"
              className="ds-display text-2xl text-brand-ink sm:text-3xl"
            >
              Escena de la disciplina
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
              <MediaImage
                src={deporte.coverUrl}
                alt={deporte.nombre}
                accentColor={deporte.colorPrimario}
                tone="ink"
                ratio="video"
                sizes="(max-width: 768px) 100vw, 60vw"
                frameClassName="min-h-[280px]"
              />
              <div
                className="ds-frame ds-frame--ink relative flex min-h-[280px] flex-col justify-end overflow-hidden p-6"
                style={{
                  background: `linear-gradient(160deg, ${deporte.colorPrimario}88, var(--color-brand-ink))`,
                }}
              >
                {deporte.coverUrl ? (
                  <Image
                    src={deporte.coverUrl}
                    alt=""
                    fill
                    className="object-cover opacity-30 mix-blend-luminosity"
                    aria-hidden
                  />
                ) : null}
                <p className="relative z-raised text-sm font-semibold uppercase tracking-wider text-white/70">
                  Color de la disciplina
                </p>
                <p className="relative z-raised mt-2 font-display text-3xl font-black uppercase text-white">
                  {deporte.nombre}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section density="tight">
        <Container className="space-y-20">
          <SportUbicaciones
            ubicaciones={deporte.ubicaciones}
            deporteSlug={deporte.slug}
            accentColor={deporte.colorPrimario}
          />
          <SportHistorias
            historias={deporte.historias}
            colorPrimario={deporte.colorPrimario}
          />
          <SportPodcast deporteSlug={deporte.slug} />
        </Container>
      </Section>

      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: deporte.colorPrimario }}
      >
        <Container className="text-center">
          <h2 className="ds-display text-2xl text-white sm:text-3xl">
            ¿Te copa {deporte.nombre}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Encontrá dónde practicarlo y sumate a la comunidad.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`/mapa?deporte=${deporte.slug}`} variant="secondary" size="lg">
              Abrir en el mapa
            </ButtonLink>
            <ButtonLink href="/comunidad" variant="outlineLight" size="lg">
              Comunidad
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
