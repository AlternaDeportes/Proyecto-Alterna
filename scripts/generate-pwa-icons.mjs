/**
 * Genera iconos PWA (PNG) con sharp.
 * Uso: node scripts/generate-pwa-icons.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");

mkdirSync(outDir, { recursive: true });

const INK = "#1D1D1B";
const PRIMARY = "#2A5FF4";
const SECONDARY = "#AFEB00";

function iconSvg(size) {
  const pad = Math.round(size * 0.12);
  const fontSize = Math.round(size * 0.22);
  const letterSpacing = Math.round(size * 0.02);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="${INK}"/>
  <circle cx="${size * 0.78}" cy="${size * 0.22}" r="${size * 0.14}" fill="${PRIMARY}" opacity="0.9"/>
  <circle cx="${size * 0.22}" cy="${size * 0.78}" r="${size * 0.1}" fill="${SECONDARY}" opacity="0.85"/>
  <text x="${size / 2}" y="${size / 2 + fontSize * 0.35}"
    text-anchor="middle"
    font-family="Arial Black, Helvetica, sans-serif"
    font-weight="900"
    font-size="${fontSize}"
    letter-spacing="${letterSpacing}"
    fill="#FFFFFF">A</text>
</svg>`);
}

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "maskable-512.png", size: 512 },
];

for (const { name, size } of sizes) {
  const svg =
    name === "maskable-512.png"
      ? Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${INK}"/>
  <circle cx="${size * 0.78}" cy="${size * 0.22}" r="${size * 0.12}" fill="${PRIMARY}" opacity="0.9"/>
  <circle cx="${size * 0.22}" cy="${size * 0.78}" r="${size * 0.09}" fill="${SECONDARY}" opacity="0.85"/>
  <text x="${size / 2}" y="${size / 2 + Math.round(size * 0.14)}"
    text-anchor="middle"
    font-family="Arial Black, Helvetica, sans-serif"
    font-weight="900"
    font-size="${Math.round(size * 0.28)}"
    fill="#FFFFFF">A</text>
</svg>`)
      : iconSvg(size);

  await sharp(svg).png().toFile(join(outDir, name));
  console.log("Wrote", name);
}

// Favicon 32x32
await sharp(iconSvg(64)).resize(32, 32).png().toFile(join(outDir, "favicon-32.png"));
console.log("Wrote favicon-32.png");
console.log("Done →", outDir);
