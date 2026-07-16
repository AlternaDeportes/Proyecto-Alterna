# Video del hero — ALTERNA

Colocá acá el loop definitivo del hero (rodaje real de los deportes, **no** imágenes estáticas).

## Archivos esperados

| Archivo | Uso |
|---------|-----|
| `hero-loop.mp4` | Fuente principal (H.264) |
| `hero-loop.webm` | Opcional, mejor compresión en Chrome/Firefox |

El sitio referencia ambos desde `index.html`. Si solo tenés MP4, alcanza con subir `hero-loop.mp4`.

## Recomendaciones técnicas

- Duración: **15–40 s**, pensado en loop sin corte brusco
- Sin audio (el `<video>` va `muted`)
- Resolución: **1920×1080** o **1280×720**
- Peso objetivo: **&lt; 8 MB** (comprimir con HandBrake o similar)
- Evitar texto quemado en el video (el título va en HTML encima)

## Reemplazo

1. Exportá el loop con el nombre exacto `hero-loop.mp4`
2. Copiá el archivo a esta carpeta
3. Recargá la web (Ctrl+F5)

Si el archivo no está o falla la carga, el hero muestra un fondo oscuro cinematográfico hasta que subas el video.
