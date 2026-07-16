import Link from "next/link";
import { siteConfig, socialLinks } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-black uppercase tracking-wide text-white">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm font-semibold text-brand-secondary">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Explorar
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Contacto y redes
          </h2>
          <p className="mt-4 text-sm">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-semibold text-white hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              {siteConfig.contact.email}
            </a>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
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
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-white/45 sm:flex-row sm:px-6 sm:text-left">
          <p>
            © {year} {siteConfig.name} · {siteConfig.defaultCity.name},{" "}
            {siteConfig.defaultCity.country}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link
              href="/privacidad"
              className="hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              Términos
            </Link>
            <Link
              href="/cookies"
              className="hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
