// Seasonal moods: purely cosmetic. They never change scores, grades or text.
// Dates use the viewer's local calendar. Islamic-calendar moods use the
// browser's built-in Umm al-Qura calendar (Intl), so no date tables are needed.

export type SeasonId =
  | "eid"
  | "newroz"
  | "language-day"
  | "christmas"
  | "new-year"
  | "halloween"
  | "ramadan"
  | "birthday";

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
};

/** All mood ids, in priority order: when two overlap, the earlier one wins. */
export const SEASON_ORDER: SeasonId[] = [
  "newroz",
  "eid",
  "language-day",
  "christmas",
  "new-year",
  "halloween",
  "ramadan",
  "birthday",
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
};

/**
 * The mood for a date, or undefined for "everyday".
 * `allowed` is the admin setting: "auto" (all moods), "off", or a list of ids.
 * (The server default is "off" while moods are experimental.)
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
