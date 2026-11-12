import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { isDatabaseConfigured } from "@/config/env";
import { auth, isAuthConfigured, isGoogleConfigured } from "@/lib/auth";
import { getGoogleCallbackUrl, getGoogleJsOrigin } from "@/lib/auth-url";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { EmailAuthForm } from "@/modules/autenticacion/components/EmailAuthForm";
import { LoginButton } from "@/modules/autenticacion/components/LoginButton";
import { SignOutButton } from "@/modules/autenticacion/components/SignOutButton";

export const metadata: Metadata = buildPageMetadata({
  title: "Ingresar",
  description: `Creá tu cuenta en ${siteConfig.name} con email o Google para participar de la comunidad.`,
  path: "/ingresar",
  index: false,
});

interface IngresarPageProps {
  searchParams: Promise<{ error?: string; code?: string; callbackUrl?: string }>;
}

function googleErrorMessage(error?: string, code?: string) {
  const key = `${error ?? ""} ${code ?? ""}`.toLowerCase();
  if (!error && !code) return null;
  if (key.includes("accessdenied")) {
    return "Google rechazó el acceso. Si cancelaste, volvé a intentar.";
  }
  if (key.includes("disabled") || key.includes("401")) {
    return "Google tiene el cliente OAuth deshabilitado (error 401 disabled_client). Hay que crear un cliente Web nuevo en Google Cloud y actualizar AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET en Vercel.";
  }
  if (
    key.includes("oauthcallback") ||
    key.includes("oauthsignin") ||
    key.includes("configuration") ||
    key.includes("callback")
  ) {
    return "Google no pudo completar el login. En producción suele faltar la URI de redirección o el cliente OAuth está deshabilitado.";
  }
  if (key.includes("oauthaccountnotlinked")) {
    return "Ese email ya tiene una cuenta. Ingresá con email y contraseña, o recuperá la clave.";
  }
  return "No se pudo iniciar sesión con Google. Revisá la configuración o usá email.";
}

export default async function IngresarPage({ searchParams }: IngresarPageProps) {
  const { error, code, callbackUrl } = await searchParams;
  const session = await auth();
  const authReady = isAuthConfigured();
  const googleReady = isGoogleConfigured();
  const dbReady = isDatabaseConfigured();
  const callbackGoogle = getGoogleCallbackUrl();
  const jsOrigin = getGoogleJsOrigin();
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";
  const googleMessage = googleErrorMessage(error, code);

  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Comunidad"
        eyebrowTone="primary"
        title="Ingresar"
        description="Creá tu cuenta con email (código de 6 dígitos o enlace), un acceso sin contraseña, o Google si está disponible."
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
                  {session.user.emailVerificado === false ? (
                    <p className="rounded-soft border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-ink/80">
                      Tu email todavía no está verificado. Revisá el correo para activar
                      comentarios y puntos del mapa.
                    </p>
                  ) : null}
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
                <div className="space-y-6">
                  {googleMessage ? (
                    <div
                      className="space-y-3 rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-800"
                      role="alert"
                    >
                      <p>{googleMessage}</p>
                      <p>
                        En Google Cloud → Credenciales del cliente OAuth, en «URI de redirección
                        autorizados» tiene que estar exactamente:
                      </p>
                      <code className="block break-all rounded-sm bg-white/80 px-2 py-1 text-xs text-brand-ink">
                        {callbackGoogle}
                      </code>
                      <p>
                        Y en «Orígenes de JavaScript autorizados»:
                      </p>
                      <code className="block break-all rounded-sm bg-white/80 px-2 py-1 text-xs text-brand-ink">
                        {jsOrigin}
                      </code>
                      <p className="text-red-700/80">
                        Si Google muestra «The OAuth client was disabled», el cliente en Cloud
                        Console está apagado. Creá uno nuevo tipo «Aplicación web» y cargá{" "}
                        <code>AUTH_GOOGLE_ID</code> y <code>AUTH_GOOGLE_SECRET</code> en Vercel
                        (Production). <code>AUTH_URL</code> no puede ser localhost.
                      </p>
                    </div>
                  ) : null}

                  <EmailAuthForm callbackUrl={safeCallback} databaseReady={dbReady} />

                  {googleReady ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-brand-ink/40">
                        <span className="h-px flex-1 bg-brand-ink/10" />
                        o
                        <span className="h-px flex-1 bg-brand-ink/10" />
                      </div>
                      <LoginButton className="w-full" callbackUrl={safeCallback} />
                      <p className="text-xs leading-relaxed text-brand-ink/50">
                        Si Google responde «OAuth client was disabled», usá email mientras se
                        crea un cliente Web nuevo en Google Cloud (URI{" "}
                        <code className="break-all">{callbackGoogle}</code>
                        ).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-soft border border-brand-accent/40 bg-brand-accent/10 px-4 py-4 text-sm text-brand-ink/85">
                      <p className="font-semibold text-brand-accent">
                        Google OAuth opcional
                      </p>
                      <p>
                        Podés entrar con email. Para habilitar Google, agregá este callback en
                        Google Cloud y las variables en Vercel:
                      </p>
                      <code className="block break-all rounded-sm bg-white/70 px-2 py-1 text-xs text-brand-ink">
                        {callbackGoogle}
                      </code>
                    </div>
                  )}

                  {!authReady ? (
                    <p className="text-sm text-brand-ink/55">
                      Falta <code>AUTH_SECRET</code> para las sesiones. Generá uno y cargalo en
                      `.env.local` y en Vercel.
                    </p>
                  ) : null}

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
