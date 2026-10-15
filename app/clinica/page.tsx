import type { Metadata } from "next";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clínica",
  description: `Clínica de Ultimate Frisbee de ${siteConfig.tabName}. La inscripción se abre en esta página.`,
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
        <Container>
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Ultimate Frisbee</p>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              {clinica.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
              La clínica de Ultimate en Santa Fe va a tener la inscripción en esta página.
              Por ahora el lugar está listo y el formulario se suma más adelante.
            </p>
            <ol className="mt-8 max-w-xl space-y-3">
              {PASOS.map((paso, i) => (
                <li key={paso} className="flex gap-3 text-brand-ink/80">
                  <span className="font-display text-sm font-black text-brand-primary">
                    0{i + 1}
                  </span>
                  <span>{paso}</span>
                </li>
              ))}
            </ol>
            <div
              className="mt-10 max-w-xl border border-dashed border-brand-ink/20 bg-white px-6 py-8"
              aria-label="Espacio del formulario"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
                Inscripción
              </p>
              <p className="mt-3 text-brand-ink/70">
                {clinica.published
                  ? "Completá la inscripción en el formulario."
                  : "Acá va el formulario, con tus datos y el comprobante."}
              </p>
              {clinica.published ? (
                <ButtonLink
                  href={clinica.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                  className="mt-6"
                >
                  Completar la inscripción
                </ButtonLink>
              ) : null}
            </div>
            <div className="mt-8">
              <ButtonLink href="/deportes/ultimate-frisbee" variant="outline" size="lg">
                Ver Ultimate
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
