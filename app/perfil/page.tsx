import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth";
import {
  AuthRequiredError,
  DatabaseRequiredError,
  isStaffRole,
  requireDbUserId,
} from "@/lib/auth-guards";
import { isDatabaseConfigured } from "@/config/env";
import { Badge } from "@/components/ui/badge";
import { BlobBackground } from "@/components/ui/blob-background";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { usuarioService } from "@/modules/usuarios/services/usuario.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Perfil",
  description: "Tu cuenta ALTERNA: favoritos y aportes al mapa.",
  path: "/perfil",
  index: false,
});

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  if (!isAuthConfigured()) {
    return (
      <main id="contenido-principal" className="px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-black uppercase text-white">Perfil</h1>
        <p className="mt-3 text-white/70">Configurá Auth en `.env.local` para usar tu cuenta.</p>
        <ButtonLink href="/ingresar" variant="secondary" className="mt-6">
          Ir a ingresar
        </ButtonLink>
      </main>
    );
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/ingresar?callbackUrl=/perfil");
  }

  if (!isDatabaseConfigured()) {
    return (
      <PerfilShell
        nombre={session.user.name ?? "Usuario"}
        email={session.user.email ?? ""}
        image={session.user.image}
        rol={session.user.rol}
      >
        <Card className="border-brand-accent/30 bg-brand-accent/10 p-6 text-sm text-white/80">
          Para favoritos y aportes necesitás `DATABASE_URL`, `db:push` y volver a ingresar.
        </Card>
      </PerfilShell>
    );
  }

  try {
    await requireDbUserId();
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      redirect("/ingresar?callbackUrl=/perfil");
    }
    if (error instanceof DatabaseRequiredError) {
      return (
        <PerfilShell
          nombre={session.user.name ?? "Usuario"}
          email={session.user.email ?? ""}
          image={session.user.image}
          rol={session.user.rol}
        >
          <Card className="border-brand-accent/30 bg-brand-accent/10 p-6 text-sm text-white/80">
            {error.message}
          </Card>
        </PerfilShell>
      );
    }
    throw error;
  }

  const perfil = await usuarioService.obtenerPerfil(session.user.id);

  if (!perfil) {
    return (
      <PerfilShell
        nombre={session.user.name ?? "Usuario"}
        email={session.user.email ?? ""}
        image={session.user.image}
        rol={session.user.rol}
      >
        <Card className="p-6 text-sm text-white/70">
          No encontramos tu perfil en la base. Cerrá sesión y volvé a ingresar.
        </Card>
      </PerfilShell>
    );
  }

  return (
    <PerfilShell
      nombre={perfil.nombre}
      email={perfil.email}
      image={perfil.avatarUrl}
      rol={perfil.rol}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-bold uppercase text-white">Favoritos</h2>
          {!perfil.favoritos.length ? (
            <p className="mt-3 text-sm text-white/55">
              Todavía no guardaste nada. Usá «Guardar» en deportes e historias.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {perfil.favoritos.map((f) => (
                <li key={f.id}>
                  <Link
                    href={f.href}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm hover:border-brand-secondary/40"
                  >
                    <span className="font-semibold text-white">{f.titulo}</span>
                    <span className="text-xs uppercase text-white/40">{f.entidad}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg font-bold uppercase text-white">
            Aportes al mapa
          </h2>
          {!perfil.aportesMapa.length ? (
            <p className="mt-3 text-sm text-white/55">
              Todavía no propusiste puntos.{" "}
              <Link href="/comunidad#sumar-punto" className="text-brand-secondary hover:underline">
                Sumar un punto
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {perfil.aportesMapa.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
                >
                  <p className="font-semibold text-white">{a.nombre}</p>
                  <p className="mt-1 text-xs text-white/50">
                    {a.deporteNombre} · {a.moderacion}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/comunidad" variant="outline">
          Comunidad
        </ButtonLink>
        <ButtonLink href="/mapa" variant="outline">
          Mapa
        </ButtonLink>
        {isStaffRole(perfil.rol) ? (
          <ButtonLink href="/panel-admin" variant="secondary">
            Panel admin
          </ButtonLink>
        ) : null}
      </div>
    </PerfilShell>
  );
}

function PerfilShell({
  nombre,
  email,
  image,
  rol,
  children,
}: {
  nombre: string;
  email: string;
  image?: string | null;
  rol: string;
  children: React.ReactNode;
}) {
  return (
    <main id="contenido-principal">
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-5 px-4 sm:px-6">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              width={72}
              height={72}
              className="h-16 w-16 rounded-full border border-white/20 object-cover"
            />
          ) : null}
          <div>
            <Badge variant="secondary">Mi cuenta</Badge>
            <h1 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-4xl">
              {nombre}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {email} · {rol}
            </p>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
      </section>
    </main>
  );
}
