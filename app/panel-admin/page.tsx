import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isDatabaseConfigured } from "@/config/env";
import { Badge } from "@/components/ui/badge";
import { BlobBackground } from "@/components/ui/blob-background";
import { ButtonLink } from "@/components/ui/button";
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

  return (
    <main id="contenido-principal">
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Badge variant="secondary">Administración</Badge>
          <h1 className="mt-3 font-display text-3xl font-black uppercase text-white sm:text-4xl">
            Panel admin
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/65">
            Moderación de puntos del mapa y mensajes de contacto.
            {session?.user?.email ? (
              <>
                {" "}
                Sesión: {session.user.email}
                {isStaffRole(session.user.rol) ? ` · ${session.user.rol}` : null}
              </>
            ) : null}
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 py-10">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4"
            >
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-3 px-4 sm:px-6">
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
      </section>

      <section className="border-b border-white/10 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-lg font-bold uppercase text-white">
            Puntos pendientes
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Propuestas de la comunidad. Al aprobar, aparecen en el mapa público.
          </p>
          <ModerateLocations items={pendientes} />
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-lg font-bold uppercase text-white">
            Mensajes de contacto
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Formularios enviados desde /contacto.
          </p>
          <ContactMessages items={mensajes} />
        </div>
      </section>
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
    <main id="contenido-principal" className="px-4 py-28 text-center">
      <h1 className="font-display text-3xl font-black uppercase text-white">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-white/70">{body}</p>
      <ButtonLink href={href} variant="secondary" className="mt-6">
        {cta}
      </ButtonLink>
      <p className="mt-4 text-sm text-white/40">
        <Link href="/" className="hover:underline">
          Volver al inicio
        </Link>
      </p>
    </main>
  );
}
