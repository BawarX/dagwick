// Seasonal moods: purely cosmetic. They never change scores, grades or text.
// Dates use the viewer's local calendar. Islamic-calendar moods use the
// browser's built-in Umm al-Qura calendar (Intl). Diwali and the Lantern Festival
// follow lunisolar calendars the browser doesn't have, so their dates are listed
// per year (the same tables as src/dagwick/themes.py).

export type SeasonId =
  | "eid"
  | "newroz"
  | "language-day"
  | "christmas"
  | "new-year"
  | "halloween"
  | "ramadan"
  | "birthday"
  | "carsema-sor"
  | "diwali"
  | "lantern-festival";

export interface Season {
  id: SeasonId;
  name: string;
  greeting: string;
  icon: string;
}

export const SEASONS: Record<SeasonId, Season> = {
  eid: {
    id: "eid",
    name: "Eid",
    greeting: "Eid Mubarak!",
    icon: "🍪",
  },
  newroz: {
    id: "newroz",
    name: "Newroz",
    greeting: "Happy Newroz!",
    icon: "🔥",
  },
  "language-day": {
    id: "language-day",
    name: "Kurdish Language Day",
    greeting: "Kurdish Language Day",
    icon: "✍️",
  },
  christmas: {
    id: "christmas",
    name: "Christmas",
    greeting: "Merry Christmas!",
    icon: "🎄",
  },
  "new-year": {
    id: "new-year",
    name: "New Year",
    greeting: "Happy New Year!",
    icon: "🎉",
  },
  halloween: { id: "halloween", name: "Halloween", greeting: "Happy Halloween!", icon: "🎃" },
  ramadan: {
    id: "ramadan",
    name: "Ramadan",
    greeting: "Ramadan Kareem",
    icon: "🌙",
  },
  birthday: { id: "birthday", name: "Dagwick's birthday", greeting: "Dagwick turns another year older!", icon: "🎂" },
  "carsema-sor": {
    id: "carsema-sor",
    name: "Çarşema Sor",
    greeting: "Happy Çarşema Sor, the Yazidi New Year!",
    icon: "🥚",
  },
  diwali: { id: "diwali", name: "Diwali", greeting: "Happy Diwali!", icon: "🪔" },
  "lantern-festival": {
    id: "lantern-festival",
    name: "Lantern Festival",
    greeting: "Happy Lantern Festival!",
    icon: "🏮",
  },
};

/**
 * All mood ids, in priority order: when two overlap, the earlier one wins. A short
 * festival comes before a longer one it can fall in (the birthday before Diwali,
 * Diwali before Halloween, the Lantern Festival before Ramadan).
 */
export const SEASON_ORDER: SeasonId[] = [
  "newroz",
  "eid",
  "language-day",
  "carsema-sor",
  "lantern-festival",
  "christmas",
  "new-year",
  "birthday",
  "diwali",
  "halloween",
  "ramadan",
];

const inRange = (m: number, d: number, from: [number, number], to: [number, number]) => {
  const v = m * 100 + d;
  const a = from[0] * 100 + from[1];
  const b = to[0] * 100 + to[1];
  return a <= b ? v >= a && v <= b : v >= a || v <= b; // range may wrap the year
};

/** Islamic (Umm al-Qura) month and day, or undefined if the runtime lacks the calendar. */
export function islamicDate(date: Date): { month: number; day: number } | undefined {
  try {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);
    const month = Number(parts.find((p) => p.type === "month")?.value);
    const day = Number(parts.find((p) => p.type === "day")?.value);
    return month && day ? { month, day } : undefined;
  } catch {
    return undefined;
  }
}

/** Diwali's main day (Lakshmi Puja) per year; the mood runs from 2 days before to 2 after. */
export const DIWALI: Record<number, [number, number]> = {
  2026: [11, 8],
  2027: [10, 29],
  2028: [10, 17],
  2029: [11, 5],
  2030: [10, 26],
  2031: [11, 14],
};

/** The Lantern Festival (15th day of the first Chinese month) per year. */
export const LANTERN_FESTIVAL: Record<number, [number, number]> = {
  2026: [3, 3],
  2027: [2, 20],
  2028: [2, 9],
  2029: [2, 27],
  2030: [2, 17],
  2031: [2, 6],
};

const DAY_MS = 86_400_000;

/** Whole days from the listed day of this year to `date` (undefined if the year isn't listed). */
function daysFrom(table: Record<number, [number, number]>, date: Date): number | undefined {
  const listed = table[date.getFullYear()];
  if (!listed) return undefined;
  const at = new Date(date.getFullYear(), listed[0] - 1, listed[1]);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((today.getTime() - at.getTime()) / DAY_MS);
}

const RULES: Record<SeasonId, (date: Date) => boolean> = {
  eid: (date) => {
    const h = islamicDate(date);
    // Eid al-Fitr (1–3 Shawwal) and Eid al-Adha (10–13 Dhu al-Hijjah).
    return !!h && ((h.month === 10 && h.day <= 3) || (h.month === 12 && h.day >= 10 && h.day <= 13));
  },
  newroz: (d) => inRange(d.getMonth() + 1, d.getDate(), [3, 19], [3, 23]),
  "language-day": (d) => d.getMonth() + 1 === 5 && d.getDate() === 15,
  christmas: (d) => inRange(d.getMonth() + 1, d.getDate(), [12, 18], [12, 26]),
  "new-year": (d) => inRange(d.getMonth() + 1, d.getDate(), [12, 31], [1, 2]),
  halloween: (d) => inRange(d.getMonth() + 1, d.getDate(), [10, 24], [11, 1]),
  ramadan: (date) => islamicDate(date)?.month === 9,
  birthday: (d) => d.getMonth() + 1 === 11 && d.getDate() === 8,
  // The first Wednesday of April on the Julian calendar: the first Wednesday from 14 April.
  "carsema-sor": (d) => d.getMonth() + 1 === 4 && d.getDate() >= 14 && d.getDate() <= 20 && d.getDay() === 3,
  diwali: (d) => {
    const n = daysFrom(DIWALI, d);
    return n !== undefined && Math.abs(n) <= 2;
  },
  "lantern-festival": (d) => daysFrom(LANTERN_FESTIVAL, d) === 0,
};

/**
 * The mood for a date, or undefined for "everyday".
 * `allowed` is the admin setting: "auto" (all moods), "off", or a list of ids.
 * (The server default is "auto".)
 */
export function seasonFor(date: Date, allowed: "auto" | "off" | SeasonId[] = "auto"): Season | undefined {
  if (allowed === "off") return undefined;
  const ids = allowed === "auto" ? SEASON_ORDER : SEASON_ORDER.filter((id) => allowed.includes(id));
  const id = ids.find((s) => RULES[s](date));
  return id ? SEASONS[id] : undefined;
}

export function isSeasonId(value: string | null | undefined): value is SeasonId {
  return !!value && value in SEASONS;
}
