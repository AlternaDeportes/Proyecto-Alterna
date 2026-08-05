import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
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

      <header className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="ds-container max-w-3xl">
          <p className="ds-eyebrow ds-eyebrow--primary mb-4">
            Episodio {episodio.numero}
            {episodio.proximo ? " · Próximamente" : ""}
          </p>
          <h1 className="ds-display text-display-sm text-brand-ink sm:text-display-md">
            {episodio.titulo}
          </h1>
          {episodio.descripcion ? (
            <p className="mt-5 text-lg leading-relaxed text-brand-ink/70">{episodio.descripcion}</p>
          ) : null}
          <p className="mt-4 text-sm text-brand-ink/45">
            {episodio.podcast.titulo}
            {episodio.duracionSeg
              ? ` · ${formatDuracion(episodio.duracionSeg)}`
              : ""}
          </p>
          {episodio.deportes.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {episodio.deportes.map((d) => (
                <Link
                  key={d.slug}
                  href={`/deportes/${d.slug}`}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white focus-ring"
                  style={{ backgroundColor: d.colorPrimario }}
                >
                  {d.nombre}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <section className="py-14 sm:py-16">
        <div className="ds-container max-w-3xl space-y-8">
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
