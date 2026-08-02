import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SportCard } from "@/modules/deportes/components/SportCard";
import { deporteService } from "@/modules/deportes/services/deporte.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Deportes",
  description: `Deportes alternativos y amateurs en ${siteConfig.defaultCity.name}. Explorá disciplinas, historias y dónde practicarlas.`,
  path: "/deportes",
});

export default async function DeportesPage() {
  const deportes = await deporteService.listar();

  return (
    <main id="contenido-principal">
      <PageHeader
        eyebrow="Explorá"
        title="Deportes por descubrir"
        description={`Tres disciplinas poco mediáticas, muy vivas en ${siteConfig.defaultCity.name}. Elegí la que te intrigue — o probá las tres.`}
      />

      <Section aria-label="Listado de deportes" density="tight">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deportes.map((deporte, i) => (
            <Reveal key={deporte.id} delay={i * 70}>
              <SportCard deporte={deporte} variant="dark" />
            </Reveal>
          ))}
        </Container>
        <Container className="mt-10">
          <ButtonLink href="/mapa" variant="outline" size="lg">
            Verlos en el mapa
          </ButtonLink>
        </Container>
      </Section>
    </main>
  );
}
