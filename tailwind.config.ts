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
      borderRadius: {
        organic: "2rem 1rem 2.5rem 1.2rem",
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
      },
      animation: {
        "blob-drift": "blob-drift 18s ease-in-out infinite",
        "blob-drift-reverse": "blob-drift-reverse 22s ease-in-out infinite",
        "blob-pulse": "blob-pulse 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
