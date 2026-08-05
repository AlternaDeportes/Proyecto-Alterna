import type { DeporteDetalle } from "@/modules/deportes/types";
import { DIFICULTAD_LABEL } from "@/modules/deportes/types";

interface SportMetaProps {
  deporte: DeporteDetalle;
}

/** Metadatos editoriales — tipografía, no cards decorativas. */
export function SportMeta({ deporte }: SportMetaProps) {
  const jugadores =
    deporte.jugadoresMin && deporte.jugadoresMax
      ? deporte.jugadoresMin === deporte.jugadoresMax
        ? `${deporte.jugadoresMin}`
        : `${deporte.jugadoresMin}–${deporte.jugadoresMax}`
      : "Variable";

  const items = [
    { label: "Dificultad", value: DIFICULTAD_LABEL[deporte.dificultad] },
    { label: "Jugadores", value: jugadores },
    { label: "Equipamiento", value: deporte.equipamiento ?? "Consultar en el club" },
  ];

  return (
    <dl className="divide-y divide-brand-ink/10 border-y border-brand-ink/10">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink/45">
            {item.label}
          </dt>
          <dd className="font-display text-base font-bold uppercase text-brand-ink sm:text-lg">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
