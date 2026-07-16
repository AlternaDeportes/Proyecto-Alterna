import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo/metadata";
import { EpisodePlayer } from "@/modules/podcast/components/EpisodePlayer";
import {
  formatDuracion,
  podcastService,
} from "@/modules/podcast/services/podcast.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await podcastService.listarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episodio = await podcastService.obtenerEpisodio(slug);

  if (!episodio) {
    return { title: "Episodio no encontrado", robots: { index: false } };
  }

  return buildPageMetadata({
    title: episodio.titulo,
    description:
      episodio.descripcion ??
      `Episodio ${episodio.numero} del podcast ${siteConfig.name}.`,
    path: `/podcasts/${episodio.slug}`,
    type: "article",
  });
}

export default async function PodcastEpisodioPage({ params }: PageProps) {
  const { slug } = await params;
  const episodio = await podcastService.obtenerEpisodio(slug);

  if (!episodio) {
    notFound();
  }

  return (
    <main id="contenido-principal">
      <JsonLdScript
        id={`ld-podcast-${episodio.slug}`}
        data={[
          {
            "@context": "https://schema.org",
            "@type": "PodcastEpisode",
            name: episodio.titulo,
            description: episodio.descripcion,
            url: absoluteUrl(`/podcasts/${episodio.slug}`),
            episodeNumber: episodio.numero,
            duration: episodio.duracionSeg
              ? `PT${Math.floor(episodio.duracionSeg / 60)}M`
              : undefined,
            partOfSeries: {
              "@type": "PodcastSeries",
              name: episodio.podcast.titulo,
              url: absoluteUrl("/podcasts"),
            },
          },
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Podcast", path: "/podcasts" },
            { name: episodio.titulo, path: `/podcasts/${episodio.slug}` },
          ]),
        ]}
      />

      <header className="border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Badge variant="secondary">
            Episodio {episodio.numero}
            {episodio.proximo ? " · Próximamente" : ""}
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-black uppercase text-white sm:text-5xl">
            {episodio.titulo}
          </h1>
          {episodio.descripcion ? (
            <p className="mt-4 text-lg text-white/75">{episodio.descripcion}</p>
          ) : null}
          <p className="mt-4 text-sm text-white/50">
            {episodio.podcast.titulo}
            {episodio.duracionSeg
              ? ` · ${formatDuracion(episodio.duracionSeg)}`
              : ""}
          </p>
          {episodio.deportes.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {episodio.deportes.map((d) => (
                <Link
                  key={d.slug}
                  href={`/deportes/${d.slug}`}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: `${d.colorPrimario}99` }}
                >
                  {d.nombre}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <EpisodePlayer
            titulo={episodio.titulo}
            audioUrl={episodio.audioUrl}
            proximo={episodio.proximo}
            capitulos={episodio.capitulos}
          />

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/podcasts" variant="outline">
              Todos los episodios
            </ButtonLink>
            <ButtonLink
              href={siteConfig.social.spotify}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              Spotify
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
