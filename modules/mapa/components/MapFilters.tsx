"use client";

import { BrandIcon } from "@/components/brand/BrandIcon";
import { cn } from "@/lib/utils";
import { MAP_REGION } from "@/config/map-region";
import {
  FILTROS_DEPORTE,
  type FiltroDeporteSlug,
  type MapaModo,
} from "@/modules/mapa/types";

interface MapFiltersProps {
  modo: MapaModo;
  filtro: FiltroDeporteSlug;
  radioKm: number;
  total: number;
  onModoChange: (modo: MapaModo) => void;
  onFiltroChange: (slug: FiltroDeporteSlug) => void;
  onRadioChange: (km: number) => void;
}

export function MapFilters({
  modo,
  filtro,
  radioKm,
  total,
  onModoChange,
  onFiltroChange,
  onRadioChange,
}: MapFiltersProps) {
  return (
    <div className="overflow-hidden border-b border-brand-ink/10 bg-brand-surface">
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-3">
            <BrandIcon id="mapaPuente" size="sm" className="mt-0.5 shrink-0" />
            <div>
              <p className="ds-eyebrow ds-eyebrow--primary mb-1">Territorio</p>
              <h1 className="font-display text-xl font-black uppercase text-brand-ink sm:text-2xl">
                Encontrá tu deporte
              </h1>
            </div>
          </div>
          <p
            className="text-xs font-semibold uppercase tracking-wider text-brand-accent"
            aria-live="polite"
          >
            {total} actividad{total === 1 ? "" : "es"}
            {modo === "cerca" ? " cerca" : " en la región"}
          </p>
        </div>

        <div
          className="inline-flex rounded-full border border-brand-ink/15 p-1"
          role="group"
          aria-label="Modo del mapa"
        >
          {(
            [
              { id: "cerca" as const, label: "Cerca de mí" },
              { id: "explorar" as const, label: "Explorar región" },
            ] as const
          ).map((opt) => {
            const activo = modo === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onModoChange(opt.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-fast focus-ring",
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

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por deporte">
          {FILTROS_DEPORTE.map((chip) => {
            const activo = filtro === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => onFiltroChange(chip.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-fast",
                  "focus-ring",
                  activo
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-brand-ink/20 text-brand-ink/75 hover:border-brand-primary hover:text-brand-ink"
                )}
                aria-pressed={activo}
              >
                {chip.color ? (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: chip.color }}
                    aria-hidden
                  />
                ) : null}
                {chip.label}
              </button>
            );
          })}
        </div>

        {modo === "cerca" ? (
          <div className="flex flex-wrap items-center gap-3 text-sm text-brand-ink">
            <label
              htmlFor="radio-mapa"
              className="text-xs font-bold uppercase tracking-wider text-brand-ink/55"
            >
              Radio
            </label>
            <input
              id="radio-mapa"
              type="range"
              min={2}
              max={MAP_REGION.radiusKm}
              value={radioKm}
              onChange={(e) => onRadioChange(Number(e.target.value))}
              className="h-2 w-36 max-w-[50vw] accent-brand-primary"
            />
            <output htmlFor="radio-mapa" className="font-bold text-brand-primary">
              {radioKm} km
            </output>
          </div>
        ) : (
          <p className="text-xs text-brand-ink/55">
            Mostramos puntos a hasta {MAP_REGION.radiusKm} km de Santa Fe (Paraná, Santo
            Tomé y alrededores).
          </p>
        )}
      </div>
    </div>
  );
}
