import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CardLight } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
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

  const description = deporte.seoDescription ?? deporte.descripcion;

  return buildPageMetadata({
    title: deporte.nombre,
    description,
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

      <section className="border-b border-white/10 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-black uppercase text-brand-ink">
              La historia
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-ink/80">
              {deporte.historia ?? deporte.descripcion}
            </p>
          </Reveal>
          <div className="mt-10">
            <SportMeta deporte={deporte} />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="muted">Multimedia</Badge>
            <h2 className="mt-3 font-display text-2xl font-black uppercase text-white">
              Galería y video
            </h2>
            <CardLight className="mt-6 border-dashed">
              <p className="text-sm text-brand-ink/70">
                Contenido audiovisual en producción. Próximamente fotos y clips del
                documental ALTERNA.
              </p>
            </CardLight>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-20 px-4 sm:px-6">
          <SportUbicaciones
            ubicaciones={deporte.ubicaciones}
            deporteSlug={deporte.slug}
          />
          <SportHistorias
            historias={deporte.historias}
            colorPrimario={deporte.colorPrimario}
          />
          <SportPodcast deporteSlug={deporte.slug} />
        </div>
      </section>

      <section className="border-t border-white/10 bg-brand-primary py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-black uppercase text-white">
            ¿Te copa {deporte.nombre}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">
            Encontrá dónde practicarlo y sumate a la comunidad ALTERNA.
          </p>
          <ButtonLink href="/mapa" variant="secondary" size="lg" className="mt-6">
            Explorar en el mapa
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
