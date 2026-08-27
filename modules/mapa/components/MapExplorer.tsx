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

import { MapFilters } from "@/modules/mapa/components/MapFilters";

import { LocationPanel } from "@/modules/mapa/components/LocationPanel";

import {

  etiquetaDeporte,

  ubicacionMatchFiltro,

  type FiltroDeporteSlug,

  type MapaModo,

  type MapUbicacion,

} from "@/modules/mapa/types";

import { crearIconoDeporte, iconoUsuario } from "@/modules/mapa/utils/map-icons";



interface MapExplorerProps {

  ubicaciones: MapUbicacion[];

  deporteInicial?: string;

}



function MapController({

  center,

  zoom,

}: {

  center: [number, number];

  zoom: number;

}) {

  const map = useMap();

  useEffect(() => {

    map.setView(center, zoom, { animate: true });

  }, [center, zoom, map]);

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



export function MapExplorer({ ubicaciones, deporteInicial }: MapExplorerProps) {

  const [modo, setModo] = useState<MapaModo>("cerca");

  const [filtro, setFiltro] = useState<FiltroDeporteSlug>(

    filtroDesdeQuery(deporteInicial)

  );

  const [radioKm, setRadioKm] = useState(20);

  const [posicionUsuario, setPosicionUsuario] = useState<{ lat: number; lng: number }>(
    MAP_REGION.center
  );

  const [gpsOk, setGpsOk] = useState(false);

  const [seleccionada, setSeleccionada] = useState<MapUbicacion | null>(null);

  const [panelAbierto, setPanelAbierto] = useState(true);



  useEffect(() => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const next = {

          lat: pos.coords.latitude,

          lng: pos.coords.longitude,

        };

        // Si estás lejos de la región, igual centramos en Santa Fe para no vaciar el mapa.

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



  const seleccionar = useCallback((u: MapUbicacion) => {

    setSeleccionada(u);

    setPanelAbierto(true);

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



  return (

    <div className="flex h-full flex-col bg-brand-surface">

      <MapFilters

        modo={modo}

        filtro={filtro}

        radioKm={radioKm}

        total={visibles.length}

        onModoChange={setModo}

        onFiltroChange={setFiltro}

        onRadioChange={setRadioKm}

      />



      <div className="relative min-h-0 flex-1">

        <MapContainer

          center={mapCenter}

          zoom={zoom}

          className="h-full w-full z-0"

          scrollWheelZoom

          aria-label="Mapa de actividades deportivas en la región de Santa Fe"

        >

          <MapController center={mapCenter} zoom={zoom} />

          <TileLayer
            attribution={MAP_TILES.attribution}
            url={MAP_TILES.url}
            maxZoom={MAP_TILES.maxZoom}
          />

          <Circle

            center={circleCenter}

            radius={circleRadiusKm * 1000}

            pathOptions={{

              color: designTokens.colors.primary,

              weight: 2,

              fillColor: designTokens.colors.primary,

              fillOpacity: 0.08,

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



        <LocationPanel

          ubicaciones={visibles}

          seleccionada={seleccionada}

          posicionUsuario={posicionUsuario}

          abierto={panelAbierto}

          onToggle={() => setPanelAbierto((v) => !v)}

          onSeleccionar={seleccionar}

        />

      </div>

    </div>

  );

}


