import { describe, expect, it } from "vitest";

import { FLEET_COLUMNS, cell, csvFileName, fleetCsv } from "./csv";
import type { FleetDag } from "./types";

const dag = (over: Partial<FleetDag> = {}): FleetDag => ({
  dag_id: "load_payments",
  score: 74.5,
  grade: "C",
  counts: { pass: 10, warn: 1, fail: 2, skip: 0, ack: 0 },
  is_paused: false,
  owners: "data-team",
  tags: ["finance", "team:data"],
  issues: [
    { id: "retries", title: "Tasks retry on failure", status: "fail", gain: 15 },
    { id: "docs", title: "Documented", status: "warn", gain: 4 },
    { id: "tags", title: "Tagged", status: "fail", gain: 5 },
  ],
  health: { runs: 12, success_rate: 91.7 },
  ...over,
});

describe("cell", () => {
  it.each([
    ["plain", "plain"],
    [42.5, "42.5"],
    [true, "true"],
    [null, ""],
    [undefined, ""],
    ["a,b", '"a,b"'],
    ['say "hi"', '"say ""hi"""'],
    ["two\nlines", '"two\nlines"'],
    ["=HYPERLINK(1)", "'=HYPERLINK(1)"],
    ["+1", "'+1"],
    ["-1", "'-1"],
    ["@SUM(A1)", "'@SUM(A1)"],
    [-1, "-1"],
  ])("%j -> %j", (value, expected) => {
    expect(cell(value)).toBe(expected);
  });
});

describe("fleetCsv", () => {
  it("writes a header and one row per DAG", () => {
    const lines = fleetCsv([dag()]).split("\r\n");
    expect(lines[0]).toBe(FLEET_COLUMNS.join(","));
    expect(lines[1]).toBe("load_payments,data-team,finance; team:data,false,74.5,C,retries; tags,docs,12,91.7");
    expect(lines[2]).toBe("");
  });

  it("leaves unknown values empty", () => {
    const row = fleetCsv([dag({ tags: undefined, issues: [], health: undefined })]).split("\r\n")[1];
    expect(row).toBe("load_payments,data-team,,false,74.5,C,,,0,");
  });

  it("only has the header for an empty fleet", () => {
    expect(fleetCsv([])).toBe(FLEET_COLUMNS.join(",") + "\r\n");
  });
});

it("names the file after the local date", () => {
  expect(csvFileName(new Date(2026, 10, 9, 23, 30))).toBe("dagwick-fleet-2026-11-09.csv");
});
