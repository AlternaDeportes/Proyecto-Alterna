import { CardLight } from "@/components/ui/card";
import type { DeporteDetalle } from "@/modules/deportes/types";
import { DIFICULTAD_LABEL } from "@/modules/deportes/types";

interface SportMetaProps {
  deporte: DeporteDetalle;
}

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
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <CardLight key={item.label} className="text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/50">
            {item.label}
          </p>
          <p className="mt-2 font-semibold text-brand-ink">{item.value}</p>
        </CardLight>
      ))}
    </div>
  );
}
