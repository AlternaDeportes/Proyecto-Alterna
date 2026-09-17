/**
 * Teselas del mapa — OSM raster, sin API key.
 * La textura de marca (papel, tinta, acento) se aplica en `.alterna-map` (globals.css).
 */
export const MAP_TILES = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
  subdomains: "abc",
} as const;
