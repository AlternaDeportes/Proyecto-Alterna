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

function huecos(mes: AdminConteoPeriodo, visitasTotales: number): AdminHueco[] {
  return [
    {
      id: "visitas",
      titulo: "Visitas propias (con consentimiento)",
      detalle:
        visitasTotales === 0
          ? "Todavía no hay pageviews. Entrá al sitio con “Aceptar todas” en cookies para empezar a llenar el mes."
          : "Ya estamos midiendo páginas vistas, sesiones anónimas y dispositivos en nuestra base.",
      estado: visitasTotales === 0 ? "parcial" : "listo",
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
      detalle:
        "Falta registrar play, pause y % visto en los players. Hoy solo vemos el inventario de episodios, no el consumo real.",
      estado: "falta",
    },
    {
      id: "mapa",
      titulo: "Uso del mapa",
      detalle:
        "Falta contar filtros por deporte, clicks en pines y tiempo en ficha. Hoy sí vemos puntos propuestos vs aprobados.",
      estado: "parcial",
    },
    {
      id: "fuentes",
      titulo: "Fuentes de tráfico (UTM / referrer detallado)",
      detalle:
        "Guardamos el host del referrer. Para campañas (Instagram, QR, mail) conviene Plausible o GA4 con UTM.",
      estado: "parcial",
    },
    {
      id: "engagement",
      titulo: "Tiempo en página, rebote y scroll",
      detalle:
        "El tracker propio solo cuenta la visita. Un proveedor externo cubre bounce, duración y profundidad de lectura.",
      estado: "falta",
    },
    {
      id: "geo",
      titulo: "Ciudad / dispositivo fino / navegador",
      detalle:
        "Clasificamos mobile / tablet / desktop. No guardamos IP ni ciudad para respetar privacidad.",
      estado: "parcial",
    },
    {
      id: "editorial",
      titulo: "CMS de contenido desde el panel",
      detalle:
        "El catálogo se ve acá, pero crear/editar deportes, historias y episodios sigue en seed / Prisma Studio.",
      estado: "falta",
    },
  ];
}

export const metricasService = {
  async obtenerDashboard(): Promise<AdminMetricas> {
    const ahora = new Date();
    const mesDesde = startOfMonthAR(ahora);
    const mesHasta = startOfNextMonthAR(ahora);
    const anteriorDesde = startOfPreviousMonthAR(ahora);
    const serieDesde = daysAgoAR(29, ahora);
    const serieHasta = startOfTomorrowAR(ahora);

    const [mesActual, mesAnterior, pageViews, usuarios, comentarios, puntos, mensajes, visitasTotales] =
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
        prisma.pageView.count(),
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
      huecos: huecos(mesActual, visitasTotales),
    };
  },
};
