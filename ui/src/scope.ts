// The fleet page's scope: which owner and/or tag the page describes.
// Owner and tag set the scope (the summary follows them); grade and issue
// filters only narrow the list.

export interface Scope {
  owner?: string;
  tag?: string;
}

export interface Option {
  name: string;
  count: number;
}

/** Airflow keeps a DAG's owners as one comma-separated string. */
export function splitOwners(owners: string): string[] {
  return [...new Set(owners.split(",").map((o) => o.trim()).filter(Boolean))];
}

/** Every owner (or tag) with its DAG count, most DAGs first, then by name. */
export function options(names: string[][]): Option[] {
  const counts = new Map<string, number>();
  for (const list of names) for (const n of new Set(list)) counts.set(n, (counts.get(n) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function inScope(dag: { owners: string; tags?: string[] }, scope: Scope): boolean {
  return (
    (!scope.owner || splitOwners(dag.owners).includes(scope.owner)) &&
    (!scope.tag || (dag.tags ?? []).includes(scope.tag))
  );
}

/** How the page names the scope: "finance", "#ingest" or "finance · #ingest". */
export function scopeLabel(scope: Scope): string | undefined {
  const parts = [scope.owner, scope.tag && `#${scope.tag}`].filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}

export function readScope(search: string): Scope {
  const params = new URLSearchParams(search);
  return { owner: params.get("owner") || undefined, tag: params.get("tag") || undefined };
}

/** The query string with the scope applied, keeping every other parameter. */
export function writeScope(search: string, scope: Scope): string {
  const params = new URLSearchParams(search);
  for (const key of ["owner", "tag"] as const) {
    const value = scope[key];
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const out = params.toString();
  return out ? `?${out}` : "";
}

/** Suggestions for each field, narrowed by the other one, so a pick never leads to an empty page. */
export function scopeOptions(
  dags: { owners: string; tags?: string[] }[],
  scope: Scope,
): { owners: Option[]; tags: Option[] } {
  return {
    owners: options(dags.filter((d) => inScope(d, { tag: scope.tag })).map((d) => splitOwners(d.owners))),
    tags: options(dags.filter((d) => inScope(d, { owner: scope.owner })).map((d) => d.tags ?? [])),
  };
}

// ---- Dropdown keyboard behaviour (pure, so it can be tested) ----

/** The highlighted row after a navigation key, or undefined if the key doesn't navigate. */
export function navIndex(key: string, active: number, count: number): number | undefined {
  if (count === 0) return undefined;
  if (key === "ArrowDown") return Math.min(active + 1, count - 1);
  if (key === "ArrowUp") return Math.max(active - 1, 0);
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "PageDown") return Math.min(active + 8, count - 1);
  if (key === "PageUp") return Math.max(active - 8, 0);
  return undefined;
}

/**
 * Type-ahead: the first row (after the current one, wrapping) whose label starts with
 * what was typed. Typing the same letter again moves to the next match, like a native select.
 */
export function typeAhead(labels: string[], typed: string, active: number): number | undefined {
  const q = typed.toLowerCase();
  if (!q) return undefined;
  const repeated = q.length > 1 && [...q].every((ch) => ch === q[0]);
  const prefix = repeated ? q[0] : q;
  const start = q.length === 1 || repeated ? active + 1 : active;
  for (let i = 0; i < labels.length; i++) {
    const at = (start + i) % labels.length;
    if (labels[at].toLowerCase().startsWith(prefix)) return at;
  }
  return undefined;
}
