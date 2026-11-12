import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ResetPasswordForm } from "@/modules/autenticacion/components/ResetPasswordForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Nueva contraseña",
  description: "Elegí una contraseña nueva para tu cuenta ALTERNA.",
  path: "/recuperar/nueva",
  index: false,
});

interface NuevaPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function NuevaPasswordPage({ searchParams }: NuevaPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Cuenta"
        eyebrowTone="primary"
        title="Nueva contraseña"
        description="Elegí una clave de al menos 8 caracteres."
      />
      <Section tone="paper" density="tight">
        <Container className="max-w-lg">
          <Card surface="paper" className="sm:p-8">
            {token ? (
              <ResetPasswordForm token={token} />
            ) : (
              <p className="text-sm text-brand-ink/70">
                Falta el token. Pedí un enlace nuevo desde Recuperar contraseña.
              </p>
            )}
          </Card>
        </Container>
      </Section>
    </main>
  );
}
