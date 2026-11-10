import { describe, expect, it } from "vitest";

import {
  type Choice,
  applyTheme,
  choiceCookies,
  comingSoon,
  dateRange,
  pickTheme,
  readChoice,
  removeTheme,
  setAuto,
  themeSeason,
  themeStatus,
} from "./themes";

const christmas = {
  id: "christmas",
  name: "Christmas snow",
  description: "",
  start: [12, 18] as [number, number],
  end: [1, 2] as [number, number],
  active: true,
};
const newroz = {
  ...christmas,
  id: "newroz",
  start: [3, 19] as [number, number],
  end: [3, 23] as [number, number],
  active: false,
};
const themes = [christmas, newroz];
const fresh: Choice = { auto: true, removed: [] };

describe("theme choices", () => {
  it("shows themes on their dates by default", () => {
    expect(readChoice("session=abc")).toEqual(fresh);
    expect(pickTheme(themes, fresh)).toBe("christmas");
    expect(themeStatus(christmas, themes, fresh)).toBe("showing");
    expect(themeStatus(newroz, themes, fresh)).toBe("waiting");
  });

  it("applies a theme by hand, outside its dates", () => {
    const c = applyTheme(fresh, "newroz");
    expect(pickTheme(themes, c)).toBe("newroz");
    expect(themeStatus(newroz, themes, c)).toBe("applied");
    expect(themeStatus(christmas, themes, c)).toBe("removed"); // one theme at a time
  });

  it("removes a theme that is in season until it is applied again", () => {
    const c = removeTheme(themes, fresh, "christmas");
    expect(pickTheme(themes, c)).toBeUndefined();
    expect(themeStatus(christmas, themes, c)).toBe("removed");
    expect(pickTheme(themes, applyTheme(c, "christmas"))).toBe("christmas");
    // Removing an applied theme that is out of season leaves nothing to remember.
    expect(removeTheme(themes, applyTheme(fresh, "newroz"), "newroz")).toEqual(fresh);
  });

  it("turns 'show on their dates' off and on", () => {
    const off = setAuto(fresh, false);
    expect(pickTheme(themes, off)).toBeUndefined();
    expect(themeStatus(christmas, themes, off)).toBe("waiting");
    expect(pickTheme(themes, applyTheme(off, "christmas"))).toBe("christmas");
    expect(setAuto(removeTheme(themes, fresh, "christmas"), true)).toEqual(fresh);
  });

  it("round-trips through cookies, and clears them when there is nothing to keep", () => {
    const c: Choice = {
      auto: false,
      applied: "newroz",
      removed: ["christmas"],
    };
    const jar = choiceCookies(c)
      .map((s) => s.split(";")[0])
      .join("; ");
    expect(readChoice(jar)).toEqual(c);
    expect(choiceCookies(fresh).every((s) => s.includes("Max-Age=0"))).toBe(true);
    expect(choiceCookies(c)[0]).toMatch(/^dagwick_themes_off=\*,christmas; Path=\/; Max-Age=\d+; SameSite=Lax$/);
  });
});

describe("themes coming soon", () => {
  const diwali = { ...newroz, id: "diwali", active: true, decorated: false };
  const list = [diwali, christmas];

  it("are never picked, by date or by hand, and say so", () => {
    expect(comingSoon(diwali)).toBe(true);
    expect(comingSoon(christmas)).toBe(false);
    expect(pickTheme(list, fresh)).toBe("christmas"); // in season too, but coming soon
    expect(pickTheme(list, applyTheme(fresh, "diwali"))).toBe("christmas");
    expect(themeStatus(diwali, list, fresh)).toBe("soon");
    expect(themeStatus(christmas, list, fresh)).toBe("showing");
  });
});

describe("theme dates", () => {
  it("formats dates, including ranges over the new year", () => {
    expect(dateRange([12, 18], [1, 2])).toBe("18 Dec – 2 Jan");
    expect(dateRange([5, 15], [5, 15])).toBe("15 May");
  });
});

describe("theme banner", () => {
  it("gives the banner the look of the theme showing, when there is one", () => {
    expect(themeSeason("christmas")).toBe("christmas");
    expect(themeSeason("halloween")).toBe("halloween");
    expect(themeSeason(undefined)).toBeUndefined();
    expect(themeSeason("something-new")).toBeUndefined();
  });
});
