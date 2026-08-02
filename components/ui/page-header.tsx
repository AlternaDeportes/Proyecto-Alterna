import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export interface PageHeaderProps {
  eyebrow?: string;
  eyebrowVariant?: BadgeProps["variant"];
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Espacio extra bajo el nav fijo */
  className?: string;
  /** Blobs de marca en el header */
  blobs?: boolean;
  /** id del h1 para aria-labelledby */
  titleId?: string;
  children?: ReactNode;
}

/**
 * Cabecera de página compartida — mismo lenguaje en todas las rutas.
 * Eyebrow (badge) + display title + descripción + acciones opcionales.
 */
export function PageHeader({
  eyebrow,
  eyebrowVariant = "secondary",
  title,
  description,
  actions,
  className,
  blobs = true,
  titleId,
  children,
}: PageHeaderProps) {
  const headingId = titleId ?? "page-title";

  return (
    <Section
      tone="ink"
      border="bottom"
      blobs={blobs ? "section" : false}
      className={cn("pt-28 sm:pt-32", className)}
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          {eyebrow ? (
            <Badge variant={eyebrowVariant} className="mb-4">
              {eyebrow}
            </Badge>
          ) : null}
          <h1 id={headingId} className="ds-display max-w-3xl text-display-sm sm:text-display-md">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
              {description}
            </p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          {children}
        </Reveal>
      </Container>
    </Section>
  );
}
