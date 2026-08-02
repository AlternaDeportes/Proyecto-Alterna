import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
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
      <PageHeader
        eyebrow="Hablemos"
        title="Contacto"
        description="Formulario, correo directo o redes: elegí cómo querés acercarte al proyecto."
      />

      <Section aria-label="Canales de contacto" density="tight">
        <Container className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
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
