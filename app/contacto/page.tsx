import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ContactChannels } from "@/modules/contacto/components/ContactChannels";
import { ContactForm } from "@/modules/contacto/components/ContactForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto",
  description: `Escribinos, seguinos en redes o colaborá con ${siteConfig.name}. Deportes alternativos en ${siteConfig.defaultCity.name}.`,
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-20">
        <Container>
          <Reveal>
            <BrandIcon id="comunidadRed" size="md" className="mb-5" />
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Hablemos</p>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              Contacto
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-ink/70">
              Formulario, correo o redes: elegí cómo querés acercarte al proyecto.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section aria-label="Canales de contacto" density="tight">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={80}>
            <ContactChannels />
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
