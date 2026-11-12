import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { sportGallery } from "@/config/media";
import { breadcrumbJsonLd, sportJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SportGuia } from "@/modules/deportes/components/SportGuia";
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

  const galeria = sportGallery(deporte.slug);
  const principal = galeria[0]?.src ?? deporte.coverUrl;

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

      <Section density="tight" aria-labelledby="guia-deporte">
        <Container>
          <Reveal>
            <SportGuia slug={deporte.slug} nombre={deporte.nombre} />
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
              Así se ve
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {galeria.length ? (
                galeria.map((foto, i) => (
                  <li
                    key={`${foto.src}-${foto.label}`}
                    className={i === 0 ? "sm:col-span-2" : undefined}
                  >
                    <figure className="ds-frame ds-frame--ink overflow-hidden bg-brand-ink">
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        width={foto.width}
                        height={foto.height}
                        quality={88}
                        className="h-auto w-full"
                        sizes={
                          i === 0
                            ? "(max-width: 640px) 100vw, 72rem"
                            : "(max-width: 640px) 100vw, 36rem"
                        }
                        priority={i === 0}
                      />
                      <figcaption className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white sm:px-4 sm:text-xs">
                        {foto.label}
                      </figcaption>
                    </figure>
                  </li>
                ))
              ) : principal ? (
                <li className="sm:col-span-2">
                  <MediaImage
                    src={principal}
                    alt={deporte.nombre}
                    accentColor={deporte.colorPrimario}
                    tone="ink"
                    ratio="video"
                    sizes="100vw"
                    frameClassName="min-h-0 aspect-[4/3] sm:aspect-video"
                  />
                </li>
              ) : null}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Section density="tight">
        <Container className="space-y-12">
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
        className="py-12 sm:py-14"
        style={{ backgroundColor: deporte.colorPrimario }}
      >
        <Container className="text-center">
          <h2 className="ds-display text-2xl text-white sm:text-3xl">
            ¿Te copa {deporte.nombre}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            {deporte.slug === "ultimate-frisbee"
              ? "Mirá el documental y, si te copa, andá a la cancha."
              : "Encontrá a quien ya lo juega y sumate. El documental muestra cómo se vive."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/documentales" variant="secondary" size="lg">
              Ver el documental
            </ButtonLink>
            <ButtonLink href={`/mapa?deporte=${deporte.slug}`} variant="outlineLight" size="lg">
              Encontrá el lugar
            </ButtonLink>
            <ButtonLink href="/comunidad" variant="outlineLight" size="lg">
              Sumate
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
