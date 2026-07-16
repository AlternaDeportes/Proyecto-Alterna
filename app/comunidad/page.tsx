import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { BlobBackground } from "@/components/ui/blob-background";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
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
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="secondary">Participá</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Comunidad
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              Sumate al mapa, comentá en los puntos deportivos y participá de{" "}
              {siteConfig.name}. Para comentar o agregar actividades necesitás iniciar
              sesión con Google.
            </p>
            <div className="mt-8">
              <JoinCTA autenticado={autenticado} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/10 py-16 sm:py-20" aria-labelledby="como-titulo">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2
              id="como-titulo"
              className="font-display text-2xl font-black uppercase text-white sm:text-3xl"
            >
              Cómo participar
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PASOS.map((paso, i) => (
              <Reveal key={paso.titulo} delay={i * 70}>
                <Card className="h-full border-white/10 bg-white/[0.04] p-5">
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
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-label="Formularios de participación">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SumarseForm />
          </Reveal>
          <Reveal delay={80}>
            <ProposeLocationForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
