import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  AuthServiceError,
  verificarEmail,
} from "@/modules/autenticacion/services/usuario-auth.service";
import { VerifyCodeForm } from "@/modules/autenticacion/components/VerifyCodeForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Verificar email",
  description: "Confirmá tu cuenta ALTERNA.",
  path: "/verificar-email",
  index: false,
});

interface VerificarPageProps {
  searchParams: Promise<{ token?: string; code?: string; email?: string }>;
}

export default async function VerificarEmailPage({ searchParams }: VerificarPageProps) {
  const { token, code, email } = await searchParams;
  const raw = (code ?? token ?? "").trim();
  let ok = false;
  const attempted = Boolean(raw);
  let message = "Ingresá el código de 6 dígitos o abrí el enlace del correo.";

  if (raw) {
    try {
      await verificarEmail(raw, email);
      ok = true;
      message = "Email verificado. Ya podés ingresar y participar.";
    } catch (error) {
      message =
        error instanceof AuthServiceError
          ? error.message
          : "No se pudo verificar el email.";
    }
  }

  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Cuenta"
        eyebrowTone="primary"
        title="Verificar email"
        description="Activamos tu cuenta con el código o el enlace que te mandamos."
      />
      <Section tone="paper" density="tight">
        <Container className="max-w-lg">
          <Card surface="paper" className="space-y-4 sm:p-8">
            <p
              className={
                ok
                  ? "rounded-soft border border-brand-secondary/50 bg-brand-secondary/15 px-4 py-3 text-sm text-brand-ink"
                  : attempted
                    ? "rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700"
                    : "rounded-soft border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink/70"
              }
            >
              {message}
            </p>
            {ok ? (
              <ButtonLink href="/ingresar" variant="primary">
                Ir a ingresar
              </ButtonLink>
            ) : (
              <VerifyCodeForm initialEmail={email} />
            )}
          </Card>
        </Container>
      </Section>
    </main>
  );
}
