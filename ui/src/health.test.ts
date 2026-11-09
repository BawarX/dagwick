import { describe, expect, it } from "vitest";

import { ago, duration, trendText } from "./RunHealth";

describe("duration", () => {
  it.each([
    [42, "42 s"],
    [90, "2 min"],
    [3600, "1 h"],
    [5400, "1 h 30 min"],
  ])("%s seconds reads as %s", (seconds, text) => {
    expect(duration(seconds)).toBe(text);
  });
});

describe("ago", () => {
  const now = Date.parse("2026-11-09T12:00:00Z");
  it.each([
    ["2026-11-09T11:30:00Z", "30 min ago"],
    ["2026-11-09T06:00:00Z", "6 h ago"],
    ["2026-11-05T12:00:00Z", "4 days ago"],
    ["2026-11-09T12:05:00Z", "0 min ago"],
  ])("%s is %s", (iso, text) => {
    expect(ago(iso, now)).toBe(text);
  });
});

describe("trendText", () => {
  it.each([
    [null, undefined],
    [5, "steady"],
    [-9, "steady"],
    [40, "40% slower than before"],
    [-25, "25% faster than before"],
  ])("%s gives %s", (pct, text) => {
    expect(trendText(pct)).toBe(text);
  });
});
