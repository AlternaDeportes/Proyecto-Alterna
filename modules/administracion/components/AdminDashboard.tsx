"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AdminMetrics } from "@/modules/administracion/components/AdminMetrics";
import { ContactMessages } from "@/modules/administracion/components/ContactMessages";
import { ModerateComments } from "@/modules/administracion/components/ModerateComments";
import { ModerateLocations } from "@/modules/administracion/components/ModerateLocations";
import { fechaCortaAR } from "@/modules/administracion/lib/periodo";
import type {
  AdminAuditItem,
  AdminComentario,
  AdminContenidoItem,
  AdminMensajeContacto,
  AdminMetricas,
  AdminResumen,
  AdminTabId,
  AdminUbicacionPendiente,
  AdminUsuario,
} from "@/modules/administracion/types";

interface AdminDashboardProps {
  staffNombre: string;
  staffEmail: string;
  staffRol: string;
  initialTab?: string;
  resumen: AdminResumen;
  metricas: AdminMetricas;
  ubicaciones: AdminUbicacionPendiente[];
  comentarios: AdminComentario[];
  mensajes: AdminMensajeContacto[];
  usuarios: AdminUsuario[];
  contenido: AdminContenidoItem[];
  auditoria: AdminAuditItem[];
}

const TABS: { id: AdminTabId; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "moderacion", label: "Moderación" },
  { id: "mensajes", label: "Mensajes" },
  { id: "comunidad", label: "Comunidad" },
  { id: "contenido", label: "Contenido" },
  { id: "metricas", label: "Métricas" },
  { id: "auditoria", label: "Auditoría" },
];

function isTab(value: string | undefined): value is AdminTabId {
  return TABS.some((t) => t.id === value);
}

function saludoPorHora() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint?: string;
  tone: "primary" | "secondary" | "accent" | "ink";
}) {
  const bar =
    tone === "primary"
      ? "bg-brand-primary"
      : tone === "secondary"
        ? "bg-brand-secondary"
        : tone === "accent"
          ? "bg-brand-accent"
          : "bg-brand-ink";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-ink/10 bg-white px-4 py-4 shadow-soft">
      <span className={`absolute inset-y-0 left-0 w-1.5 ${bar}`} />
      <p className="pl-2 text-2xl font-bold text-brand-ink">{value}</p>
      <p className="mt-1 pl-2 text-xs uppercase tracking-wide text-brand-ink/45">{label}</p>
      {hint ? <p className="mt-1 pl-2 text-xs text-brand-ink/40">{hint}</p> : null}
    </div>
  );
}

