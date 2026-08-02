import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SportCard } from "@/modules/deportes/components/SportCard";
import { deporteService } from "@/modules/deportes/services/deporte.service";

export async function DeportesTeaser() {
  const deportes = await deporteService.listar();
  const destacados = deportes.filter((d) => d.destacado).slice(0, 3);

  return (
    <Section border="y" aria-labelledby="deportes-teaser">
      <Container>
        <Reveal>
          <Badge variant="soft">Deportes</Badge>
          <h2 id="deportes-teaser" className="mt-3 ds-display text-display-sm text-white sm:text-4xl">
            Deportes destacados
          </h2>
          <p className="mt-3 max-w-xl text-white/65">
            Tres puertas de entrada al universo ALTERNA. Cada una con comunidad, territorio e
            historias propias.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {destacados.map((deporte, i) => (
            <Reveal key={deporte.id} delay={i * 80}>
              <SportCard deporte={deporte} variant="dark" />
            </Reveal>
          ))}
        </div>

        <ButtonLink href="/deportes" variant="outline" size="lg" className="mt-8">
          Ver todos los deportes
        </ButtonLink>
      </Container>
    </Section>
  );
}
