"use client";

import { Button } from "@/components/ui/button";
import type {
  AdminConteoPeriodo,
  AdminHueco,
  AdminMetricas,
} from "@/modules/administracion/types";

interface AdminMetricsProps {
  metricas: AdminMetricas;
}

const LABELS: { key: keyof AdminConteoPeriodo; label: string }[] = [
  { key: "visitas", label: "Visitas" },
  { key: "sesiones", label: "Sesiones" },
  { key: "usuariosNuevos", label: "Usuarios nuevos" },
  { key: "comentarios", label: "Comentarios" },
  { key: "puntosPropuestos", label: "Puntos propuestos" },
  { key: "puntosAprobados", label: "Puntos aprobados" },
  { key: "mensajes", label: "Mensajes" },
  { key: "favoritos", label: "Favoritos" },
];

function delta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "nuevo" : "—";
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

function huecoStyle(estado: AdminHueco["estado"]) {
  if (estado === "listo") return "border-brand-secondary/40 bg-brand-secondary/10";
  if (estado === "parcial") return "border-brand-accent/35 bg-brand-accent/10";
  return "border-brand-ink/10 bg-brand-ink/[0.03]";
}

function downloadCsv(metricas: AdminMetricas) {
  const { mesActual, mesAnterior, etiquetaMes, etiquetaMesAnterior, ultimos30, topPaginas } =
    metricas;
  const lines = [
    `ALTERNA — resumen ${etiquetaMes}`,
    "Métrica,Este mes,Mes anterior",
    ...LABELS.map(
      ({ key, label }) => `${label},${mesActual[key]},${mesAnterior[key]}`
    ),
    "",
    "Página,Vistas (30 días)",
    ...topPaginas.map((p) => `${p.path},${p.vistas}`),
    "",
    "Fecha,Visitas,Usuarios,Comentarios,Puntos,Mensajes",
    ...ultimos30.map(
      (d) =>
        `${d.fecha},${d.visitas},${d.usuarios},${d.comentarios},${d.puntos},${d.mensajes}`
    ),
    "",
    `Comparado contra ${etiquetaMesAnterior}`,
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `alterna-metricas-${etiquetaMes.replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminMetrics({ metricas }: AdminMetricsProps) {
  const maxVisitas = Math.max(...metricas.ultimos30.map((d) => d.visitas), 1);
  const totalDispositivos = metricas.dispositivos.reduce((sum, d) => sum + d.total, 0) || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
            Cierre de {metricas.etiquetaMes}
          </h2>
          <p className="mt-1 text-sm text-brand-ink/55">
            Comparado con {metricas.etiquetaMesAnterior}. Zona horaria Santa Fe.
          </p>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={() => downloadCsv(metricas)}>
          Descargar CSV del mes
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LABELS.map(({ key, label }) => {
          const current = metricas.mesActual[key];
          const previous = metricas.mesAnterior[key];
          const change = delta(current, previous);
          const up = typeof change === "string" && change.startsWith("+");
          return (
            <div
              key={key}
              className="rounded-2xl border border-brand-ink/10 bg-white px-4 py-4 shadow-soft"
            >
              <p className="text-xs uppercase tracking-wide text-brand-ink/45">{label}</p>
              <p className="mt-1 text-2xl font-bold text-brand-ink">{current}</p>
              <p
                className={`mt-1 text-xs font-semibold ${
                  up ? "text-brand-primary" : "text-brand-ink/45"
                }`}
              >
                {change} vs mes anterior ({previous})
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-ink/45">
          Visitas · últimos 30 días
        </p>
        <div className="mt-4 flex h-28 items-end gap-1">
          {metricas.ultimos30.map((d) => (
            <div
              key={d.fecha}
              title={`${d.fecha}: ${d.visitas} visitas`}
              className="flex-1 rounded-t bg-brand-primary/80 min-h-[4px]"
              style={{ height: `${Math.max(8, (d.visitas / maxVisitas) * 100)}%` }}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-brand-ink/40">
          Cada barra es un día. Pasá el cursor para ver la fecha.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-soft">
          <h3 className="font-display text-sm font-bold uppercase text-brand-ink">
            Páginas más vistas
          </h3>
          {!metricas.topPaginas.length ? (
            <p className="mt-3 text-sm text-brand-ink/55">
              Todavía no hay visitas con consentimiento analítico.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {metricas.topPaginas.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-brand-ink">{p.path}</span>
                  <span className="shrink-0 text-brand-ink/45">{p.vistas}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-soft">
          <h3 className="font-display text-sm font-bold uppercase text-brand-ink">
            Dispositivos
          </h3>
          {!metricas.dispositivos.length ? (
            <p className="mt-3 text-sm text-brand-ink/55">Sin datos de dispositivo aún.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {metricas.dispositivos.map((d) => (
                <li key={d.device}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-brand-ink">{d.device}</span>
                    <span className="text-brand-ink/45">
                      {d.total} · {Math.round((d.total / totalDispositivos) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-ink/10">
                    <div
                      className="h-full rounded-full bg-brand-accent"
                      style={{ width: `${(d.total / totalDispositivos) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold uppercase text-brand-ink">
          Qué falta afilar para el análisis de fin de mes
        </h3>
        <p className="mt-1 text-sm text-brand-ink/55">
          Verde: ya lo tenemos. Naranja: parcial. Gris: todavía no se mide.
        </p>
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {metricas.huecos.map((h) => (
            <li
              key={h.id}
              className={`rounded-2xl border px-4 py-4 ${huecoStyle(h.estado)}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/45">
                {h.estado === "listo" ? "Listo" : h.estado === "parcial" ? "Parcial" : "Falta"}
              </p>
              <p className="mt-1 font-semibold text-brand-ink">{h.titulo}</p>
              <p className="mt-1 text-sm text-brand-ink/65">{h.detalle}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
