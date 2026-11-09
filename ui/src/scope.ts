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

/** Suggestions for what the user typed: matches anywhere in the name, ignoring case. */
export function suggest(all: Option[], query: string, max = 8): { shown: Option[]; more: number } {
  const q = query.trim().toLowerCase();
  const matches = q ? all.filter((o) => o.name.toLowerCase().includes(q)) : all;
  return { shown: matches.slice(0, max), more: Math.max(0, matches.length - max) };
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

// The search field's own state, kept pure so every pick/clear/re-filter sequence is testable.
export interface ComboState {
  query: string; // what the user is typing
  open: boolean; // suggestions shown
  editing: boolean; // typing a new search (the picked value shows as a hint)
  active: number; // highlighted suggestion
}

export type ComboAction =
  | { type: "focus" }
  | { type: "blur" }
  | { type: "type"; query: string }
  | { type: "move"; by: 1 | -1; count: number }
  | { type: "hover"; index: number }
  | { type: "picked" }
  | { type: "cleared" }
  | { type: "close" };

export const COMBO_START: ComboState = { query: "", open: false, editing: false, active: 0 };

export function combo(state: ComboState, action: ComboAction): ComboState {
  switch (action.type) {
    case "focus":
      return { ...state, open: true, editing: true, active: 0 };
    case "blur":
    case "picked": // the field shows the new value; the list closes
      return COMBO_START;
    case "type":
      return { query: action.query, open: true, editing: true, active: 0 };
    case "move":
      return action.count
        ? { ...state, open: true, active: (state.active + action.by + action.count) % action.count }
        : { ...state, open: true };
    case "hover":
      return { ...state, active: action.index };
    case "cleared": // the field then takes focus again, ready for the next search
      return { ...state, query: "", active: 0 };
    case "close":
      return { ...state, open: false };
  }
}

/** The text in the field: the search while typing, otherwise the picked value. */
export function comboText(state: ComboState, value?: string): string {
  return state.editing ? state.query : (value ?? "");
}
