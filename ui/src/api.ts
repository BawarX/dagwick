import { useCallback, useEffect, useState } from "react";

import { API_BASE } from "./brand";
import type { FleetReport, RunHealth, ScoreHistory, ScoreReport } from "./types";

async function get<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${API_BASE}${path}`, document.baseURI);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { signal, credentials: "same-origin" });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      /* body was not JSON */
    }
    throw new Error(detail);
  }
  return res.json();
}

export const fetchScore = (dagId: string, signal?: AbortSignal) =>
  get<ScoreReport>("/score", { dag_id: dagId }, signal);

export const fetchHealth = (dagId: string, signal?: AbortSignal) =>
  get<RunHealth>("/health", { dag_id: dagId }, signal);

export const fetchHistory = (dagId: string, signal?: AbortSignal) =>
  get<ScoreHistory>("/history", { dag_id: dagId }, signal);

export const fetchFleet = (signal?: AbortSignal) => get<FleetReport>("/fleet", {}, signal);

export interface UiConfig {
  /** "auto", "off", or the list of enabled mood ids. */
  seasonal_moods: "auto" | "off" | string[];
  /** Lowest score for each grade, for example {"A": 90, "B": 75, "C": 60, "D": 40}. */
  grades?: Record<string, number>;
}

let configRequest: Promise<UiConfig> | undefined;

/** The UI settings, fetched once per page and shared by every caller. */
export function loadConfig(): Promise<UiConfig> {
  configRequest ??= get<UiConfig>("/config", {}).catch((e: unknown) => {
    configRequest = undefined; // let a later caller retry
    throw e;
  });
  return configRequest;
}

/** Load data, with abort-on-unmount and a reload() trigger. */

export function useLoad<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(undefined);
    load(ctrl.signal)
      .then(setData)
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, error, loading, reload };
}
