"use client";

import { cn } from "@/lib/utils";
import { FILTROS_DEPORTE, type FiltroDeporteSlug } from "@/modules/mapa/types";

interface MapFiltersProps {
  filtro: FiltroDeporteSlug;
  radioKm: number;
  total: number;
  onFiltroChange: (slug: FiltroDeporteSlug) => void;
  onRadioChange: (km: number) => void;
}

export function MapFilters({
  filtro,
  radioKm,
  total,
  onFiltroChange,
  onRadioChange,
}: MapFiltersProps) {
  return (
    <div className="space-y-3 border-b border-white/10 bg-brand-ink/95 p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-lg font-black uppercase text-white sm:text-xl">
          Encontrá tu deporte
        </h1>
        <p className="text-xs font-semibold text-brand-secondary" aria-live="polite">
          {total} actividad{total === 1 ? "" : "es"} cerca
        </p>
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
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary",
                activo
                  ? "border-brand-primary bg-brand-primary/20 text-white"
                  : "border-white/20 text-white/75 hover:border-white/35 hover:text-white"
              )}
              aria-pressed={activo}
            >
              {chip.color && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: chip.color }}
                  aria-hidden
                />
              )}
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
        <label htmlFor="radio-mapa" className="font-semibold">
          Radio
        </label>
        <input
          id="radio-mapa"
          type="range"
          min={2}
          max={30}
          value={radioKm}
          onChange={(e) => onRadioChange(Number(e.target.value))}
          className="h-2 w-36 max-w-[50vw] accent-brand-primary"
        />
        <output htmlFor="radio-mapa" className="font-bold text-white">
          {radioKm} km
        </output>
      </div>
    </div>
  );
}
