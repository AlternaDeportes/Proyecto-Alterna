import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JoinCTA } from "@/modules/comunidad/components/JoinCTA";
import { ProposeLocationForm } from "@/modules/comunidad/components/ProposeLocationForm";
import { SumarseForm } from "@/modules/comunidad/components/SumarseForm";
import { brandToneAt } from "@/config/brand-assets";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Comunidad",
  description: `Sumate a ${siteConfig.name}: comentá, proponé un lugar o contanos tu historia. El puente entre quien juega y quien quiere empezar, en ${siteConfig.defaultCity.name}.`,
  path: "/comunidad",
});

const PASOS = [
  {
    titulo: "Explorá",
    texto: "Abrí el mapa, filtrá por deporte y encontrá la cancha, el club o la costa.",
    icon: "mapaPuente" as const,
  },
  {
    titulo: "Ingresá",
    texto: "Con tu cuenta podés comentar puntos y proponer lugares nuevos.",
    icon: "comunidadRed" as const,
  },
  {
    titulo: "Participá",
    texto: "Sumá tu espacio o escribinos tu historia. El puente funciona cuando vos también lo cruzás.",
    icon: "comunidadPersonas" as const,
  },
] as const;

const toneText = {
  primary: "text-brand-primary",
  secondary: "text-brand-primary",
  accent: "text-brand-accent",
} as const;

export default async function ComunidadPage() {
  const session = await auth();
  const autenticado = Boolean(session?.user);

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-20">
        <Container>
          <Reveal>
            <BrandIcon id="comunidadPersonas" size="lg" className="mb-6" />
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Participá</p>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              El puente se arma entre todos
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-ink/70">
              De un lado, quien juega. Del otro, quien quiere empezar. En el medio, este
              espacio: comentá un punto, proponé un lugar o contanos tu historia.
            </p>
            <div className="mt-8">
              <JoinCTA autenticado={autenticado} />
            </div>
          </Reveal>
        </Container>
      </section>

      <Section border="bottom" aria-labelledby="como-titulo" density="tight">
        <Container>
          <Reveal>
            <h2 id="como-titulo" className="ds-display text-2xl text-brand-ink sm:text-3xl">
              Cómo participar
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {PASOS.map((paso, i) => {
              const tone = brandToneAt(i);
              return (
                <Reveal key={paso.titulo} delay={i * 70}>
                  <li>
                    <BrandIcon id={paso.icon} size="md" className="mb-4" />
                    <span className={cn("font-display text-4xl font-black", toneText[tone])}>
                      0{i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-sm font-bold uppercase text-brand-ink">
                      {paso.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{paso.texto}</p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </Section>

      <Section aria-label="Formularios" density="tight">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SumarseForm />
          </Reveal>
          <Reveal delay={80}>
            <div id="sumar-punto">
              <ProposeLocationForm />
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
