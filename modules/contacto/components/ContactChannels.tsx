import { siteConfig, socialLinks } from "@/config/site";
import { Card } from "@/components/ui/card";

export function ContactChannels() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Card className="border-white/10 bg-white/[0.04] p-6">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
          Email
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Para consultas, prensa o colaboraciones:
        </p>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="mt-4 inline-block text-base font-semibold text-brand-secondary transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          {siteConfig.contact.email}
        </a>
        {siteConfig.contact.phone ? (
          <p className="mt-3 text-sm text-white/55">
            Tel:{" "}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="text-white/80 hover:text-brand-secondary"
            >
              {siteConfig.contact.phone}
            </a>
          </p>
        ) : null}
      </Card>

      <Card className="border-white/10 bg-white/[0.04] p-6">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
          Redes
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Seguinos y enterate de estrenos y eventos.
        </p>
        <ul className="mt-4 space-y-2.5 text-sm">
          {socialLinks.map(({ key, label, hint }) => (
            <li key={key}>
              <a
                href={siteConfig.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-2 transition-colors hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <span className="font-semibold text-white">{label}</span>
                <span className="text-white/45">{hint}</span>
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
