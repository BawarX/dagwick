import { type SeasonId, isSeasonId } from "./season";

// Seasonal themes for all of Airflow. The server adds a theme to Airflow's own UI config
// (see themes.py); each viewer's choices live in cookies that the server reads.

export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  /** [month, day], inclusive. */
  start: [number, number];
  end: [number, number];
  /** In season today (server date). */
  active: boolean;
  /** The dates in words, for example "18 Dec – 2 Jan · every year". */
  when?: string;
  /** False while a theme's decorations for Airflow aren't made yet: it is "coming soon". */
  decorated?: boolean;
}

/** One viewer's choices. By default every theme shows on its dates. */
export interface Choice {
  /** Show themes on their dates. */
  auto: boolean;
  /** A theme applied by hand: it shows whatever the date. */
  applied?: string;
  /** Themes removed by hand while in season. */
  removed: string[];
}

/**
 * The viewer's choices when this page loaded, which is what Airflow drew its theme from.
 * Captured once: the bundle loads once per page, and only Dagwick changes these cookies,
 * so later changes (applied without a reload) never move what Airflow actually drew.
 */
export const COOKIES_AT_LOAD = typeof document === "undefined" ? "" : document.cookie;

export const OFF_COOKIE = "dagwick_themes_off";
export const APPLIED_COOKIE = "dagwick_theme";
const ALL = "*"; // in OFF_COOKIE: no theme appears by date
const YEAR = 60 * 60 * 24 * 365;

export function readCookies(cookie: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of cookie.split(";")) {
    const at = part.indexOf("=");
    if (at > 0) out[part.slice(0, at).trim()] = decodeURIComponent(part.slice(at + 1).trim());
  }
  return out;
}

export function readChoice(cookie: string): Choice {
  const jar = readCookies(cookie);
  const off = (jar[OFF_COOKIE] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    auto: !off.includes(ALL),
    applied: jar[APPLIED_COOKIE] || undefined,
    removed: off.filter((s) => s !== ALL),
  };
}

/** Cookie strings that store a choice: a year for the settings, until removed for the theme. */
export function choiceCookies(choice: Choice): string[] {
  const off = [...(choice.auto ? [] : [ALL]), ...choice.removed];
  const keep = (name: string, value: string) =>
    value ? `${name}=${value}; Path=/; Max-Age=${YEAR}; SameSite=Lax` : `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  return [keep(OFF_COOKIE, off.join(",")), keep(APPLIED_COOKIE, choice.applied ?? "")];
}

/** A theme that is listed but can't show yet. */
export const comingSoon = (theme: ThemeInfo) => theme.decorated === false;

/** The theme this viewer sees now (never one coming soon). Must match pick_theme in themes.py. */
export function pickTheme(themes: ThemeInfo[], choice: Choice): string | undefined {
  const ready = themes.filter((t) => !comingSoon(t));
  if (choice.applied && ready.some((t) => t.id === choice.applied)) return choice.applied;
  if (!choice.auto) return undefined;
  return ready.find((t) => t.active && !choice.removed.includes(t.id))?.id;
}

/** Apply a theme by hand: it replaces any other and shows whatever the date. */
export function applyTheme(choice: Choice, id: string): Choice {
  return {
    ...choice,
    applied: id,
    removed: choice.removed.filter((r) => r !== id),
  };
}

/** Remove the theme showing now; one in season stays away until applied again. */
export function removeTheme(themes: ThemeInfo[], choice: Choice, id: string): Choice {
  const inSeason = themes.find((t) => t.id === id)?.active;
  return {
    ...choice,
    applied: choice.applied === id ? undefined : choice.applied,
    removed: inSeason && !choice.removed.includes(id) ? [...choice.removed, id] : choice.removed,
  };
}

/** Turn "show themes on their dates" on or off. Turning it on brings back removed themes. */
export function setAuto(choice: Choice, auto: boolean): Choice {
  return { ...choice, auto, removed: auto ? [] : choice.removed };
}

export type ThemeStatus = "applied" | "showing" | "removed" | "waiting" | "soon";

export function themeStatus(theme: ThemeInfo, themes: ThemeInfo[], choice: Choice): ThemeStatus {
  if (comingSoon(theme)) return "soon";
  if (pickTheme(themes, choice) === theme.id) return choice.applied === theme.id ? "applied" : "showing";
  return theme.active && choice.auto ? "removed" : "waiting";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "18 Dec – 2 Jan", or "15 May" for a single day. */
export function dateRange(start: [number, number], end: [number, number]): string {
  const f = ([m, d]: [number, number]) => `${d} ${MONTHS[m - 1]}`;
  return start[0] === end[0] && start[1] === end[1] ? f(start) : `${f(start)} – ${f(end)}`;
}

/** The banner's seasonal look for a theme, when Dagwick has one (theme and mood ids match). */
export function themeSeason(themeId: string | undefined): SeasonId | undefined {
  return isSeasonId(themeId) ? themeId : undefined;
}
