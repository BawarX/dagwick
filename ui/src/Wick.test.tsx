import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SEASON_ORDER, type SeasonId } from "./season";
import type { Grade } from "./types";
import { type Mood, Wick, moodFor } from "./Wick";

const MOODS: Mood[] = ["radiant", "happy", "calm", "worried", "out"];
const SKINS: (SeasonId | undefined)[] = [undefined, ...SEASON_ORDER];

const draw = (mood: Mood, season?: SeasonId) => renderToStaticMarkup(<Wick mood={mood} season={season} />);
const count = (text: string, part: string) => text.split(part).length - 1;

describe("grade to mood", () => {
  it.each<[Grade, Mood]>([
    ["A", "radiant"],
    ["B", "happy"],
    ["C", "calm"],
    ["D", "worried"],
    ["F", "out"],
  ])("%s -> %s", (grade, mood) => {
    expect(moodFor(grade)).toBe(mood);
  });
});

describe("Wick", () => {
  it.each(SKINS.flatMap((season) => MOODS.map((mood) => [season ?? "everyday", mood, season] as const)))(
    "draws %s %s",
    (_name, mood, season) => {
      const svg = draw(mood, season);
      expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 160 160"/);
      expect(svg).toContain(`dagwick-wick--${mood}`);
      expect(svg).toMatch(/aria-label="Wick [^"]+"/);
      expect(svg).not.toMatch(/NaN|undefined/);
      // Every gradient it paints with is defined in the same drawing.
      for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/g)) expect(svg).toContain(`id="${id}"`);
    },
  );

  it("burns at every grade except F, where only smoke is left", () => {
    for (const mood of MOODS) {
      const svg = draw(mood);
      expect(svg.includes('class="dagwick-flame"')).toBe(mood !== "out");
      expect(svg.includes('class="dagwick-ghost"')).toBe(mood === "out");
    }
  });

  it("lights one more node of the candle's DAG with every grade", () => {
    const lit = MOODS.map((mood) => count(draw(mood), 'r="2.7" fill="var(--dagwick-flame)"'));
    expect(lit).toEqual([4, 3, 2, 1, 0]);
  });

  it("wears something different in every season", () => {
    const outfits = new Set(SKINS.map((season) => draw("happy", season).replace(/dagwick-[A-Za-z0-9]+-/g, "")));
    expect(outfits.size).toBe(SKINS.length);
  });

  it("keeps gradient ids unique when several mascots share a page", () => {
    const html = renderToStaticMarkup(
      <>
        <Wick mood="radiant" />
        <Wick mood="radiant" season="halloween" />
      </>,
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
