import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/container";
import { siteConfig, socialLinks } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-ink text-white/75">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <BrandLogo variant="blanco" size="md" href="/" />
          <p className="mt-3 text-sm font-semibold text-brand-secondary">
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
                  className="transition-colors hover:text-brand-secondary focus-ring rounded-sm"
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
              className="rounded-sm font-semibold text-white hover:text-brand-secondary focus-ring"
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
                  className="inline-flex items-baseline gap-2 rounded-sm transition-colors hover:text-brand-secondary focus-ring"
                >
                  <span className="font-semibold text-white">{label}</span>
                  <span className="text-white/45">{hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-3 text-center text-xs text-white/45 sm:flex-row sm:text-left">
          <p>
            © {year} {siteConfig.name} · {siteConfig.defaultCity.name},{" "}
            {siteConfig.defaultCity.country}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link
              href="/privacidad"
              className="rounded-sm hover:text-brand-secondary focus-ring"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="rounded-sm hover:text-brand-secondary focus-ring"
            >
              Términos
            </Link>
            <Link
              href="/cookies"
              className="rounded-sm hover:text-brand-secondary focus-ring"
            >
              Cookies
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
