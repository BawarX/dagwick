import { describe, expect, it } from "vitest";

import {
  inScope,
  navIndex,
  options,
  readScope,
  scopeLabel,
  scopeOptions,
  splitOwners,
  typeAhead,
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

describe("dropdown keyboard", () => {
  it("moves with arrows, Home/End and Page keys, staying inside the list", () => {
    expect(navIndex("ArrowDown", 0, 3)).toBe(1);
    expect(navIndex("ArrowDown", 2, 3)).toBe(2);
    expect(navIndex("ArrowUp", 0, 3)).toBe(0);
    expect(navIndex("End", 0, 3)).toBe(2);
    expect(navIndex("Home", 2, 3)).toBe(0);
    expect(navIndex("PageDown", 0, 20)).toBe(8);
    expect(navIndex("a", 0, 3)).toBeUndefined();
    expect(navIndex("ArrowDown", 0, 0)).toBeUndefined();
  });

  const labels = ["All owners", "billing", "data-team", "dagwick", "finance", "fin-ops"];

  it("jumps to the first row starting with the typed letters", () => {
    expect(typeAhead(labels, "fi", 0)).toBe(4);
    expect(typeAhead(labels, "dagw", 0)).toBe(3);
    expect(typeAhead(labels, "z", 0)).toBeUndefined();
    expect(typeAhead(labels, "", 0)).toBeUndefined();
  });

  it("cycles through matches when the same letter is typed again", () => {
    expect(typeAhead(labels, "d", 0)).toBe(2);
    expect(typeAhead(labels, "d", 2)).toBe(3);
    expect(typeAhead(labels, "dd", 3)).toBe(2); // wraps around
  });
});
