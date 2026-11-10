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
    ["2026-11-08", "birthday"], // during Diwali 2026: the one-day birthday wins
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

describe("moods on other calendars, one test per listed year", () => {
  it.each([
    // Diwali: two days either side of Lakshmi Puja.
    ["2026-11-06", "diwali"],
    ["2026-11-10", "diwali"],
    ["2026-11-11", undefined],
    ["2027-10-29", "diwali"], // during Halloween: Diwali wins
    ["2027-10-26", "halloween"],
    ["2028-10-17", "diwali"],
    ["2029-11-05", "diwali"],
    ["2030-10-26", "diwali"],
    ["2031-11-14", "diwali"],
    // The Lantern Festival: one day.
    ["2026-03-03", "lantern-festival"], // during Ramadan 2026: the festival wins
    ["2026-03-04", "ramadan"],
    ["2027-02-20", "lantern-festival"],
    ["2028-02-09", "lantern-festival"],
    ["2029-02-27", "lantern-festival"],
    ["2030-02-17", "lantern-festival"],
    ["2031-02-06", "lantern-festival"],
    // Çarşema Sor: the first Wednesday from 14 April.
    ["2026-04-15", "carsema-sor"],
    ["2026-04-14", undefined],
    ["2026-04-22", undefined],
    ["2027-04-14", "carsema-sor"],
    ["2028-04-19", "carsema-sor"],
    ["2029-04-18", "carsema-sor"],
    ["2030-04-17", "carsema-sor"],
    ["2031-04-16", "carsema-sor"],
  ])("%s -> %s", (iso, expected) => {
    expect(mood(iso)).toBe(expected);
  });

  it("shows nothing for a year that isn't listed yet", () => {
    expect(mood("2032-11-01", ["diwali"])).toBeUndefined();
    expect(mood("2032-02-21", ["lantern-festival"])).toBeUndefined();
  });
});
