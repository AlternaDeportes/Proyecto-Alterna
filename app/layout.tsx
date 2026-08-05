import type { Metadata, Viewport } from "next";
import { Inter, Montserrat_Alternates } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { designTokens } from "@/config/design-tokens";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const fontDisplay = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: designTokens.colors.surface },
    { media: "(prefers-color-scheme: dark)", color: designTokens.colors.surface },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${fontDisplay.variable} ${fontBody.variable}`}
    >
      <body className="min-h-dvh">
        <JsonLdScript id="ld-organization" data={organizationJsonLd()} />
        <JsonLdScript id="ld-website" data={websiteJsonLd()} />
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded-soft focus:bg-brand-surface focus:px-4 focus:py-2 focus:text-brand-ink focus-ring"
        >
          Saltar al contenido principal
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
