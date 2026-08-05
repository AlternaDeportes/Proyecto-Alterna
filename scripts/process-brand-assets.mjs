/**
 * Procesa mesas de trabajo de `Logos y mas/` → PNG con negro transparente
 * en `public/brand/icons` y `public/brand/patterns`.
 *
 * Uso: node scripts/process-brand-assets.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "Logos y mas");
const iconsDir = path.join(root, "public/brand/icons");
const patternsDir = path.join(root, "public/brand/patterns");

const icons = {
  "mark-a.png": "Mesa de trabajo 11.png",
  "mapa-puente.png": "Mesa de trabajo 19.png",
  "comunidad-red.png": "Mesa de trabajo 20.png",
  "newcom.png": "Mesa de trabajo 21.png",
  "comunidad-personas.png": "Mesa de trabajo 22.png",
  "pasion.png": "Mesa de trabajo 23.png",
  "wingfoil.png": "Mesa de trabajo 24.png",
  "ultimate.png": "Mesa de trabajo 26.png",
  "accion.png": "Mesa de trabajo 27.png",
};

const patterns = {
  "marks-diagonal.png": "Mesa de trabajo 8.png",
  "marks-grid.png": "Mesa de trabajo 12.png",
  "ondas.png": "Mesa de trabajo 16.png",
  "marco-panel.png": "Mesa de trabajo 18 copia.png",
  "sello-circular.png": "Mesa de trabajo 18 copia 2.png",
};

async function knockBlack(input, output, threshold = 28) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] <= threshold && data[i + 1] <= threshold && data[i + 2] <= threshold) {
      data[i + 3] = 0;
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);
  console.log("ok", path.basename(output));
}

for (const [out, file] of Object.entries(icons)) {
  await knockBlack(path.join(src, file), path.join(iconsDir, out), 32);
}
for (const [out, file] of Object.entries(patterns)) {
  await knockBlack(path.join(src, file), path.join(patternsDir, out), 24);
}
console.log("done");
