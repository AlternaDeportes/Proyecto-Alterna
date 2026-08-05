import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { footerNavigation, siteConfig, socialLinks } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-ink/10 bg-brand-surface text-brand-ink/70">
      <ColorStripe />
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <BrandLogo variant="azul" size="md" href="/" />
          <p className="mt-3 text-sm font-semibold text-brand-primary">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-ink/65">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-brand-ink">
            Explorar
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-brand-primary focus-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-brand-ink">
            Contacto y redes
          </h2>
          <p className="mt-4 text-sm">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="rounded-sm font-semibold text-brand-ink hover:text-brand-primary focus-ring"
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
                  className="inline-flex items-baseline gap-2 rounded-sm transition-colors hover:text-brand-primary focus-ring"
                >
                  <span className="font-semibold text-brand-ink">{label}</span>
                  <span className="text-brand-ink/45">{hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-brand-ink/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-3 text-center text-xs text-brand-ink/45 sm:flex-row sm:text-left">
          <p>
            © {year} {siteConfig.name} · {siteConfig.defaultCity.name},{" "}
            {siteConfig.defaultCity.country}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacidad" className="rounded-sm hover:text-brand-primary focus-ring">
              Privacidad
            </Link>
            <Link href="/terminos" className="rounded-sm hover:text-brand-primary focus-ring">
              Términos
            </Link>
            <Link href="/cookies" className="rounded-sm hover:text-brand-primary focus-ring">
              Cookies
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
