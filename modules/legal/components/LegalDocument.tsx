import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlobBackground } from "@/components/ui/blob-background";
import { Reveal } from "@/components/ui/reveal";

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
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="secondary">{badge}</Badge>
            <h1 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-white/75">{summary}</p>
            <p className="mt-3 text-xs text-white/45">Última actualización: {updatedAt}</p>
          </Reveal>
        </div>
      </section>

      <article className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          {sections.map((section) => (
            <Reveal key={section.title}>
              <section aria-labelledby={slugify(section.title)}>
                <h2
                  id={slugify(section.title)}
                  className="font-display text-xl font-bold uppercase text-white"
                >
                  {section.title}
                </h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-white/70">
                    {p}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/70">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}

          <p className="border-t border-white/10 pt-8 text-sm text-white/50">
            También podés leer{" "}
            <Link href="/privacidad" className="text-brand-secondary hover:underline">
              Privacidad
            </Link>
            ,{" "}
            <Link href="/terminos" className="text-brand-secondary hover:underline">
              Términos
            </Link>{" "}
            y{" "}
            <Link href="/cookies" className="text-brand-secondary hover:underline">
              Cookies
            </Link>
            .
          </p>
        </div>
      </article>
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