export function AdminDashboard({
  staffNombre,
  staffEmail,
  staffRol,
  initialTab,
  resumen,
  metricas,
  ubicaciones,
  comentarios,
  mensajes,
  usuarios,
  contenido,
  auditoria,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTabId>(isTab(initialTab) ? initialTab : "resumen");
  const [modSub, setModSub] = useState<"puntos" | "comentarios">(
    resumen.comentariosPendientes > 0 && resumen.pendientes === 0
      ? "comentarios"
      : "puntos"
  );

  const nombreCorto = staffNombre.split(" ")[0] || "equipo";
  const pendientesTotales =
    resumen.pendientes + resumen.comentariosPendientes + resumen.mensajesNoLeidos;

  function go(id: AdminTabId) {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState({}, "", url);
  }

  const contenidoPorTipo = useMemo(() => {
    const groups: Record<AdminContenidoItem["tipo"], AdminContenidoItem[]> = {
      deporte: [],
      historia: [],
      podcast: [],
      documental: [],
      evento: [],
    };
    for (const item of contenido) groups[item.tipo].push(item);
    return groups;
  }, [contenido]);

  return (
    <>
      <Section
        tone="ink"
        border="bottom"
        blobs="section"
        className="pt-28 sm:pt-32"
        aria-labelledby="admin-title"
      >
        <Container>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="ds-eyebrow ds-eyebrow--white">Administración</p>
        {pendientesTotales > 0 ? (
          <p className="rounded-full bg-brand-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-ink">
            {pendientesTotales} para revisar
          </p>
        ) : (
          <p className="rounded-full bg-brand-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-ink">
            Cola al día
          </p>
        )}
      </div>
      <h1 id="admin-title" className="ds-display mt-3 max-w-3xl text-display-sm text-white sm:text-display-md">
        {saludoPorHora()}, {nombreCorto}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-white/75">
        Panel de ALTERNA · {metricas.etiquetaMes}. Moderación, comunidad y métricas para el
        cierre mensual.
      </p>
      <p className="mt-2 text-sm text-white/50">
        {staffEmail} · rol {staffRol}
      </p>

      <nav
        className="-mx-1 mt-8 flex gap-1 overflow-x-auto pb-1"
        aria-label="Secciones del panel"
      >
        {TABS.map((item) => {
          const badge =
            item.id === "moderacion"
              ? resumen.pendientes + resumen.comentariosPendientes
              : item.id === "mensajes"
                ? resumen.mensajesNoLeidos
                : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? "bg-white text-brand-ink"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
              {badge > 0 ? ` (${badge})` : ""}
            </button>
          );
        })}
      </nav>
        </Container>
      </Section>
      <ColorStripe />
      <Section tone="paper" density="tight">
        <Container>
        {tab === "resumen" ? (
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                tone="accent"
                label="Puntos pendientes"
                value={resumen.pendientes}
                hint="Cola del mapa"
              />
              <StatCard
                tone="primary"
                label="Comentarios a revisar"
                value={resumen.comentariosPendientes}
                hint={`${resumen.comentarios} en total`}
              />
              <StatCard
                tone="secondary"
                label="Mensajes sin leer"
                value={resumen.mensajesNoLeidos}
              />
              <StatCard
                tone="ink"
                label="Visitas este mes"
                value={metricas.mesActual.visitas}
                hint={`${metricas.mesActual.sesiones} sesiones`}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard tone="primary" label="Usuarios" value={resumen.usuarios} />
              <StatCard
                tone="secondary"
                label="Puntos en el mapa"
                value={resumen.ubicacionesAprobadas}
                hint={`${resumen.ubicacionesRechazadas} rechazados`}
              />
              <StatCard tone="accent" label="Favoritos" value={resumen.favoritos} />
              <StatCard
                tone="ink"
                label="Catálogo"
                value={resumen.deportes + resumen.historias}
                hint={`${resumen.episodiosPodcast} podcast · ${resumen.episodiosDoc} docs`}
              />
            </div>

            {pendientesTotales > 0 ? (
              <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-5 py-4">
                <p className="font-semibold text-brand-ink">Atención ahora</p>
                <ul className="mt-2 space-y-1 text-sm text-brand-ink/75">
                  {resumen.pendientes > 0 ? (
                    <li>
                      {resumen.pendientes} punto{resumen.pendientes === 1 ? "" : "s"} del mapa
                      esperando aprobación.{" "}
                      <button
                        type="button"
                        className="font-semibold text-brand-primary hover:underline"
                        onClick={() => go("moderacion")}
                      >
                        Ir a moderación
                      </button>
                    </li>
                  ) : null}
                  {resumen.comentariosPendientes > 0 ? (
                    <li>
                      {resumen.comentariosPendientes} comentario
                      {resumen.comentariosPendientes === 1 ? "" : "s"} en revisión.
                    </li>
                  ) : null}
                  {resumen.mensajesNoLeidos > 0 ? (
                    <li>
                      {resumen.mensajesNoLeidos} mensaje
                      {resumen.mensajesNoLeidos === 1 ? "" : "s"} de contacto sin leer.{" "}
                      <button
                        type="button"
                        className="font-semibold text-brand-primary hover:underline"
                        onClick={() => go("mensajes")}
                      >
                        Abrir bandeja
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/mapa" variant="outline" size="sm">
                Ver mapa público
              </ButtonLink>
              <ButtonLink href="/comunidad" variant="outline" size="sm">
                Comunidad
              </ButtonLink>
              <ButtonLink href="/contacto" variant="outline" size="sm">
                Contacto
              </ButtonLink>
              <button
                type="button"
                className="text-sm font-semibold text-brand-primary hover:underline"
                onClick={() => go("metricas")}
              >
                Ver métricas del mes →
              </button>
            </div>
          </div>
        ) : null}

        {tab === "moderacion" ? (
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModSub("puntos")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  modSub === "puntos"
                    ? "bg-brand-ink text-white"
                    : "bg-brand-ink/5 text-brand-ink/70"
                }`}
              >
                Puntos del mapa ({resumen.pendientes})
              </button>
              <button
                type="button"
                onClick={() => setModSub("comentarios")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  modSub === "comentarios"
                    ? "bg-brand-ink text-white"
                    : "bg-brand-ink/5 text-brand-ink/70"
                }`}
              >
                Comentarios ({resumen.comentariosPendientes})
              </button>
            </div>
            {modSub === "puntos" ? (
              <>
                <p className="mt-4 text-sm text-brand-ink/55">
                  Las propuestas de la comunidad aparecen acá. Al aprobar, salen en el mapa
                  público.
                </p>
                <ModerateLocations items={ubicaciones} />
              </>
            ) : (
              <>
                <p className="mt-4 text-sm text-brand-ink/55">
                  Los comentarios nuevos quedan en revisión. Solo los aprobados se ven en el
                  mapa.
                </p>
                <ModerateComments items={comentarios} />
              </>
            )}
          </div>
        ) : null}

        {tab === "mensajes" ? (
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
              Mensajes de contacto
            </h2>
            <p className="mt-1 text-sm text-brand-ink/55">
              Formularios de /contacto y de “sumarse” en comunidad.
            </p>
            <ContactMessages items={mensajes} />
          </div>
        ) : null}

        {tab === "comunidad" ? (
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
              Personas en ALTERNA
            </h2>
            <p className="mt-1 text-sm text-brand-ink/55">
              Cuentas sincronizadas con Google. Los aportes y comentarios quedan vinculados.
            </p>
            {!usuarios.length ? (
              <p className="mt-4 text-sm text-brand-ink/55">Todavía no hay usuarios en la base.</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-ink/10 bg-white shadow-soft">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-brand-ink/10 text-xs uppercase tracking-wide text-brand-ink/45">
                    <tr>
                      <th className="px-4 py-3">Persona</th>
                      <th className="px-4 py-3">Rol</th>
                      <th className="px-4 py-3">Aportes</th>
                      <th className="px-4 py-3">Comentarios</th>
                      <th className="px-4 py-3">Favoritos</th>
                      <th className="px-4 py-3">Alta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b border-brand-ink/5 last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-brand-ink">{u.nombre}</p>
                          <p className="text-xs text-brand-ink/45">{u.email}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold uppercase text-brand-ink/60">
                          {u.rol}
                        </td>
                        <td className="px-4 py-3">{u.aportes}</td>
                        <td className="px-4 py-3">{u.comentarios}</td>
                        <td className="px-4 py-3">{u.favoritos}</td>
                        <td className="px-4 py-3 text-xs text-brand-ink/45">
                          {fechaCortaAR(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {tab === "contenido" ? (
          <div className="space-y-8">
            <p className="text-sm text-brand-ink/55">
              Inventario publicado. La edición editorial todavía se hace en seed / Prisma
              Studio; acá ves qué hay al aire y saltás a la ficha pública.
            </p>
            {(
              [
                ["deporte", "Deportes"],
                ["historia", "Historias"],
                ["podcast", "Podcast"],
                ["documental", "Documentales"],
                ["evento", "Eventos"],
              ] as const
            ).map(([tipo, titulo]) => (
              <section key={tipo}>
                <h3 className="font-display text-sm font-bold uppercase text-brand-ink">
                  {titulo}
                </h3>
                {!contenidoPorTipo[tipo].length ? (
                  <p className="mt-2 text-sm text-brand-ink/45">Sin ítems.</p>
                ) : (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {contenidoPorTipo[tipo].map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between gap-3 rounded-xl border border-brand-ink/10 bg-white px-4 py-3 text-sm shadow-soft hover:border-brand-primary/40"
                        >
                          <span>
                            <span className="font-semibold text-brand-ink">{item.titulo}</span>
                            <span className="mt-0.5 block text-xs text-brand-ink/40">
                              {item.meta}
                            </span>
                          </span>
                          <span className="text-xs text-brand-primary">Ver</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        ) : null}

        {tab === "metricas" ? <AdminMetrics metricas={metricas} /> : null}

        {tab === "auditoria" ? (
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
              Actividad del staff
            </h2>
            <p className="mt-1 text-sm text-brand-ink/55">
              Aprobar, rechazar y marcar mensajes queda registrado.
            </p>
            {!auditoria.length ? (
              <p className="mt-4 text-sm text-brand-ink/55">Todavía no hay acciones auditadas.</p>
            ) : (
              <ol className="mt-4 space-y-2">
                {auditoria.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-brand-ink/10 bg-white px-4 py-3 text-sm shadow-soft"
                  >
                    <p className="font-semibold text-brand-ink">
                      {a.accion} · {a.entidad}
                    </p>
                    <p className="mt-1 text-xs text-brand-ink/45">
                      {a.usuarioNombre ?? "Staff"} {a.usuarioEmail ? `(${a.usuarioEmail})` : ""} ·{" "}
                      {fechaCortaAR(a.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ) : null}
        </Container>
      </Section>
    </>
  );
}
