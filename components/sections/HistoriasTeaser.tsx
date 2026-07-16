import { StoryCard } from "@/modules/historias/components/StoryCard";
import { historiaService } from "@/modules/historias/services/historia.service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/** Bloque de historias destacadas para la home */
export async function HistoriasTeaser() {
  const historias = await historiaService.destacadas(4);

  if (!historias.length) return null;

  return (
    <section
      className="border-y border-white/10 bg-white py-20 text-brand-ink sm:py-24"
      aria-labelledby="historias-home-titulo"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Badge variant="mutedLight">Voces</Badge>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="historias-home-titulo"
                className="font-display text-3xl font-black uppercase sm:text-4xl"
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
      </div>
    </section>
  );
}
