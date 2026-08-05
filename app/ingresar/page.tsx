import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { isDatabaseConfigured } from "@/config/env";
import { auth, isAuthConfigured } from "@/lib/auth";
import { getSiteUrl } from "@/lib/seo/metadata";
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
  const dbReady = isDatabaseConfigured();
  const callbackGoogle = `${getSiteUrl()}/api/auth/callback/google`;

  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Comunidad"
        eyebrowTone="primary"
        title="Ingresar"
        description="Creá tu cuenta o entrá con Google para comentar, sumar puntos al mapa y guardar favoritos."
      />

      <Section tone="paper" density="tight">
        <Container className="max-w-lg">
          <Reveal>
            <Card surface="paper" className="sm:p-8">
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
                        className="h-14 w-14 rounded-full border border-brand-ink/15 object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="font-display text-lg font-bold text-brand-ink">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-brand-ink/60">{session.user.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-brand-primary">
                        {session.user.rol}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-brand-ink/70">
                    Ya estás dentro. Podés comentar en el mapa y proponer puntos desde Comunidad.
                    {session.user.rol === "ADMIN" || session.user.rol === "MODERATOR"
                      ? " Como staff, también podés entrar al panel de moderación."
                      : null}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <ButtonLink href="/comunidad" variant="primary">
                      Ir a Comunidad
                    </ButtonLink>
                    <ButtonLink href="/mapa" variant="outline">
                      Abrir mapa
                    </ButtonLink>
                    {session.user.rol === "ADMIN" || session.user.rol === "MODERATOR" ? (
                      <ButtonLink href="/panel-admin" variant="secondary">
                        Panel admin
                      </ButtonLink>
                    ) : null}
                    <SignOutButton />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-brand-ink">
                    Continuar con Google
                  </h2>
                  <p className="text-sm text-brand-ink/65">
                    La primera vez que ingresás se crea tu cuenta automáticamente. Solo usamos
                    nombre, email y foto de perfil.
                  </p>

                  {error ? (
                    <p
                      className="rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700"
                      role="alert"
                    >
                      No se pudo iniciar sesión. Revisá las credenciales de Google en{" "}
                      <code className="text-xs">.env.local</code> o intentá de nuevo.
                    </p>
                  ) : null}

                  {authReady ? (
                    <>
                      {!dbReady ? (
                        <p className="rounded-soft border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-ink/80">
                          Podés ingresar, pero para guardar favoritos, comentar y proponer puntos
                          hace falta configurar <code>DATABASE_URL</code> (Neon) y correr el seed.
                        </p>
                      ) : null}
                      <LoginButton
                        className="w-full"
                        callbackUrl={
                          callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/"
                        }
                      />
                    </>
                  ) : (
                    <div className="space-y-3 rounded-soft border border-brand-accent/40 bg-brand-accent/10 px-4 py-4 text-sm text-brand-ink/85">
                      <p className="font-semibold text-brand-accent">
                        Falta configurar Google OAuth
                      </p>
                      <ol className="list-decimal space-y-2 pl-5 text-brand-ink/75">
                        <li>
                          Entrá a{" "}
                          <a
                            href="https://console.cloud.google.com/apis/credentials"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-primary underline"
                          >
                            Google Cloud Console → Credenciales
                          </a>
                        </li>
                        <li>
                          Creá un <strong>ID de cliente OAuth</strong> tipo «Aplicación web».
                        </li>
                        <li>
                          En «URI de redirección autorizados» agregá exactamente:
                          <code className="mt-1 block break-all rounded-sm bg-white/70 px-2 py-1 text-xs text-brand-ink">
                            {callbackGoogle}
                          </code>
                        </li>
                        <li>
                          Copiá el Client ID y el Client Secret a{" "}
                          <code>.env.local</code> como{" "}
                          <code>AUTH_GOOGLE_ID</code> y <code>AUTH_GOOGLE_SECRET</code>.
                        </li>
                        <li>Reiniciá el servidor (<code>npm run dev</code>) y volvé a esta página.</li>
                      </ol>
                      <p className="text-brand-ink/55">
                        <code>AUTH_SECRET</code> ya puede estar generado. También necesitás{" "}
                        <code>DATABASE_URL</code> para que la cuenta quede guardada en la base.
                      </p>
                    </div>
                  )}

                  <p className="text-center text-xs text-brand-ink/45">
                    Al ingresar aceptás los{" "}
                    <Link href="/terminos" className="underline hover:text-brand-primary">
                      términos
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" className="underline hover:text-brand-primary">
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
