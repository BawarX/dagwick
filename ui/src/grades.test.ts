import { describe, expect, it } from "vitest";

import { DEFAULT_THRESHOLDS, gradeFor, toThresholds } from "./grades";

describe("gradeFor", () => {
  it.each([
    [100, "A"],
    [90, "A"],
    [89.9, "B"],
    [75, "B"],
    [60, "C"],
    [40, "D"],
    [39.9, "F"],
  ])("default thresholds: %s is %s", (score, grade) => {
    expect(gradeFor(score)).toBe(grade);
  });

  it("follows configured thresholds", () => {
    const t = toThresholds({ A: 95, B: 80, C: 65, D: 50 });
    expect(gradeFor(94, t)).toBe("B");
    expect(gradeFor(49, t)).toBe("F");
  });
});

describe("toThresholds", () => {
  it("keeps defaults for missing letters", () => {
    expect(toThresholds({ A: 95 })).toEqual([
      ["A", 95],
      ["B", 75],
      ["C", 60],
      ["D", 40],
    ]);
  });

  it.each([undefined, null, "A:90", { A: 50 }])("falls back to the defaults for %j", (raw) => {
    expect(toThresholds(raw)).toBe(DEFAULT_THRESHOLDS);
  });
});
