import { StoryCard } from "@/modules/historias/components/StoryCard";
import { historiaService } from "@/modules/historias/services/historia.service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

/** Bloque de historias destacadas para la home */
export async function HistoriasTeaser() {
  const historias = await historiaService.destacadas(4);

  if (!historias.length) return null;

  return (
    <Section tone="paper" border="y" aria-labelledby="historias-home-titulo">
      <Container>
        <Reveal>
          <Badge variant="mutedLight">Voces</Badge>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="historias-home-titulo"
                className="ds-display text-display-sm sm:text-4xl"
              >
                Historias destacadas
              </h2>
              <p className="mt-3 max-w-xl text-base text-brand-ink/70">
                Personas reales del documental. Sus voces sostienen cada plataforma de ALTERNA.
              </p>
            </div>
            <ButtonLink href="/historias" variant="outlineDark" size="sm">
              Ver todas
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {historias.map((historia, i) => (
            <Reveal key={historia.id} delay={i * 60}>
              <StoryCard historia={historia} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
