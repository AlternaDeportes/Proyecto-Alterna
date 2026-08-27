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
  requireStaff,
} from "@/lib/auth-guards";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { AdminDashboard } from "@/modules/administracion/components/AdminDashboard";
import { adminService } from "@/modules/administracion/services/admin.service";
import { metricasService } from "@/modules/administracion/services/metricas.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Panel admin",
  description: "Moderación, comunidad y métricas de ALTERNA.",
  path: "/panel-admin",
  index: false,
});

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function PanelAdminPage({ searchParams }: PageProps) {
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
  const params = await searchParams;
  const [
    resumen,
    metricas,
    ubicaciones,
    comentarios,
    mensajes,
    usuarios,
    contenido,
    auditoria,
  ] = await Promise.all([
    adminService.obtenerResumen(),
    metricasService.obtenerDashboard(),
    adminService.listarUbicaciones(),
    adminService.listarComentarios(),
    adminService.listarMensajesContacto(),
    adminService.listarUsuarios(),
    adminService.listarContenido(),
    adminService.listarAuditoria(),
  ]);

  return (
    <main id="contenido-principal">
      <AdminDashboard
        staffNombre={session?.user?.name ?? "equipo"}
        staffEmail={session?.user?.email ?? ""}
        staffRol={session?.user?.rol ?? "STAFF"}
        initialTab={params.tab}
        resumen={resumen}
        metricas={metricas}
        ubicaciones={ubicaciones}
        comentarios={comentarios}
        mensajes={mensajes}
        usuarios={usuarios}
        contenido={contenido}
        auditoria={auditoria}
      />
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
