"use client";

import { ButtonLink } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import { LocationComments } from "@/modules/comunidad/components/LocationComments";
import type { DeporteListItem } from "@/modules/deportes/types";
import {
  etiquetaDeporte,
  type FiltroDeporteSlug,
  type MapUbicacion,
} from "@/modules/mapa/types";

interface MapSportPanelProps {
  deportes: DeporteListItem[];
  filtro: FiltroDeporteSlug;
  seleccionada: MapUbicacion | null;
  clubesDelDeporte: MapUbicacion[];
  onFiltroChange: (slug: FiltroDeporteSlug) => void;
  onSeleccionar: (u: MapUbicacion) => void;
  onLimpiarSeleccion: () => void;
}

export function MapSportPanel({
  deportes,
  filtro,
  seleccionada,
  clubesDelDeporte,
  onFiltroChange,
  onSeleccionar,
  onLimpiarSeleccion,
}: MapSportPanelProps) {
  const deporteActivo =
    filtro === "todos" || filtro === "otros"
      ? null
      : (deportes.find((d) => d.slug === filtro) ?? null);

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-brand-surface"
      aria-label="Deportes en el mapa"
    >
      <div className="shrink-0 border-b border-brand-ink/10 px-5 py-4 sm:px-6">
        <p className="ds-eyebrow ds-eyebrow--primary">Deportes</p>
        <h2 className="mt-1 font-display text-xl font-black uppercase text-brand-ink">
          {deporteActivo ? deporteActivo.nombre : "Elegí un deporte"}
        </h2>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-2 px-4 py-4 sm:px-5">
        {deportes.map((deporte) => {
          const activo = filtro === deporte.slug;
          return (
            <button
              key={deporte.slug}
              type="button"
              onClick={() => onFiltroChange(deporte.slug as FiltroDeporteSlug)}
              className={cn(
                "overflow-hidden rounded-xl border text-left transition-colors duration-fast focus-ring",
                activo
                  ? "border-transparent ring-2 ring-brand-ink"
                  : "border-brand-ink/10 hover:border-brand-ink/30"
              )}
              aria-pressed={activo}
            >
              <span
                className="block h-1.5 w-full"
                style={{ backgroundColor: deporte.colorPrimario }}
                aria-hidden
              />
              <span className="block px-2 py-2.5 font-display text-[11px] font-bold uppercase leading-tight text-brand-ink sm:text-xs">
                {deporte.nombre.replace(" Frisbee", "")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">
        {seleccionada ? (
          <ClubDetalle
            ubicacion={seleccionada}
            onVolver={onLimpiarSeleccion}
          />
        ) : deporteActivo ? (
          <DeporteDetalle
            deporte={deporteActivo}
            clubes={clubesDelDeporte}
            onSeleccionar={onSeleccionar}
          />
        ) : (
          <p className="text-sm leading-relaxed text-brand-ink/65">
            Tocá Ultimate, Newcom o Wingfoil para ver de qué se trata, o elegí un
            punto en el mapa.
          </p>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-ink/10 p-4 sm:px-5">
        <ButtonLink
          href="/comunidad#sumar-punto"
          variant="primary"
          size="sm"
          className="w-full"
        >
          Sumar mi deporte
        </ButtonLink>
      </div>
    </aside>
  );
}

function DeporteDetalle({
  deporte,
  clubes,
  onSeleccionar,
}: {
  deporte: DeporteListItem;
  clubes: MapUbicacion[];
  onSeleccionar: (u: MapUbicacion) => void;
}) {
  return (
    <div>
      {deporte.coverUrl ? (
        <MediaImage
          src={deporte.coverUrl}
          alt=""
          accentColor={deporte.colorPrimario}
          tone="paper"
          ratio="wide"
          frameClassName="mb-4 rounded-xl ring-0"
          sizes="(max-width: 1024px) 100vw, 22rem"
          placeholderLabel={deporte.nombre}
        />
      ) : null}

      <p className="text-sm leading-relaxed text-brand-ink/75">{deporte.descripcion}</p>

      {clubes.length > 0 ? (
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink/45">
            Dónde se juega
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {clubes.map((club) => (
              <button
                key={club.id}
                type="button"
                onClick={() => onSeleccionar(club)}
                className="rounded-xl border border-brand-ink/10 bg-white px-3 py-3 text-left transition-colors duration-fast hover:border-brand-ink/30 focus-ring"
              >
                <span className="block font-display text-xs font-bold uppercase text-brand-ink">
                  {club.nombre}
                </span>
                <span className="mt-1 block text-[11px] text-brand-ink/55">
                  {club.ciudad.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-brand-ink/55">
          Todavía no hay puntos cargados para este deporte.
        </p>
      )}

      <ButtonLink
        href={`/deportes/${deporte.slug}`}
        variant="outline"
        size="sm"
        className="mt-5"
      >
        Ver ficha del deporte
      </ButtonLink>
    </div>
  );
}

function ClubDetalle({
  ubicacion,
  onVolver,
}: {
  ubicacion: MapUbicacion;
  onVolver: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onVolver}
        className="text-xs font-semibold text-brand-primary focus-ring"
      >
        ← Volver al deporte
      </button>

      <p
        className="mt-4 text-[11px] font-bold uppercase tracking-wider"
        style={{ color: ubicacion.deporte.colorPrimario }}
      >
        {etiquetaDeporte(ubicacion)}
      </p>
      <h3 className="mt-1 font-display text-lg font-black uppercase text-brand-ink">
        {ubicacion.nombre}
      </h3>
      <p className="mt-2 text-sm text-brand-ink/65">
        {ubicacion.direccion}
        <span className="block">{ubicacion.ciudad.nombre}</span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand-ink/45">
        {ubicacion.horarios}
      </p>
      {ubicacion.historia ? (
        <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">
          {ubicacion.historia}
        </p>
      ) : null}
      {ubicacion.contacto ? (
        <p className="mt-2 text-xs font-semibold text-brand-primary">
          Contacto: {ubicacion.contacto}
        </p>
      ) : null}
      <LocationComments ubicacionId={ubicacion.id} />
    </div>
  );
}
