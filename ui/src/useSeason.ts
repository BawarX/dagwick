import { useEffect, useState } from "react";

import { fetchThemes, loadConfig } from "./api";
import { pickTheme, readChoice, themeSeason } from "./themes";
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

function writeHidden(hidden: boolean) {
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
    // A theme showing on Airflow (by date, or applied by this viewer) sets the banner's
    // look; otherwise the admin's seasonal_moods setting decides.
    Promise.all([loadThemes().catch(() => []), loadConfig().catch(() => undefined)])
      .then(([themes, cfg]) => {
        if (ctrl.signal.aborted) return;
        const fromTheme = themeSeason(pickTheme(themes, readChoice(document.cookie)));
        if (fromTheme) return setAvailable(SEASONS[fromTheme]);
        if (!cfg) return; // setting unreadable: stay off
        const allowed =
          cfg.seasonal_moods === "auto" || cfg.seasonal_moods === "off"
            ? cfg.seasonal_moods
            : cfg.seasonal_moods.filter(isSeasonId);
        setAvailable(seasonFor(new Date(), allowed));
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
