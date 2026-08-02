import { ImageResponse } from "next/og";
import { designTokens } from "@/config/design-tokens";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const { ink, primary, primaryDeep, secondary, surface } = designTokens.colors;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${ink} 0%, ${primaryDeep} 55%, ${primary} 100%)`,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: secondary,
          }}
        >
          {siteConfig.defaultCity.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: surface,
              textTransform: "lowercase",
              lineHeight: 1,
            }}
          >
            alterna
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Deportes alternativos · Documental · Mapa
        </div>
      </div>
    ),
    { ...size }
  );
}
