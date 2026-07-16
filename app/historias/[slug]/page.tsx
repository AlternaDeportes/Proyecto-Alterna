import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
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

      <article className="border-b border-white/10 bg-white py-14 text-brand-ink sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 48)} className="mt-5 text-base leading-relaxed text-brand-ink/80 first:mt-0 sm:text-lg">
              {p}
            </p>
          ))}

          <p className="mt-10 text-sm text-brand-ink/50">
            Relato vinculado a{" "}
            <Link
              href={`/deportes/${historia.deporte.slug}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {historia.deporte.nombre}
            </Link>
            .
          </p>
        </div>
      </article>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <StoryGallery
            items={historia.galeria}
            accentColor={historia.deporte.colorPrimario}
            titulo={historia.titulo}
          />
        </div>
      </section>

      <section className="border-t border-white/10 bg-brand-primary py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-black uppercase text-white">
            Seguí explorando
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/historias" variant="secondary">
              Más historias
            </ButtonLink>
            <ButtonLink href={`/mapa?deporte=${historia.deporte.slug}`} variant="outline">
              Ver en el mapa
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
