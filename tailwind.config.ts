import type { Config } from "tailwindcss";
import { designTokens } from "./config/design-tokens";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: designTokens.colors.primary,
          secondary: designTokens.colors.secondary,
          accent: designTokens.colors.accent,
          ink: designTokens.colors.ink,
          surface: designTokens.colors.surface,
          "ink-deep": designTokens.colors.inkDeep,
          "ink-blue": designTokens.colors.inkBlue,
          "primary-deep": designTokens.colors.primaryDeep,
        },
        sport: {
          ultimate: designTokens.sports.ultimate,
          newcom: designTokens.sports.newcom,
          wingfoil: designTokens.sports.wingfoil,
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": [
          designTokens.type.display.sm,
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "900" },
        ],
        "display-md": [
          designTokens.type.display.md,
          { lineHeight: "1.02", letterSpacing: "-0.02em", fontWeight: "900" },
        ],
        "display-lg": [
          designTokens.type.display.lg,
          { lineHeight: "0.98", letterSpacing: "-0.03em", fontWeight: "900" },
        ],
        "display-xl": [
          designTokens.type.display.xl,
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "900" },
        ],
      },
      maxWidth: {
        content: designTokens.space.content,
      },
      borderRadius: {
        organic: designTokens.radius.organic,
        frame: designTokens.radius.frame,
        soft: designTokens.radius.soft,
      },
      boxShadow: {
        soft: designTokens.shadow.soft,
        lift: designTokens.shadow.lift,
        "glow-primary": designTokens.shadow.glowPrimary,
      },
      transitionDuration: {
        fast: designTokens.motion.fast,
        base: designTokens.motion.base,
        slow: designTokens.motion.slow,
      },
      transitionTimingFunction: {
        brand: designTokens.motion.easing,
      },
      zIndex: {
        raised: String(designTokens.z.raised),
        sticky: String(designTokens.z.sticky),
        header: String(designTokens.z.header),
        overlay: String(designTokens.z.overlay),
        toast: String(designTokens.z.toast),
      },
      keyframes: {
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(3%, 2%) scale(1.05)" },
        },
        "blob-drift-reverse": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-2%, -3%) scale(1.04)" },
        },
        "blob-pulse": {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.28" },
        },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(1.5rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "blob-drift": `blob-drift ${designTokens.motion.blob.drift} ease-in-out infinite`,
        "blob-drift-reverse": `blob-drift-reverse ${designTokens.motion.blob.driftReverse} ease-in-out infinite`,
        "blob-pulse": `blob-pulse ${designTokens.motion.blob.pulse} ease-in-out infinite`,
        "reveal-up": `reveal-up ${designTokens.motion.reveal} var(--ease-brand, cubic-bezier(0.22, 1, 0.36, 1)) both`,
      },
    },
  },
  plugins: [],
};

export default config;
