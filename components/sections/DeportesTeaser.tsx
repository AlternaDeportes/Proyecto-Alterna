import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SportCard } from "@/modules/deportes/components/SportCard";
import { deporteService } from "@/modules/deportes/services/deporte.service";

export async function DeportesTeaser() {
  const deportes = await deporteService.listar();
  const destacados = deportes.filter((d) => d.destacado).slice(0, 3);

  return (
    <section className="border-y border-white/10 py-20 sm:py-24" aria-labelledby="deportes-teaser">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Badge variant="secondary">Deportes</Badge>
          <h2
            id="deportes-teaser"
            className="mt-3 font-display text-3xl font-black uppercase text-white sm:text-4xl"
          >
            Deportes destacados
          </h2>
          <p className="mt-3 max-w-xl text-white/65">
            Tres puertas de entrada al universo ALTERNA. Cada una con comunidad,
            territorio e historias propias.
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
      </div>
    </section>
  );
}
