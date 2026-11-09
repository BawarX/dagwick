import { describe, expect, it } from "vitest";

import {
  dateRange,
  offCookie,
  offList,
  previewCookie,
  readCookies,
  themeStatus,
  withOff,
} from "./themes";

const christmas = {
  id: "christmas",
  name: "Christmas snow",
  description: "",
  start: [12, 18] as [number, number],
  end: [1, 2] as [number, number],
  active: true,
};

describe("theme cookies", () => {
  it("reads the viewer's choices and ignores other cookies", () => {
    const jar =
      "session=abc; dagwick_themes_off=christmas,halloween; dagwick_theme_preview=newroz";
    expect(offList(jar)).toEqual(["christmas", "halloween"]);
    expect(readCookies(jar).dagwick_theme_preview).toBe("newroz");
    expect(offList("")).toEqual([]);
  });

  it("turns a theme off and on again without duplicates", () => {
    expect(withOff(["a"], "b", true)).toEqual(["a", "b"]);
    expect(withOff(["a", "b"], "b", true)).toEqual(["a", "b"]);
    expect(withOff(["a", "b"], "a", false)).toEqual(["b"]);
  });

  it("writes cookies for the whole site, and clears them when empty", () => {
    expect(offCookie(["christmas"])).toMatch(
      /^dagwick_themes_off=christmas; Path=\/; Max-Age=\d+; SameSite=Lax$/,
    );
    expect(offCookie([])).toContain("Max-Age=0");
    expect(previewCookie("christmas")).toBe(
      "dagwick_theme_preview=christmas; Path=/; SameSite=Lax",
    );
    expect(previewCookie()).toContain("Max-Age=0");
  });
});

describe("theme display", () => {
  it("formats dates, including ranges over the new year", () => {
    expect(dateRange([12, 18], [1, 2])).toBe("18 Dec – 2 Jan");
    expect(dateRange([5, 15], [5, 15])).toBe("15 May");
  });

  it("says what the viewer sees now", () => {
    expect(themeStatus(christmas, [])).toBe("showing");
    expect(themeStatus(christmas, ["christmas"])).toBe("off");
    expect(themeStatus({ ...christmas, active: false }, [])).toBe("waiting");
    expect(
      themeStatus({ ...christmas, active: false }, ["christmas"], "christmas"),
    ).toBe("preview");
    expect(themeStatus(christmas, [], "halloween")).toBe("waiting"); // another preview hides it
  });
});
