import { describe, expect, it } from "vitest";

import {
  COMBO_START,
  type ComboAction,
  combo,
  comboText,
  inScope,
  options,
  readScope,
  scopeLabel,
  scopeOptions,
  splitOwners,
  suggest,
  writeScope,
} from "./scope";

describe("splitOwners", () => {
  it("splits Airflow's comma-separated owners and drops blanks and repeats", () => {
    expect(splitOwners("finance, data-team,,finance ")).toEqual(["finance", "data-team"]);
    expect(splitOwners("")).toEqual([]);
  });
});

describe("options", () => {
  it("counts each DAG once per name, most DAGs first, then by name", () => {
    expect(options([["b", "a"], ["a"], ["c"], ["a", "a"]])).toEqual([
      { name: "a", count: 3 },
      { name: "b", count: 1 },
      { name: "c", count: 1 },
    ]);
  });
});

describe("suggest", () => {
  const all = options([["payments-core"], ["payments-data"], ["billing"], ["data-team"], ["data-team"]]);

  it("shows the owners with the most DAGs when nothing is typed", () => {
    expect(suggest(all, "", 2)).toEqual({ shown: [{ name: "data-team", count: 2 }, all[1]], more: 2 });
  });

  it("matches anywhere in the name, ignoring case, and says how many more match", () => {
    expect(suggest(all, "DATA", 1)).toEqual({ shown: [{ name: "data-team", count: 2 }], more: 1 });
    expect(suggest(all, "nobody")).toEqual({ shown: [], more: 0 });
  });
});

describe("inScope", () => {
  const dag = { owners: "finance, data-team", tags: ["ingest"] };

  it("counts a DAG for every one of its owners", () => {
    expect(inScope(dag, { owner: "finance" })).toBe(true);
    expect(inScope(dag, { owner: "data-team" })).toBe(true);
    expect(inScope(dag, { owner: "data" })).toBe(false); // whole names only
  });

  it("combines owner and tag", () => {
    expect(inScope(dag, { owner: "finance", tag: "ingest" })).toBe(true);
    expect(inScope(dag, { owner: "finance", tag: "export" })).toBe(false);
    expect(inScope({ owners: "ops" }, { tag: "ingest" })).toBe(false);
    expect(inScope(dag, {})).toBe(true);
  });
});

describe("scope label and URL", () => {
  it("names the scope", () => {
    expect(scopeLabel({})).toBeUndefined();
    expect(scopeLabel({ owner: "finance", tag: "ingest" })).toBe("finance · #ingest");
  });

  it("round-trips through the query string and keeps other parameters", () => {
    const search = writeScope("?dagwick_mood=newroz", { owner: "data team", tag: "ingest" });
    expect(readScope(search)).toEqual({ owner: "data team", tag: "ingest" });
    expect(new URLSearchParams(search).get("dagwick_mood")).toBe("newroz");
    expect(writeScope(search, {})).toBe("?dagwick_mood=newroz");
    expect(writeScope("", {})).toBe("");
  });
});

const run = (...actions: ComboAction[]) => actions.reduce(combo, COMBO_START);

describe("search field: pick, clear and filter again", () => {
  it("shows the picked value once a suggestion is picked", () => {
    const s = run({ type: "focus" }, { type: "type", query: "fin" }, { type: "picked" });
    expect(s.open).toBe(false);
    expect(comboText(s, "finance")).toBe("finance"); // the value, not a greyed-out hint
  });

  it("searches again when a filled field is clicked, and keeps the value until a new pick", () => {
    const s = run({ type: "picked" }, { type: "focus" });
    expect(s.open).toBe(true);
    expect(comboText(s, "finance")).toBe(""); // empty field, "finance" as placeholder
    expect(comboText(run({ type: "picked" }, { type: "focus" }, { type: "blur" }), "finance")).toBe("finance");
  });

  it("is ready for the next search right after clearing", () => {
    // pick → clear (the component then focuses the field) → type → pick again
    let s = run({ type: "focus" }, { type: "type", query: "fin" }, { type: "picked" });
    s = combo(combo(s, { type: "cleared" }), { type: "focus" });
    expect(s).toEqual({ query: "", open: true, editing: true, active: 0 });
    expect(comboText(s, undefined)).toBe("");
    s = combo(s, { type: "type", query: "ops" });
    expect(s.open && s.query === "ops").toBe(true);
    expect(combo(s, { type: "picked" })).toEqual(COMBO_START);
  });

  it("clears a half-typed search without touching the list position elsewhere", () => {
    const s = run({ type: "focus" }, { type: "type", query: "xyz" }, { type: "move", by: 1, count: 3 }, { type: "cleared" });
    expect(s.query).toBe("");
    expect(s.active).toBe(0);
  });

  it("moves through suggestions with wrap-around, and hover follows the mouse", () => {
    let s = run({ type: "focus" });
    s = combo(s, { type: "move", by: -1, count: 3 });
    expect(s.active).toBe(2);
    s = combo(s, { type: "move", by: 1, count: 3 });
    expect(s.active).toBe(0);
    expect(combo(s, { type: "hover", index: 1 }).active).toBe(1);
    expect(combo(s, { type: "move", by: 1, count: 0 }).active).toBe(0); // no suggestions
  });

  it("typing restarts at the first suggestion; Esc closes; blur resets", () => {
    let s = run({ type: "focus" }, { type: "move", by: 1, count: 5 }, { type: "type", query: "a" });
    expect(s.active).toBe(0);
    s = combo(s, { type: "close" });
    expect(s.open).toBe(false);
    expect(combo(s, { type: "blur" })).toEqual(COMBO_START);
  });
});

describe("scopeOptions", () => {
  const dags = [
    { owners: "finance", tags: ["ingest"] },
    { owners: "finance", tags: ["report"] },
    { owners: "ops", tags: ["ingest", "backup"] },
  ];

  it("offers every owner and tag when nothing is picked", () => {
    const o = scopeOptions(dags, {});
    expect(o.owners.map((x) => x.name)).toEqual(["finance", "ops"]);
    expect(o.tags.map((x) => x.name)).toEqual(["ingest", "backup", "report"]);
  });

  it("only suggests tags the picked owner uses, and owners that use the picked tag", () => {
    expect(scopeOptions(dags, { owner: "finance" }).tags).toEqual([
      { name: "ingest", count: 1 },
      { name: "report", count: 1 },
    ]);
    expect(scopeOptions(dags, { tag: "backup" }).owners).toEqual([{ name: "ops", count: 1 }]);
  });
});
