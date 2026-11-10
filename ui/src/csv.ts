import type { FleetDag } from "./types";

/** Columns of the fleet CSV, in order. */
export const FLEET_COLUMNS = [
  "dag_id",
  "owners",
  "tags",
  "paused",
  "score",
  "grade",
  "failing_checks",
  "warning_checks",
  "runs_30d",
  "success_rate",
] as const;

/**
 * One CSV cell (RFC 4180). Text that a spreadsheet would run as a formula
 * (=, +, -, @, tab, CR) is prefixed with ' so it opens as plain text.
 */
export function cell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const ids = (d: FleetDag, status: "fail" | "warn") =>
  d.issues
    .filter((i) => i.status === status)
    .map((i) => i.id)
    .join("; ");

/** The fleet as CSV text: a header row, then one row per DAG. */
export function fleetCsv(dags: FleetDag[]): string {
  const rows = dags.map((d) => [
    d.dag_id,
    d.owners,
    (d.tags ?? []).join("; "),
    d.is_paused,
    d.score,
    d.grade,
    ids(d, "fail"),
    ids(d, "warn"),
    d.health?.runs ?? 0,
    d.health?.success_rate ?? null,
  ]);
  return [FLEET_COLUMNS, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

export function csvFileName(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `dagwick-fleet-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
}

/** Save text as a file, built in the browser: no request leaves the page. */
export function download(name: string, text: string): void {
  // The byte-order mark makes Excel read the file as UTF-8.
  const url = URL.createObjectURL(new Blob(["﻿", text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
