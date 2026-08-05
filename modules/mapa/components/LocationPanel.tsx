"use client";

import { ButtonLink } from "@/components/ui/button";
import { colorDeporteMapa } from "@/config/map-region";
import { distanciaKm } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { LocationComments } from "@/modules/comunidad/components/LocationComments";
import { etiquetaDeporte, type MapUbicacion } from "@/modules/mapa/types";

interface LocationPanelProps {
  ubicaciones: MapUbicacion[];
  seleccionada: MapUbicacion | null;
  posicionUsuario: { lat: number; lng: number };
  abierto: boolean;
  onToggle: () => void;
  onSeleccionar: (u: MapUbicacion) => void;
}

export function LocationPanel({
  ubicaciones,
  seleccionada,
  posicionUsuario,
  abierto,
  onToggle,
  onSeleccionar,
}: LocationPanelProps) {
  return (
    <aside
      className={cn(
        "absolute z-[500] flex flex-col bg-white shadow-2xl transition-transform duration-300",
        "bottom-0 left-0 right-0 max-h-[52dvh] rounded-t-2xl md:bottom-4 md:left-auto md:right-4 md:max-h-[70%] md:w-[340px] md:rounded-organic",
        abierto ? "translate-y-0" : "translate-y-[calc(100%-3.25rem)] md:translate-y-0"
      )}
      aria-label="Lista de lugares cercanos"
    >
      <div className="flex items-center justify-between border-b border-brand-ink/10 px-4 py-3">
        <button
          type="button"
          className="mx-auto mb-1 h-1 w-10 rounded-full bg-brand-ink/15 md:hidden"
          onClick={onToggle}
          aria-label={abierto ? "Ocultar lista" : "Ver lista"}
        />
        <strong className="font-display text-sm uppercase text-brand-ink">Cerca tuyo</strong>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-semibold text-brand-primary md:hidden"
        >
          {abierto ? "Ocultar" : "Ver lista"}
        </button>
      </div>

      <div className="overflow-y-auto px-3 py-2" role="list">
        {!ubicaciones.length ? (
          <p className="px-2 py-4 text-sm text-brand-ink/60">
            No hay actividades en este rango. Probá ampliar el radio, cambiar el filtro o
            pasar a «Explorar región».
          </p>
        ) : (
          ubicaciones.map((u) => {
            const dist = distanciaKm(posicionUsuario, u).toFixed(1);
            const activa = seleccionada?.id === u.id;
            return (
              <button
                key={u.id}
                type="button"
                role="listitem"
                onClick={() => onSeleccionar(u)}
                className={cn(
                  "mb-2 w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                  activa
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-brand-ink/10 hover:border-brand-primary/40"
                )}
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                  style={{
                    backgroundColor: colorDeporteMapa(
                      u.deporte.slug,
                      u.deporte.colorPrimario
                    ),
                  }}
                  aria-hidden
                />
                <strong className="text-sm text-brand-ink">{etiquetaDeporte(u)}</strong>
                <br />
                <span className="text-sm text-brand-ink/75">{u.nombre}</span>
                <br />
                <small className="text-xs text-brand-ink/50">
                  {u.ciudad.nombre} · {u.horarios} · {dist} km
                </small>
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-brand-ink/10 p-4">
        {seleccionada ? (
          <div>
            <h3 className="font-display text-sm font-bold uppercase text-brand-ink">
              {etiquetaDeporte(seleccionada)} · {seleccionada.nombre}
            </h3>
            <p className="mt-1 text-xs text-brand-ink/60">
              {seleccionada.ciudad.nombre} · {seleccionada.horarios} ·{" "}
              {seleccionada.direccion}
            </p>
            {seleccionada.historia && (
              <p className="mt-2 text-sm text-brand-ink/75">{seleccionada.historia}</p>
            )}
            {seleccionada.contacto && (
              <p className="mt-2 text-xs font-semibold text-brand-primary">
                Contacto: {seleccionada.contacto}
              </p>
            )}
            <LocationComments ubicacionId={seleccionada.id} />
          </div>
        ) : (
          <p className="text-sm text-brand-ink/60">
            Tocá un marcador o un lugar de la lista para ver el detalle.
          </p>
        )}
        <ButtonLink
          href="/comunidad#sumar-punto"
          variant="primary"
          size="sm"
          className="mt-4 w-full"
        >
          + Sumar mi deporte
        </ButtonLink>
      </div>
    </aside>
  );
}

