"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { colorDeporteMapa, MAP_REGION } from "@/config/map-region";
import { MAP_TILES } from "@/config/map-tiles";
import { designTokens } from "@/config/design-tokens";
import { distanciaKm } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { DeporteListItem } from "@/modules/deportes/types";
import { MapSportPanel } from "@/modules/mapa/components/MapSportPanel";
import {
  etiquetaDeporte,
  ubicacionMatchFiltro,
  type FiltroDeporteSlug,
  type MapaModo,
  type MapUbicacion,
} from "@/modules/mapa/types";
import { trackEvent } from "@/modules/analytics/tracker";
import { crearIconoDeporte, iconoUsuario } from "@/modules/mapa/utils/map-icons";

interface MapExplorerProps {
  ubicaciones: MapUbicacion[];
  deportes: DeporteListItem[];
  deporteInicial?: string;
}

function MapController({
  center,
  zoom,
  destino,
}: {
  center: [number, number];
  zoom: number;
  destino: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  useEffect(() => {
    if (!destino) return;
    map.flyTo(destino, 15, { duration: 0.55 });
  }, [destino, map]);

  return null;
}

function filtroDesdeQuery(deporteInicial?: string): FiltroDeporteSlug {
  if (
    deporteInicial === "ultimate-frisbee" ||
    deporteInicial === "newcom" ||
    deporteInicial === "wingfoil" ||
    deporteInicial === "otros"
  ) {
    return deporteInicial;
  }
  return "todos";
}

export function MapExplorer({
  ubicaciones,
  deportes,
  deporteInicial,
}: MapExplorerProps) {
  const [modo, setModo] = useState<MapaModo>("explorar");
  const [filtro, setFiltro] = useState<FiltroDeporteSlug>(
    filtroDesdeQuery(deporteInicial)
  );
  const [radioKm, setRadioKm] = useState(20);
  const [posicionUsuario, setPosicionUsuario] = useState<{ lat: number; lng: number }>(
    MAP_REGION.center
  );
  const [gpsOk, setGpsOk] = useState(false);
  const [seleccionada, setSeleccionada] = useState<MapUbicacion | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        if (distanciaKm(MAP_REGION.center, next) <= MAP_REGION.radiusKm + 30) {
          setPosicionUsuario(next);
          setGpsOk(true);
        }
      },
      () => {
        /* mantiene centro Santa Fe */
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  }, []);

  const enRegion = useMemo(
    () =>
      ubicaciones.filter(
        (u) => distanciaKm(MAP_REGION.center, u) <= MAP_REGION.radiusKm
      ),
    [ubicaciones]
  );

  const visibles = useMemo(() => {
    return enRegion.filter((u) => {
      if (!ubicacionMatchFiltro(u, filtro)) return false;
      if (modo === "cerca") {
        return distanciaKm(posicionUsuario, u) <= radioKm;
      }
      return true;
    });
  }, [enRegion, filtro, modo, radioKm, posicionUsuario]);

  const clubesDelDeporte = useMemo(() => {
    if (filtro === "todos") return [];
    return visibles;
  }, [filtro, visibles]);

  const seleccionar = useCallback((u: MapUbicacion) => {
    trackEvent("map_pin", u.nombre);
    setFiltro(u.deporte.slug as FiltroDeporteSlug);
    setSeleccionada(u);
  }, []);

  const cambiarFiltro = useCallback((slug: FiltroDeporteSlug) => {
    trackEvent("map_filter", slug);
    setFiltro(slug);
    setSeleccionada(null);
  }, []);

  const mapCenter: [number, number] =
    modo === "explorar"
      ? [MAP_REGION.center.lat, MAP_REGION.center.lng]
      : [posicionUsuario.lat, posicionUsuario.lng];

  const zoom = modo === "explorar" ? MAP_REGION.exploreZoom : MAP_REGION.nearZoom;

  const circleCenter: [number, number] =
    modo === "explorar"
      ? [MAP_REGION.center.lat, MAP_REGION.center.lng]
      : mapCenter;
  const circleRadiusKm = modo === "explorar" ? MAP_REGION.radiusKm : radioKm;

  const destino: [number, number] | null = seleccionada
    ? [seleccionada.lat, seleccionada.lng]
    : null;

  const marcoMapa =
    "relative aspect-square w-full overflow-hidden rounded-frame border border-brand-ink/10 bg-brand-surface shadow-lift lg:h-[min(70dvh,38rem)] lg:w-[min(70dvh,38rem)] lg:shrink-0 lg:aspect-auto";

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
      <div className={marcoMapa}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="alterna-map h-full w-full z-0"
          scrollWheelZoom
          aria-label="Mapa de actividades deportivas en la región de Santa Fe"
        >
          <MapController center={mapCenter} zoom={zoom} destino={destino} />
          <TileLayer
            attribution={MAP_TILES.attribution}
            url={MAP_TILES.url}
            maxZoom={MAP_TILES.maxZoom}
            subdomains={MAP_TILES.subdomains}
          />
          <Circle
            center={circleCenter}
            radius={circleRadiusKm * 1000}
            pathOptions={{
              color: designTokens.colors.primary,
              weight: 1.5,
              fillColor: designTokens.colors.primary,
              fillOpacity: 0.05,
            }}
          />
          {modo === "cerca" ? (
            <Marker position={mapCenter} icon={iconoUsuario}>
              <Popup>{gpsOk ? "Tu ubicación" : "Centro de Santa Fe"}</Popup>
            </Marker>
          ) : null}
          {visibles.map((u) => (
            <Marker
              key={u.id}
              position={[u.lat, u.lng]}
              icon={crearIconoDeporte(
                colorDeporteMapa(u.deporte.slug, u.deporte.colorPrimario)
              )}
              eventHandlers={{
                click: () => seleccionar(u),
              }}
            >
              <Popup>
                <strong>{etiquetaDeporte(u)}</strong>
                <br />
                {u.nombre}
                <br />
                <small>
                  {u.ciudad.nombre} · {u.horarios}
                </small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute inset-0 z-[400] flex flex-col justify-between p-3">
          <div className="pointer-events-auto flex items-start justify-between gap-2">
            <div
              className="inline-flex rounded-full border border-brand-ink/15 bg-white/95 p-1 shadow-soft"
              role="group"
              aria-label="Modo del mapa"
            >
              {(
                [
                  { id: "cerca" as const, label: "Cerca" },
                  { id: "explorar" as const, label: "Región" },
                ] as const
              ).map((opt) => {
                const activo = modo === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setModo(opt.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-fast focus-ring",
                      activo
                        ? "bg-brand-primary text-white"
                        : "text-brand-ink/65 hover:text-brand-ink"
                    )}
                    aria-pressed={activo}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p
              className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-accent shadow-soft"
              aria-live="polite"
            >
              {visibles.length} punto{visibles.length === 1 ? "" : "s"}
            </p>
          </div>

          {modo === "cerca" ? (
            <div className="pointer-events-auto flex max-w-[90%] items-center gap-2 rounded-full border border-brand-ink/10 bg-white/95 px-3 py-2 shadow-soft">
              <label
                htmlFor="radio-mapa"
                className="text-[11px] font-bold uppercase tracking-wider text-brand-ink/55"
              >
                Radio
              </label>
              <input
                id="radio-mapa"
                type="range"
                min={2}
                max={MAP_REGION.radiusKm}
                value={radioKm}
                onChange={(e) => setRadioKm(Number(e.target.value))}
                className="h-2 w-28 accent-brand-primary"
              />
              <output htmlFor="radio-mapa" className="text-xs font-bold text-brand-primary">
                {radioKm} km
              </output>
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-h-[28rem] overflow-hidden rounded-frame border border-brand-ink/10 bg-brand-surface shadow-lift lg:h-[min(70dvh,38rem)] lg:min-h-0 lg:flex-1">
        <MapSportPanel
          deportes={deportes}
          filtro={filtro}
          seleccionada={seleccionada}
          clubesDelDeporte={clubesDelDeporte}
          onFiltroChange={cambiarFiltro}
          onSeleccionar={seleccionar}
          onLimpiarSeleccion={() => setSeleccionada(null)}
        />
      </div>
    </div>
  );
}
