import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { RecuperarForm } from "@/modules/autenticacion/components/RecuperarForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Recuperar contraseña",
  description: "Pedí un enlace para elegir una contraseña nueva.",
  path: "/recuperar",
  index: false,
});

export default function RecuperarPage() {
  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Cuenta"
        eyebrowTone="primary"
        title="Recuperar contraseña"
        description="Te mandamos un enlace al email. También sirve para crear una clave si tu cuenta nació con Google."
      />
      <Section tone="paper" density="tight">
        <Container className="max-w-lg">
          <Card surface="paper" className="space-y-5 sm:p-8">
            <RecuperarForm />
            <p className="text-center text-sm text-brand-ink/55">
              <Link href="/ingresar" className="font-semibold text-brand-primary hover:underline">
                Volver a ingresar
              </Link>
            </p>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
