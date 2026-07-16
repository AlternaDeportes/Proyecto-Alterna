import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo/metadata";
import { DocVideoPlayer } from "@/modules/documentales/components/DocVideoPlayer";
import {
  documentalService,
  formatDuracionVideo,
} from "@/modules/documentales/services/documental.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await documentalService.listarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episodio = await documentalService.obtenerEpisodio(slug);

  if (!episodio) {
    return { title: "Capítulo no encontrado", robots: { index: false } };
  }

  return buildPageMetadata({
    title: episodio.titulo,
    description:
      episodio.sinopsis ??
      `${episodio.titulo} — documental ${siteConfig.name}.`,
    path: `/documentales/${episodio.slug}`,
    type: "article",
  });
}

export default async function DocumentalEpisodioPage({ params }: PageProps) {
  const { slug } = await params;
  const episodio = await documentalService.obtenerEpisodio(slug);

  if (!episodio) {
    notFound();
  }

  const meta =
    episodio.numero === 0
      ? "Trailer"
      : `Episodio ${String(episodio.numero).padStart(2, "0")}`;

  return (
    <main id="contenido-principal">
      <JsonLdScript
        id={`ld-doc-${episodio.slug}`}
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TVEpisode",
            name: episodio.titulo,
            description: episodio.sinopsis,
            url: absoluteUrl(`/documentales/${episodio.slug}`),
            episodeNumber: episodio.numero,
            partOfSeries: {
              "@type": "TVSeries",
              name: episodio.documental.titulo,
              url: absoluteUrl("/documentales"),
            },
          },
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Documental", path: "/documentales" },
            { name: episodio.titulo, path: `/documentales/${episodio.slug}` },
          ]),
        ]}
      />

      <header className="border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Badge variant="secondary">
            {meta}
            {episodio.proximo ? " · Próximamente" : ""}
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-black uppercase text-white sm:text-5xl">
            {episodio.titulo}
          </h1>
          {episodio.sinopsis ? (
            <p className="mt-4 text-lg text-white/75">{episodio.sinopsis}</p>
          ) : null}
          <p className="mt-4 text-sm text-white/50">
            {episodio.documental.titulo}
            {episodio.duracionSeg
              ? ` · ${formatDuracionVideo(episodio.duracionSeg)}`
              : ""}
          </p>
        </div>
      </header>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <DocVideoPlayer
            titulo={episodio.titulo}
            videoUrl={episodio.videoUrl}
            proximo={episodio.proximo}
          />

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/documentales" variant="outline">
              Todos los capítulos
            </ButtonLink>
            <ButtonLink
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              YouTube
            </ButtonLink>
            <ButtonLink href="/historias" variant="ghost">
              Leer historias
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
