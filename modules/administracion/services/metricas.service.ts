import { ModeracionEstado } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  daysAgoAR,
  etiquetaMesAR,
  startOfMonthAR,
  startOfNextMonthAR,
  startOfPreviousMonthAR,
  startOfTomorrowAR,
  ymdKeyAR,
} from "@/modules/administracion/lib/periodo";
import type {
  AdminConteoPeriodo,
  AdminHueco,
  AdminMetricas,
  AdminSerieDia,
  AdminUso,
} from "@/modules/administracion/types";

async function contarPeriodo(desde: Date, hasta: Date): Promise<AdminConteoPeriodo> {
  const [
    visitas,
    sesiones,
    usuariosNuevos,
    comentarios,
    puntosPropuestos,
    puntosAprobados,
    mensajes,
    favoritos,
  ] = await Promise.all([
    prisma.pageView.count({
      where: { createdAt: { gte: desde, lt: hasta } },
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: desde, lt: hasta } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    prisma.usuario.count({
      where: { deletedAt: null, createdAt: { gte: desde, lt: hasta } },
    }),
    prisma.comentario.count({
      where: { deletedAt: null, createdAt: { gte: desde, lt: hasta } },
    }),
    prisma.ubicacion.count({
      where: { deletedAt: null, createdAt: { gte: desde, lt: hasta } },
    }),
    prisma.ubicacion.count({
      where: {
        deletedAt: null,
        moderacion: ModeracionEstado.APROBADO,
        createdAt: { gte: desde, lt: hasta },
      },
    }),
    prisma.contactoMensaje.count({
      where: { createdAt: { gte: desde, lt: hasta } },
    }),
    prisma.favorito.count({
      where: { createdAt: { gte: desde, lt: hasta } },
    }),
  ]);

  return {
    visitas,
    sesiones: sesiones.length,
    usuariosNuevos,
    comentarios,
    puntosPropuestos,
    puntosAprobados,
    mensajes,
    favoritos,
  };
}

function huecos(uso: AdminUso): AdminHueco[] {
  return [
    {
      id: "visitas",
      titulo: "Visitas propias (con consentimiento)",
      detalle: "Páginas vistas, sesiones anónimas y dispositivos en nuestra base.",
      estado: "listo",
    },
    {
      id: "comunidad",
      titulo: "Actividad de comunidad",
      detalle: `Usuarios, comentarios, puntos del mapa, favoritos y mensajes de ${etiquetaMesAR()}.`,
      estado: "listo",
    },
    {
      id: "moderacion",
      titulo: "Cola de moderación",
      detalle: "Aprobar o rechazar puntos y comentarios desde este panel.",
      estado: "listo",
    },
    {
      id: "reproducciones",
      titulo: "Reproducciones de podcast y documental",
      detalle: `Plays del teaser y del audio: ${uso.reproducciones}. Avances de escucha: ${uso.avances}.`,
      estado: "listo",
    },
    {
      id: "mapa",
      titulo: "Uso del mapa",
      detalle: `Filtros por deporte: ${uso.filtrosMapa}. Clicks en pines: ${uso.pinesMapa}.`,
      estado: "listo",
    },
    {
      id: "fuentes",
      titulo: "Fuentes de tráfico",
      detalle:
        "Referrer y parámetros utm_source, utm_medium y utm_campaign de cada visita.",
      estado: "listo",
    },
    {
      id: "engagement",
      titulo: "Tiempo en página, rebote y scroll",
      detalle:
        uso.duracionMediaSeg === null
          ? "Ya se registra al salir de la página. Todavía no hay visitas con duración."
          : `Promedio ${uso.duracionMediaSeg}s en página, scroll ${uso.scrollMedio ?? 0}% y rebote ${uso.rebotePct ?? 0}%.`,
      estado: "listo",
    },
    {
      id: "navegador",
      titulo: "Navegador",
      detalle:
        "Chrome, Safari, Firefox, Edge u otro. No guardamos ciudad ni IP.",
      estado: "listo",
    },
    {
      id: "editorial",
      titulo: "CMS de contenido desde el panel",
      detalle:
        "El catálogo se ve acá, pero crear y editar fichas sigue en el seed.",
      estado: "falta",
    },
  ];
}

function promedio(values: number[]) {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function topConteo(rows: string[], limit = 6) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row, (counts.get(row) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, total]) => ({ label, total }));
}

