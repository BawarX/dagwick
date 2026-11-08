import { describe, expect, it } from "vitest";

import { SEASON_ORDER, islamicDate, seasonFor } from "./season";

// Local noon avoids any timezone edge at midnight.
const day = (iso: string) => new Date(`${iso}T12:00:00`);
const mood = (iso: string, allowed?: Parameters<typeof seasonFor>[1]) => seasonFor(day(iso), allowed)?.id;

describe("fixed-date moods", () => {
  it.each([
    ["2026-10-23", undefined],
    ["2026-10-24", "halloween"],
    ["2026-11-01", "halloween"],
    ["2026-11-02", undefined],
    ["2026-12-17", undefined],
    ["2026-12-18", "christmas"],
    ["2026-12-26", "christmas"],
    ["2026-12-30", undefined],
    ["2026-12-31", "new-year"],
    ["2027-01-02", "new-year"],
    ["2027-01-03", undefined],
    ["2027-03-18", undefined],
    ["2027-03-19", "newroz"],
    ["2027-03-23", "newroz"],
    ["2026-05-15", "language-day"],
    ["2026-05-16", undefined],
    ["2026-11-08", "birthday"],
    ["2026-07-01", undefined],
  ])("%s -> %s", (iso, expected) => {
    expect(mood(iso)).toBe(expected);
  });
});

describe("Islamic-calendar moods (Umm al-Qura), checked against published dates", () => {
  it("knows the calendar", () => {
    expect(islamicDate(day("2025-03-01"))).toEqual({ month: 9, day: 1 }); // 1 Ramadan 1446
  });
  it.each([
    ["2025-02-28", undefined], // last day of Sha'ban
    ["2025-03-01", "ramadan"], // Ramadan 1446 began
    ["2025-03-29", "ramadan"],
    ["2025-03-30", "eid"], // Eid al-Fitr
    ["2025-04-01", "eid"],
    ["2025-04-02", undefined],
    ["2025-06-05", undefined], // Day of Arafah
    ["2025-06-06", "eid"], // Eid al-Adha
    ["2025-06-09", "eid"],
    ["2025-06-10", undefined],
  ])("%s -> %s", (iso, expected) => {
    expect(mood(iso)).toBe(expected);
  });
});

describe("settings", () => {
  it("off disables everything", () => {
    expect(mood("2026-12-25", "off")).toBeUndefined();
  });
  it("a list enables only those moods", () => {
    expect(mood("2026-12-25", ["newroz"])).toBeUndefined();
    expect(mood("2027-03-20", ["newroz"])).toBe("newroz");
  });
  it("Newroz wins over Eid when they overlap (Eid al-Fitr 2026 falls during Newroz)", () => {
    expect(SEASON_ORDER[0]).toBe("newroz");
    expect(mood("2026-03-21")).toBe("newroz");
    expect(mood("2026-03-21", ["eid"])).toBe("eid"); // Eid still shows when Newroz is turned off
  });
});
