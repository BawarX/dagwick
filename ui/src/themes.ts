// Seasonal themes for all of Airflow. The server adds a theme to Airflow's own UI config
// on its dates; each viewer's choices live in cookies the server reads (see themes.py).

export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  /** [month, day], inclusive. */
  start: [number, number];
  end: [number, number];
  /** In season today (server date). */
  active: boolean;
}

export const OFF_COOKIE = "dagwick_themes_off";
export const PREVIEW_COOKIE = "dagwick_theme_preview";
const YEAR = 60 * 60 * 24 * 365;

export function readCookies(cookie: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of cookie.split(";")) {
    const at = part.indexOf("=");
    if (at > 0)
      out[part.slice(0, at).trim()] = decodeURIComponent(
        part.slice(at + 1).trim(),
      );
  }
  return out;
}

/** Theme ids this viewer turned off. */
export function offList(cookie: string): string[] {
  return (readCookies(cookie)[OFF_COOKIE] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function withOff(list: string[], id: string, off: boolean): string[] {
  const rest = list.filter((x) => x !== id);
  return off ? [...rest, id] : rest;
}

/** Cookie strings to store the choices (a year for on/off, the browser session for a preview). */
export function offCookie(list: string[]): string {
  return list.length
    ? `${OFF_COOKIE}=${list.join(",")}; Path=/; Max-Age=${YEAR}; SameSite=Lax`
    : `${OFF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function previewCookie(id?: string): string {
  return id
    ? `${PREVIEW_COOKIE}=${id}; Path=/; SameSite=Lax`
    : `${PREVIEW_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "18 Dec – 2 Jan", or "15 May" for a single day. */
export function dateRange(
  start: [number, number],
  end: [number, number],
): string {
  const f = ([m, d]: [number, number]) => `${d} ${MONTHS[m - 1]}`;
  return start[0] === end[0] && start[1] === end[1]
    ? f(start)
    : `${f(start)} – ${f(end)}`;
}

export type ThemeStatus = "preview" | "showing" | "off" | "waiting";

/** What this viewer sees for a theme right now. */
export function themeStatus(
  theme: ThemeInfo,
  off: string[],
  preview?: string,
): ThemeStatus {
  if (preview === theme.id) return "preview";
  if (off.includes(theme.id)) return "off";
  return theme.active && !preview ? "showing" : "waiting";
}
