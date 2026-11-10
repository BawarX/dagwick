import { useEffect, useState } from "react";

import { fetchThemes, loadConfig } from "./api";
import { type Choice, type ThemeInfo, pickTheme, readChoice, themeSeason } from "./themes";
import { SEASONS, type Season, isSeasonId, seasonFor } from "./season";

const STORAGE_KEY = "dagwick.moods.hidden";

/** Per-viewer opt-out. Storage can be blocked (private mode), so every access is guarded. */
function readHidden(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeHidden(hidden: boolean) {
  try {
    if (hidden) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* not persisted; still applies for this page view */
  }
}

/**
 * `?dagwick_mood=halloween` previews a mood regardless of the date;
 * `?dagwick_mood=everyday` previews none. Returns undefined when not previewing.
 */
function previewFromUrl(): Season | null | undefined {
  const value = new URLSearchParams(window.location.search).get("dagwick_mood");
  if (value === "everyday") return null;
  return isSeasonId(value) ? SEASONS[value] : undefined;
}

let themesRequest: ReturnType<typeof fetchThemes> | undefined;

/** The theme list, fetched once per page and shared (a failure lets a later caller retry). */
function loadThemes() {
  themesRequest ??= fetchThemes().catch((e: unknown) => {
    themesRequest = undefined;
    throw e;
  });
  return themesRequest;
}

/**
 * The banner's seasonal look for this viewer.
 *
 * A theme showing on Airflow (by date, or applied by this viewer) sets it. Otherwise
 * the admin's seasonal_moods setting decides, unless this viewer turned off "Show
 * themes on their dates" on the Themes page: then nothing appears by date, banner
 * included. `setting` is undefined when the setting couldn't be read (stay off).
 */
export function bannerSeason(
  themes: ThemeInfo[],
  choice: Choice,
  setting: "auto" | "off" | string[] | undefined,
  date: Date,
): Season | undefined {
  const fromTheme = themeSeason(pickTheme(themes, choice));
  if (fromTheme) return SEASONS[fromTheme];
  if (!choice.auto || setting === undefined) return undefined;
  const allowed = setting === "auto" || setting === "off" ? setting : setting.filter(isSeasonId);
  return seasonFor(date, allowed);
}

export interface SeasonState {
  /** The mood to show now (undefined: everyday, or hidden by the viewer). */
  season?: Season;
  /** A mood is active today, even if the viewer hid it. */
  available?: Season;
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

export function useSeason(): SeasonState {
  const [preview] = useState(previewFromUrl);
  // Moods are off until the server setting enables them (no flash on load).
  const [available, setAvailable] = useState<Season | undefined>(() => preview ?? undefined);
  const [hidden, setHiddenState] = useState(readHidden);

  useEffect(() => {
    if (preview !== undefined) return; // a preview ignores the admin setting
    const ctrl = new AbortController();
    Promise.all([loadThemes().catch(() => []), loadConfig().catch(() => undefined)])
      .then(([themes, cfg]) => {
        if (ctrl.signal.aborted) return;
        setAvailable(bannerSeason(themes, readChoice(document.cookie), cfg?.seasonal_moods, new Date()));
      })
      .catch(() => {
        /* stay off */
      });
    return () => ctrl.abort();
  }, [preview]);

  const setHidden = (value: boolean) => {
    writeHidden(value);
    setHiddenState(value);
  };

  return { season: hidden ? undefined : available, available, hidden, setHidden };
}
