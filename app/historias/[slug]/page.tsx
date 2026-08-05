import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { articleJsonLd } from "@/lib/seo/article-json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { StoryGallery } from "@/modules/historias/components/StoryGallery";
import { StoryHero } from "@/modules/historias/components/StoryHero";
import { historiaService } from "@/modules/historias/services/historia.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await historiaService.listarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const historia = await historiaService.obtenerPorSlug(slug);

  if (!historia) {
    return { title: "Historia no encontrada", robots: { index: false } };
  }

  return buildPageMetadata({
    title: historia.seoTitle ?? historia.titulo,
    description: historia.seoDescription ?? historia.excerpt,
    path: `/historias/${historia.slug}`,
    type: "article",
  });
}

export default async function HistoriaDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const historia = await historiaService.obtenerPorSlug(slug);

  if (!historia) {
    notFound();
  }

  const paragraphs = historia.cuerpo.split(/\n\n+/).filter(Boolean);

  return (
    <main id="contenido-principal">
      <JsonLdScript
        id={`ld-historia-${historia.slug}`}
        data={[
          articleJsonLd({
            title: historia.titulo,
            description: historia.excerpt,
            slug: historia.slug,
            publishedAt: historia.publishedAt,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Historias", path: "/historias" },
            { name: historia.titulo, path: `/historias/${historia.slug}` },
          ]),
        ]}
      />

      <StoryHero historia={historia} />

      <article className="border-b border-brand-ink/10 bg-brand-surface py-16 text-brand-ink sm:py-24">
        <Container narrow>
          {paragraphs.map((p, i) => (
            <p
              key={p.slice(0, 48)}
              className={
                i === 0
                  ? "text-xl font-medium leading-relaxed text-brand-ink/90 sm:text-2xl"
                  : "mt-6 text-base leading-relaxed text-brand-ink/75 sm:text-lg"
              }
            >
              {p}
            </p>
          ))}

          <p className="mt-12 border-t border-brand-ink/10 pt-8 text-sm text-brand-ink/50">
            Relato vinculado a{" "}
            <Link
              href={`/deportes/${historia.deporte.slug}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {historia.deporte.nombre}
            </Link>
            .
          </p>
        </Container>
      </article>

      <section className="bg-brand-ink py-16 sm:py-20">
        <Container>
          <StoryGallery
            items={historia.galeria}
            accentColor={historia.deporte.colorPrimario}
            titulo={historia.titulo}
          />
        </Container>
      </section>

      <section
        className="py-16"
        style={{ backgroundColor: historia.deporte.colorPrimario }}
      >
        <Container className="text-center">
          <h2 className="ds-display text-2xl text-white">Seguí explorando</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/historias" variant="secondary">
              Más historias
            </ButtonLink>
            <ButtonLink
              href={`/mapa?deporte=${historia.deporte.slug}`}
              variant="outlineLight"
            >
              Ver en el mapa
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
