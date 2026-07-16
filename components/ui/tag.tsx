import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

/** Etiqueta suave para chips de categoría (hero, filtros) */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1",
        "text-xs font-semibold text-white/90",
        className
      )}
    >
      {children}
    </span>
  );
}
