import { ColorStripe } from "@/components/brand/ColorStripe";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { documentaryCovers } from "@/config/media";
import { siteConfig, teaserWatchUrl } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/metadata";
import { TeaserPlayer } from "@/modules/documentales/components/TeaserPlayer";

/**
 * Bloque temporal de home: el teaser se mira acá, primero, sin salir del sitio.
 */
export function TeaserChapter() {
  return (
    <section
      id="teaser"
      className="relative scroll-mt-20 overflow-hidden bg-brand-ink pt-28 pb-16 sm:pt-32 sm:pb-24"
      aria-labelledby="teaser-titulo"
    >
      <JsonLdScript
        id="ld-teaser"
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: siteConfig.teaser.title,
          description:
            "Primer vistazo al documental ALTERNA: ultimate, newcom y wingfoil en Santa Fe.",
          thumbnailUrl: absoluteUrl(documentaryCovers.trailer),
          embedUrl: `https://www.youtube.com/embed/${siteConfig.teaser.youtubeId}`,
          contentUrl: teaserWatchUrl(),
          uploadDate: "2026-09-16",
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
          },
        }}
      />
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container className="relative z-raised">
        <Reveal>
          <p className="ds-eyebrow ds-eyebrow--lime mb-4">{siteConfig.teaser.label}</p>
          <h2
            id="teaser-titulo"
            className="ds-display max-w-3xl text-display-sm text-white sm:text-display-md"
          >
            El teaser ya está en YouTube
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Mirá acá el primer vistazo al documental. La serie sigue a quienes juegan
            ultimate, newcom y wingfoil en Santa Fe.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <TeaserPlayer featured />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <ButtonLink
              href={teaserWatchUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              Abrir en YouTube
            </ButtonLink>
            <ButtonLink href="/documentales" variant="ghostLight" size="lg">
              Más sobre el documental
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
