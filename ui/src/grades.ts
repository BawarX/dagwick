import { useEffect, useState } from "react";

import { loadConfig } from "./api";
import type { Grade } from "./types";

/** Lowest score for each grade, best first. Anything below the last one is an F. */
export type Thresholds = [Grade, number][];

/** Mirrors DEFAULT_GRADES in src/dagwick/settings.py; used until /api/config answers. */
export const DEFAULT_THRESHOLDS: Thresholds = [
  ["A", 90],
  ["B", 75],
  ["C", 60],
  ["D", 40],
];

export function gradeFor(score: number, thresholds: Thresholds = DEFAULT_THRESHOLDS): Grade {
  return thresholds.find(([, t]) => score >= t)?.[0] ?? "F";
}

/** Thresholds from the server's config ({"A": 90, ...}); invalid input means the defaults. */
export function toThresholds(grades: unknown): Thresholds {
  if (!grades || typeof grades !== "object") return DEFAULT_THRESHOLDS;
  const g = grades as Record<string, unknown>;
  const out: Thresholds = DEFAULT_THRESHOLDS.map(([letter, t]) => [letter, typeof g[letter] === "number" ? (g[letter] as number) : t]);
  return out.every(([, t], i) => i === 0 || out[i - 1][1] > t) ? out : DEFAULT_THRESHOLDS;
}

/** The grade thresholds configured under [dagwick] grades in airflow.cfg. */
export function useThresholds(): Thresholds {
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);
  useEffect(() => {
    let live = true;
    loadConfig()
      .then((cfg) => live && setThresholds(toThresholds(cfg.grades)))
      .catch(() => {
        /* config unreadable: keep the defaults */
      });
    return () => {
      live = false;
    };
  }, []);
  return thresholds;
}
