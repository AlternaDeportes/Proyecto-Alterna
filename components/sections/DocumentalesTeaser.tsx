import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { documentalService } from "@/modules/documentales/services/documental.service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export async function DocumentalesTeaser() {
  const show = await documentalService.obtenerShow();
  const episodios = show.episodios.slice(0, 3);

  if (!episodios.length) return null;

  return (
    <Section border="y" aria-labelledby="documental-home-titulo">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="soft">Documental</Badge>
              <h2
                id="documental-home-titulo"
                className="mt-3 ds-display text-display-sm text-white sm:text-4xl"
              >
                Narrativa audiovisual
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/70">
                Trailer y episodios para profundizar en las historias humanas detrás de cada
                disciplina.
              </p>
            </div>
            <ButtonLink href="/documentales" variant="outline" size="sm">
              Ver documental
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {episodios.map((ep, i) => (
            <Reveal key={ep.id} delay={i * 60}>
              <DocEpisodeCard episodio={ep} destacada={i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
