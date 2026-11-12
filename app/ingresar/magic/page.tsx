import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { MagicLinkClient } from "@/modules/autenticacion/components/MagicLinkClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Entrar con enlace",
  description: "Completá el ingreso con el enlace enviado a tu email.",
  path: "/ingresar/magic",
  index: false,
});

interface MagicPageProps {
  searchParams: Promise<{ token?: string; callbackUrl?: string }>;
}

export default async function MagicPage({ searchParams }: MagicPageProps) {
  const { token, callbackUrl } = await searchParams;
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Cuenta"
        eyebrowTone="primary"
        title="Enlace de ingreso"
        description="Estamos validando el correo."
      />
      <Section tone="paper" density="tight">
        <Container className="max-w-lg">
          <Card surface="paper" className="sm:p-8">
            {token ? (
              <MagicLinkClient token={token} callbackUrl={safeCallback} />
            ) : (
              <p className="text-sm text-brand-ink/70">
                Falta el token. Pedí un enlace nuevo desde Ingresar.
              </p>
            )}
          </Card>
        </Container>
      </Section>
    </main>
  );
}
