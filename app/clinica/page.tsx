import type { Metadata } from "next";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clínica",
  description: `Inscripción abierta a la clínica de Ultimate Frisbee de ${siteConfig.tabName}. Completá tus datos y subí el comprobante.`,
  path: "/clinica",
});

const PASOS = [
  "Abrí el formulario de inscripción.",
  "Completá tus datos.",
  "Subí el comprobante y enviá.",
] as const;

export default function ClinicaPage() {
  const { clinica } = siteConfig;

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Ultimate Frisbee</p>
            <h1 className="ds-display max-w-xl text-display-sm text-brand-ink sm:text-display-md">
              {clinica.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-ink/70">
              La inscripción está abierta. El formulario pide tus datos y el comprobante.
              Se abre en otra pestaña para que todo llegue a la clínica.
            </p>
            <ol className="mt-8 max-w-md space-y-3">
              {PASOS.map((paso, i) => (
                <li key={paso} className="flex gap-3 text-brand-ink/80">
                  <span className="font-display text-sm font-black text-brand-primary">
                    0{i + 1}
                  </span>
                  <span>{paso}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <ButtonLink href="/deportes/ultimate-frisbee" variant="outline" size="lg">
                Ver Ultimate
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Card surface="paper" className="p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-brand-ink">
                Inscripción
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-ink/70">
                Completá el formulario con tu nombre, un contacto y el comprobante.
                Google te puede pedir que entres con una cuenta para subir el archivo.
              </p>
              {clinica.published ? (
                <ButtonLink
                  href={clinica.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="mt-6 h-auto min-h-12 w-full whitespace-normal px-6 py-3 text-center sm:w-auto"
                >
                  Completar la inscripción
                </ButtonLink>
              ) : null}
            </Card>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
