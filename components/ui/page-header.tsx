import { type ReactNode } from "react";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export type PageHeaderTone = "paper" | "ink";
export type PageHeaderEyebrowStyle = "text" | "badge";

export interface PageHeaderProps {
  eyebrow?: string;
  /** Estilo del eyebrow: tipográfico (default en paper) o Badge (default en ink) */
  eyebrowStyle?: PageHeaderEyebrowStyle;
  /** Solo aplica si eyebrowStyle="badge" */
  eyebrowVariant?: BadgeProps["variant"];
  /** Variante tipográfica del ds-eyebrow */
  eyebrowTone?: "primary" | "secondary" | "accent" | "white";
  title: string;
  description?: string;
  actions?: ReactNode;
  /** paper = sitio editorial actual; ink = hero documental */
  tone?: PageHeaderTone;
  /** Franja tricolor bajo el header (default true en paper) */
  stripe?: boolean;
  className?: string;
  /** Blobs solo en tone ink */
  blobs?: boolean;
  titleId?: string;
  children?: ReactNode;
}

/**
 * Cabecera de página unificada — contrato Fase B.
 * Paper: ColorStripe + ds-eyebrow + tipografía ink.
 * Ink: blobs opcionales + Badge/eyebrow claro + tipografía blanca.
 */
export function PageHeader({
  eyebrow,
  eyebrowStyle,
  eyebrowVariant = "secondary",
  eyebrowTone,
  title,
  description,
  actions,
  tone = "paper",
  stripe,
  className,
  blobs,
  titleId,
  children,
}: PageHeaderProps) {
  const headingId = titleId ?? "page-title";
  const isPaper = tone === "paper";
  const style = eyebrowStyle ?? (isPaper ? "text" : "badge");
  const showStripe = stripe ?? isPaper;
  const showBlobs = blobs ?? !isPaper;
  const textEyebrowClass =
    eyebrowTone === "white"
      ? "ds-eyebrow--white"
      : eyebrowTone === "accent"
        ? "ds-eyebrow--accent"
        : eyebrowTone === "secondary"
          ? "ds-eyebrow--secondary"
          : "ds-eyebrow--primary";

  return (
    <>
      <Section
        tone={tone}
        border="bottom"
        blobs={showBlobs ? "section" : false}
        className={cn("pt-28 sm:pt-32", className)}
        aria-labelledby={headingId}
      >
        <Container>
          <Reveal>
            {eyebrow ? (
              style === "badge" ? (
                <Badge variant={eyebrowVariant} className="mb-4">
                  {eyebrow}
                </Badge>
              ) : (
                <p className={cn("ds-eyebrow mb-4", textEyebrowClass)}>{eyebrow}</p>
              )
            ) : null}
            <h1
              id={headingId}
              className={cn(
                "ds-display max-w-3xl text-display-sm sm:text-display-md",
                isPaper ? "text-brand-ink" : "text-white"
              )}
            >
              {title}
            </h1>
            {description ? (
              <p
                className={cn(
                  "mt-4 max-w-2xl text-lg leading-relaxed",
                  isPaper ? "text-brand-ink/70" : "text-white/75"
                )}
              >
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
            ) : null}
            {children}
          </Reveal>
        </Container>
      </Section>
      {showStripe ? <ColorStripe /> : null}
    </>
  );
}
