import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { auth, isAuthConfigured } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LoginButton } from "@/modules/autenticacion/components/LoginButton";
import { SignOutButton } from "@/modules/autenticacion/components/SignOutButton";

export const metadata: Metadata = buildPageMetadata({
  title: "Ingresar",
  description: `Iniciá sesión en ${siteConfig.name} con tu cuenta de Google para participar de la comunidad.`,
  path: "/ingresar",
  index: false,
});

interface IngresarPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function IngresarPage({ searchParams }: IngresarPageProps) {
  const { error, callbackUrl } = await searchParams;
  const session = await auth();
  const authReady = isAuthConfigured();

  return (
    <main id="contenido-principal">
      <PageHeader
        eyebrow="Comunidad"
        title="Ingresar"
        description="Usá tu cuenta de Google para comentar, sumar puntos al mapa y guardar favoritos cuando esas funciones estén disponibles."
      />

      <Section density="tight">
        <Container className="max-w-lg">
          <Reveal>
            <Card surface="ink" className="sm:p-8">
              {session?.user ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full border border-white/20 object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="font-display text-lg font-bold text-white">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-white/60">{session.user.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-brand-secondary">
                        {session.user.rol}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">
                    Ya estás dentro. Podés comentar en el mapa y proponer puntos desde Comunidad.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <ButtonLink href="/comunidad" variant="primary">
                      Ir a Comunidad
                    </ButtonLink>
                    <ButtonLink href="/mapa" variant="outline">
                      Abrir mapa
                    </ButtonLink>
                    <SignOutButton />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    Continuar con Google
                  </h2>
                  <p className="text-sm text-white/65">
                    Solo usamos tu nombre, email y foto de perfil. No publicamos nada sin tu
                    acción.
                  </p>

                  {error ? (
                    <p
                      className="rounded-soft border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                      role="alert"
                    >
                      No se pudo iniciar sesión. Revisá las credenciales de Google o intentá de
                      nuevo.
                    </p>
                  ) : null}

                  {authReady ? (
                    <LoginButton
                      className="w-full"
                      callbackUrl={callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/"}
                    />
                  ) : (
                    <div className="space-y-3 rounded-soft border border-brand-accent/30 bg-brand-accent/10 px-4 py-4 text-sm text-white/85">
                      <p className="font-semibold text-brand-accent">Auth aún no configurado</p>
                      <p>
                        En <code className="text-white/90">.env.local</code> agregá:
                      </p>
                      <ul className="list-inside list-disc space-y-1 text-white/70">
                        <li>
                          <code>AUTH_SECRET</code>
                        </li>
                        <li>
                          <code>AUTH_GOOGLE_ID</code>
                        </li>
                        <li>
                          <code>AUTH_GOOGLE_SECRET</code>
                        </li>
                      </ul>
                      <p className="text-white/55">
                        Creá credenciales OAuth en Google Cloud Console (redirect URI:{" "}
                        <code className="text-white/80">
                          {siteConfig.url}/api/auth/callback/google
                        </code>
                        ).
                      </p>
                    </div>
                  )}

                  <p className="text-center text-xs text-white/45">
                    Al ingresar aceptás los{" "}
                    <Link href="/terminos" className="underline hover:text-white">
                      términos
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" className="underline hover:text-white">
                      privacidad
                    </Link>
                    .
                  </p>
                </div>
              )}
            </Card>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
