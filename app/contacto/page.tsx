import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { BlobBackground } from "@/components/ui/blob-background";
import { Reveal } from "@/components/ui/reveal";
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
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="secondary">Hablemos</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Contacto
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              Formulario, correo directo o redes: elegí cómo querés acercarte al proyecto.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-label="Canales de contacto">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={80}>
            <ContactChannels />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
