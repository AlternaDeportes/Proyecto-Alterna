import { siteConfig, socialLinks } from "@/config/site";
import { Card } from "@/components/ui/card";

export function ContactChannels() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Card surface="paper" className="p-6">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-brand-ink">
          Email
        </h2>
        <p className="mt-2 text-sm text-brand-ink/60">
          Para consultas, prensa o colaboraciones:
        </p>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="mt-4 inline-block text-base font-semibold text-brand-primary transition-colors hover:text-brand-ink focus-ring rounded-sm"
        >
          {siteConfig.contact.email}
        </a>
        {siteConfig.contact.phone ? (
          <p className="mt-3 text-sm text-brand-ink/55">
            Tel:{" "}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="text-brand-ink/80 hover:text-brand-primary"
            >
              {siteConfig.contact.phone}
            </a>
          </p>
        ) : null}
      </Card>

      <Card surface="paper" className="p-6">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-brand-ink">
          Redes
        </h2>
        <p className="mt-2 text-sm text-brand-ink/60">
          Seguinos y enterate de estrenos y eventos.
        </p>
        <ul className="mt-4 space-y-2.5 text-sm">
          {socialLinks.map(({ key, label, hint }) => (
            <li key={key}>
              <a
                href={siteConfig.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-2 rounded-sm transition-colors hover:text-brand-primary focus-ring"
              >
                <span className="font-semibold text-brand-ink">{label}</span>
                <span className="text-brand-ink/45">{hint}</span>
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
