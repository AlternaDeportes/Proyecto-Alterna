/**
 * Iconos de pestaña y PWA a partir de las dos «a» cruzadas.
 * Uso: node scripts/generate-pwa-icons.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "icons");
const markPath = join(root, "public", "brand", "icons", "mark-a.png");

mkdirSync(outDir, { recursive: true });

async function render(size, paddingRatio) {
  const inner = Math.round(size * (1 - paddingRatio * 2));
  const mark = await sharp(markPath)
    .trim()
    .resize(inner, inner, {
      fit: "inside",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png();
}

const files = [
  { name: "favicon-32.png", size: 32, pad: 0.08 },
  { name: "apple-touch-icon.png", size: 180, pad: 0.14 },
  { name: "icon-192.png", size: 192, pad: 0.14 },
  { name: "icon-512.png", size: 512, pad: 0.16 },
  { name: "maskable-512.png", size: 512, pad: 0.24 },
];

for (const file of files) {
  const image = await render(file.size, file.pad);
  await image.toFile(join(outDir, file.name));
  console.log("Wrote", file.name);
}

const appIcon = await render(512, 0.16);
await appIcon.toFile(join(root, "app", "icon.png"));
console.log("Wrote app/icon.png");
