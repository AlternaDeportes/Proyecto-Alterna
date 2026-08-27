/** Zona horaria del proyecto (Santa Fe). Argentina no usa DST. */
export const TZ_AR = "America/Argentina/Buenos_Aires";

export function ymdInAR(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_AR,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { y: num("year"), m: num("month"), d: num("day") };
}

/** 00:00 ART del día (UTC+0 = ART+3). */
function artMidnight(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d, 3, 0, 0));
}

export function startOfMonthAR(date = new Date()) {
  const { y, m } = ymdInAR(date);
  return artMidnight(y, m, 1);
}

export function startOfNextMonthAR(date = new Date()) {
  const { y, m } = ymdInAR(date);
  return artMidnight(y, m + 1, 1);
}

export function startOfPreviousMonthAR(date = new Date()) {
  const { y, m } = ymdInAR(date);
  return artMidnight(y, m - 1, 1);
}

export function startOfTomorrowAR(date = new Date()) {
  const { y, m, d } = ymdInAR(date);
  return artMidnight(y, m, d + 1);
}

export function daysAgoAR(n: number, date = new Date()) {
  const { y, m, d } = ymdInAR(date);
  return artMidnight(y, m, d - n);
}

export function etiquetaMesAR(date = new Date()) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ_AR,
    month: "long",
    year: "numeric",
  }).format(date);
}

export function fechaCortaAR(iso: string | Date) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ_AR,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof iso === "string" ? new Date(iso) : iso);
}

export function ymdKeyAR(date: Date) {
  const { y, m, d } = ymdInAR(date);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
