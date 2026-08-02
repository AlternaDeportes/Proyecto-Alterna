import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/layout/Hero";
import { DeportesTeaser } from "@/components/sections/DeportesTeaser";
import { HistoriasTeaser } from "@/components/sections/HistoriasTeaser";
import { PodcastTeaser } from "@/components/sections/PodcastTeaser";
import { DocumentalesTeaser } from "@/components/sections/DocumentalesTeaser";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <main id="contenido-principal">
      <Hero />

      <Section
        tone="paper"
        blobs="section"
        aria-labelledby="manifiesto-titulo"
      >
        <Container>
          <Reveal>
            <Badge variant="mutedLight" className="mb-4">
              Manifiesto
            </Badge>
            <h2
              id="manifiesto-titulo"
              className="ds-display max-w-3xl text-display-sm sm:text-display-md"
            >
              No explicamos reglas.
              <span className="block text-brand-primary">Mostramos personas.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink/75">
              {siteConfig.name} da voz a deportes amateurs y alternativos de{" "}
              {siteConfig.defaultCity.name}. Comunidades reales, historias humanas y el
              esfuerzo de quienes juegan sin reflectores.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section border="y" aria-labelledby="que-es-titulo">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 id="que-es-titulo" className="ds-display text-display-sm text-white sm:text-4xl">
              ¿Qué es {siteConfig.name}?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              Una narrativa transmedia donde la web es el centro: el mapa, las historias y
              la comunidad. El documental, las redes y el podcast amplían el mismo universo.
            </p>
            <ButtonLink href="/comunidad" variant="secondary" className="mt-6">
              Conocé el proyecto
            </ButtonLink>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card surface="paper">
                <h3 className="font-display text-sm font-bold uppercase">Transmedia</h3>
                <p className="mt-2 text-sm text-brand-ink/70">
                  Cada plataforma suma una capa distinta: emoción, territorio, voz y encuentro.
                </p>
              </Card>
              <Card surface="paper" className="sm:translate-y-6">
                <h3 className="font-display text-sm font-bold uppercase">Descubrimiento</h3>
                <p className="mt-2 text-sm text-brand-ink/70">
                  Explorá deportes poco mediáticos y encontrá dónde practicarlos cerca tuyo.
                </p>
              </Card>
            </div>
          </Reveal>
        </Container>
      </Section>

      <DeportesTeaser />
      <DocumentalesTeaser />
      <HistoriasTeaser />
      <PodcastTeaser />

      <Section tone="primary" aria-labelledby="mapa-titulo">
        <Container className="text-center">
          <Reveal>
            <h2 id="mapa-titulo" className="ds-display text-display-sm sm:text-4xl">
              El mapa es el corazón
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/85">
              Filtrá por deporte, explorá puntos en Santa Fe y sumá tu espacio. La exploración
              empieza acá.
            </p>
            <ButtonLink href="/mapa" variant="secondary" size="lg" className="mt-8">
              Abrir mapa interactivo
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>

      <Section border="top" aria-labelledby="comunidad-home-titulo">
        <Container>
          <Reveal>
            <Badge variant="secondary">Comunidad</Badge>
            <h2
              id="comunidad-home-titulo"
              className="mt-3 max-w-2xl ds-display text-display-sm text-white sm:text-4xl"
            >
              Sumate, comentá, aportá
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/70">
              Ingresá con Google para comentar puntos del mapa y proponer nuevos lugares de
              práctica en {siteConfig.defaultCity.name}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/comunidad" variant="secondary" size="lg">
                Ir a Comunidad
              </ButtonLink>
              <ButtonLink href="/ingresar" variant="outline" size="lg">
                Ingresar
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
