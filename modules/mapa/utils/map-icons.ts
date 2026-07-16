import L from "leaflet";

export function crearIconoDeporte(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.35)"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -28],
  });
}

export const iconoUsuario = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#1d1d1b;border:3px solid #fff;box-shadow:0 0 0 3px rgba(42,95,244,0.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