export const metricasService = {
  async obtenerDashboard(): Promise<AdminMetricas> {
    const ahora = new Date();
    const mesDesde = startOfMonthAR(ahora);
    const mesHasta = startOfNextMonthAR(ahora);
    const anteriorDesde = startOfPreviousMonthAR(ahora);
    const serieDesde = daysAgoAR(29, ahora);
    const serieHasta = startOfTomorrowAR(ahora);

    const [mesActual, mesAnterior, pageViews, usuarios, comentarios, puntos, mensajes, vistasMes, eventosMes] =
      await Promise.all([
        contarPeriodo(mesDesde, mesHasta),
        contarPeriodo(anteriorDesde, mesDesde),
        prisma.pageView.findMany({
          where: { createdAt: { gte: serieDesde, lt: serieHasta } },
          select: { path: true, device: true, createdAt: true },
        }),
        prisma.usuario.findMany({
          where: { deletedAt: null, createdAt: { gte: serieDesde, lt: serieHasta } },
          select: { createdAt: true },
        }),
        prisma.comentario.findMany({
          where: { deletedAt: null, createdAt: { gte: serieDesde, lt: serieHasta } },
          select: { createdAt: true },
        }),
        prisma.ubicacion.findMany({
          where: { deletedAt: null, createdAt: { gte: serieDesde, lt: serieHasta } },
          select: { createdAt: true },
        }),
        prisma.contactoMensaje.findMany({
          where: { createdAt: { gte: serieDesde, lt: serieHasta } },
          select: { createdAt: true },
        }),
        prisma.pageView.findMany({
          where: { createdAt: { gte: mesDesde, lt: mesHasta } },
          select: {
            sessionId: true,
            referrer: true,
            utmSource: true,
            browser: true,
            durationMs: true,
            scrollPct: true,
          },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["type"],
          where: { createdAt: { gte: mesDesde, lt: mesHasta } },
          _count: { _all: true },
        }),
      ]);

    const byDay = new Map<string, AdminSerieDia>();
    for (let i = 0; i < 30; i++) {
      const day = daysAgoAR(29 - i, ahora);
      const key = ymdKeyAR(day);
      byDay.set(key, {
        fecha: key,
        visitas: 0,
        usuarios: 0,
        comentarios: 0,
        puntos: 0,
        mensajes: 0,
      });
    }

    const bump = (
      rows: { createdAt: Date }[],
      field: Exclude<keyof AdminSerieDia, "fecha">
    ) => {
      for (const row of rows) {
        const key = ymdKeyAR(row.createdAt);
        const bucket = byDay.get(key);
        if (bucket) bucket[field] += 1;
      }
    };

    bump(pageViews, "visitas");
    bump(usuarios, "usuarios");
    bump(comentarios, "comentarios");
    bump(puntos, "puntos");
    bump(mensajes, "mensajes");

    const paginas = new Map<string, number>();
    const dispositivos = new Map<string, number>();
    for (const view of pageViews) {
      paginas.set(view.path, (paginas.get(view.path) ?? 0) + 1);
      dispositivos.set(view.device, (dispositivos.get(view.device) ?? 0) + 1);
    }

    const topPaginas = [...paginas.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, vistas]) => ({ path, vistas }));

    const porTipo = new Map(eventosMes.map((row) => [row.type, row._count._all]));
    const sesiones = new Map<string, number>();
    for (const vista of vistasMes) {
      sesiones.set(vista.sessionId, (sesiones.get(vista.sessionId) ?? 0) + 1);
    }
    const sesionesTotales = sesiones.size;
    const rebote =
      sesionesTotales === 0
        ? null
        : Math.round(
            ([...sesiones.values()].filter((count) => count === 1).length / sesionesTotales) *
              100
          );
    const fuentes = topConteo(
      vistasMes.map((vista) => vista.utmSource || vista.referrer || "directo")
    );
    const uso: AdminUso = {
      reproducciones: porTipo.get("play") ?? 0,
      avances: porTipo.get("progress") ?? 0,
      filtrosMapa: porTipo.get("map_filter") ?? 0,
      pinesMapa: porTipo.get("map_pin") ?? 0,
      duracionMediaSeg: promedio(
        vistasMes.flatMap((vista) =>
          vista.durationMs === null ? [] : [Math.round(vista.durationMs / 1000)]
        )
      ),
      scrollMedio: promedio(
        vistasMes.flatMap((vista) => (vista.scrollPct === null ? [] : [vista.scrollPct]))
      ),
      rebotePct: rebote,
      fuentes,
      navegadores: topConteo(
        vistasMes.map((vista) => vista.browser || "otro")
      ),
    };

    return {
      etiquetaMes: etiquetaMesAR(ahora),
      etiquetaMesAnterior: etiquetaMesAR(anteriorDesde),
      mesActual,
      mesAnterior,
      ultimos30: [...byDay.values()],
      topPaginas,
      dispositivos: [...dispositivos.entries()].map(([device, total]) => ({
        device,
        total,
      })),
      uso,
      huecos: huecos(uso),
    };
  },
};
