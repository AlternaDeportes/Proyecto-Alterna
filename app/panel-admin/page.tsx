import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isDatabaseConfigured } from "@/config/env";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { auth, isAuthConfigured } from "@/lib/auth";
import {
  AuthRequiredError,
  DatabaseRequiredError,
  ForbiddenError,
  isStaffRole,
  requireStaff,
} from "@/lib/auth-guards";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ContactMessages } from "@/modules/administracion/components/ContactMessages";
import { ModerateLocations } from "@/modules/administracion/components/ModerateLocations";
import { adminService } from "@/modules/administracion/services/admin.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Panel admin",
  description: "Moderación y mensajes de ALTERNA.",
  path: "/panel-admin",
  index: false,
});

export const dynamic = "force-dynamic";

export default async function PanelAdminPage() {
  if (!isAuthConfigured()) {
    return (
      <GateMessage
        title="Panel admin"
        body="Configurá Auth en `.env.local` para acceder."
        href="/ingresar"
        cta="Ir a ingresar"
      />
    );
  }

  if (!isDatabaseConfigured()) {
    return (
      <GateMessage
        title="Panel admin"
        body="El panel requiere `DATABASE_URL` y usuarios sincronizados."
        href="/perfil"
        cta="Volver al perfil"
      />
    );
  }

  try {
    await requireStaff();
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      redirect("/ingresar?callbackUrl=/panel-admin");
    }
    if (error instanceof ForbiddenError) {
      return (
        <GateMessage
          title="Sin acceso"
          body="Solo moderadores o administradores pueden entrar al panel."
          href="/perfil"
          cta="Ir al perfil"
        />
      );
    }
    if (error instanceof DatabaseRequiredError) {
      return (
        <GateMessage
          title="Panel admin"
          body={error.message}
          href="/perfil"
          cta="Ir al perfil"
        />
      );
    }
    throw error;
  }

  const session = await auth();
  const [resumen, pendientes, mensajes] = await Promise.all([
    adminService.obtenerResumen(),
    adminService.listarUbicacionesPendientes(),
    adminService.listarMensajesContacto(),
  ]);

  const stats = [
    { label: "Pendientes mapa", value: resumen.pendientes },
    { label: "Mensajes sin leer", value: resumen.mensajesNoLeidos },
    { label: "Puntos aprobados", value: resumen.ubicacionesAprobadas },
    { label: "Usuarios", value: resumen.usuarios },
    { label: "Deportes", value: resumen.deportes },
    { label: "Historias", value: resumen.historias },
  ];

  const sessionLine = session?.user?.email
    ? `Sesión: ${session.user.email}${
        isStaffRole(session.user.rol) ? ` · ${session.user.rol}` : ""
      }`
    : undefined;

  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow="Administración"
        eyebrowTone="accent"
        title="Panel admin"
        description={[
          "Moderación de puntos del mapa y mensajes de contacto.",
          sessionLine,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      <Section tone="paper" border="bottom" density="tight">
        <Container>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-brand-ink/10 bg-brand-ink/[0.03] px-4 py-4"
              >
                <p className="text-2xl font-bold text-brand-ink">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-brand-ink/45">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/mapa" variant="outline" size="sm">
              Ver mapa
            </ButtonLink>
            <ButtonLink href="/comunidad" variant="outline" size="sm">
              Comunidad
            </ButtonLink>
            <ButtonLink href="/contacto" variant="outline" size="sm">
              Contacto
            </ButtonLink>
            <ButtonLink href="/perfil" variant="ghost" size="sm">
              Mi perfil
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section tone="paper" border="bottom" density="tight">
        <Container>
          <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
            Puntos pendientes
          </h2>
          <p className="mt-1 text-sm text-brand-ink/55">
            Propuestas de la comunidad. Al aprobar, aparecen en el mapa público.
          </p>
          <ModerateLocations items={pendientes} />
        </Container>
      </Section>

      <Section tone="paper" density="tight">
        <Container>
          <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
            Mensajes de contacto
          </h2>
          <p className="mt-1 text-sm text-brand-ink/55">
            Formularios enviados desde /contacto.
          </p>
          <ContactMessages items={mensajes} />
        </Container>
      </Section>
    </main>
  );
}

function GateMessage({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <main id="contenido-principal">
      <PageHeader tone="paper" eyebrow="Acceso" title={title} description={body} />
      <Section tone="paper" density="tight">
        <Container className="text-center">
          <ButtonLink href={href} variant="secondary">
            {cta}
          </ButtonLink>
          <p className="mt-4 text-sm text-brand-ink/40">
            <Link href="/" className="hover:underline">
              Volver al inicio
            </Link>
          </p>
        </Container>
      </Section>
    </main>
  );
}
