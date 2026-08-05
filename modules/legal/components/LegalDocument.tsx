import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

interface LegalSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalPageProps {
  badge: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
}

export function LegalDocument({
  badge,
  title,
  summary,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <main id="contenido-principal">
      <PageHeader
        tone="paper"
        eyebrow={badge}
        eyebrowTone="primary"
        title={title}
        description={summary}
      >
        <p className="mt-3 text-xs text-brand-ink/45">Última actualización: {updatedAt}</p>
      </PageHeader>

      <Section as="article" tone="paper" density="tight">
        <Container narrow className="space-y-10">
          {sections.map((section) => (
            <Reveal key={section.title}>
              <section aria-labelledby={slugify(section.title)}>
                <h2
                  id={slugify(section.title)}
                  className="font-display text-xl font-bold uppercase text-brand-ink"
                >
                  {section.title}
                </h2>
                {section.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mt-3 text-sm leading-relaxed text-brand-ink/70"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-brand-ink/70">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}

          <p className="border-t border-brand-ink/10 pt-8 text-sm text-brand-ink/50">
            También podés leer{" "}
            <Link href="/privacidad" className="text-brand-primary hover:underline">
              Privacidad
            </Link>
            ,{" "}
            <Link href="/terminos" className="text-brand-primary hover:underline">
              Términos
            </Link>{" "}
            y{" "}
            <Link href="/cookies" className="text-brand-primary hover:underline">
              Cookies
            </Link>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
