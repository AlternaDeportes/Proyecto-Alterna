import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JoinCTA } from "@/modules/comunidad/components/JoinCTA";
import { ProposeLocationForm } from "@/modules/comunidad/components/ProposeLocationForm";
import { SumarseForm } from "@/modules/comunidad/components/SumarseForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Comunidad",
  description: `Sumate a ${siteConfig.name}: mapa colaborativo, comentarios y participación en deportes alternativos de ${siteConfig.defaultCity.name}.`,
  path: "/comunidad",
});

const PASOS = [
  {
    titulo: "Explorá",
    texto: "Abrí el mapa, filtrá por deporte y encontrá dónde practicar cerca tuyo.",
  },
  {
    titulo: "Ingresá",
    texto: "Con Google podés comentar puntos y proponer nuevos lugares de práctica.",
  },
  {
    titulo: "Participá",
    texto: "Sumá tu espacio, contanos tu historia o colaborá con el proyecto documental.",
  },
] as const;

export default async function ComunidadPage() {
  const session = await auth();
  const autenticado = Boolean(session?.user);

  return (
    <main id="contenido-principal">
      <PageHeader
        eyebrow="Participá"
        title="Comunidad"
        description={`Sumate al mapa, comentá en los puntos deportivos y participá de ${siteConfig.name}. Para comentar o agregar actividades necesitás iniciar sesión con Google.`}
      >
        <div className="mt-8">
          <JoinCTA autenticado={autenticado} />
        </div>
      </PageHeader>

      <Section border="bottom" aria-labelledby="como-titulo" density="tight">
        <Container>
          <Reveal>
            <h2 id="como-titulo" className="ds-display text-2xl text-white sm:text-3xl">
              Cómo participar
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PASOS.map((paso, i) => (
              <Reveal key={paso.titulo} delay={i * 70}>
                <Card surface="ink" className="h-full">
                  <span className="font-display text-3xl font-black text-brand-secondary">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 font-display text-sm font-bold uppercase text-white">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-white/65">{paso.texto}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-label="Formularios de participación" density="tight">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SumarseForm />
          </Reveal>
          <Reveal delay={80}>
            <ProposeLocationForm />
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
