import { describe, expect, it } from "vitest";

import { changeList } from "./ScoreHistory";
import type { HistoryPoint } from "./types";

const point = (version: number, score: number, better: string[] = [], worse: string[] = []): HistoryPoint => ({
  version,
  created_at: null,
  score,
  grade: score >= 90 ? "A" : "D",
  better,
  worse,
});

describe("changeList", () => {
  it("lists versions that changed a check, newest first, with the score before", () => {
    const list = changeList([point(1, 32), point(2, 45, ["Retries"]), point(3, 45), point(4, 40, [], ["Docs"])]);
    expect(list.map((c) => [c.point.version, c.from])).toEqual([
      [4, 45],
      [2, 32],
    ]);
  });

  it("keeps at most five changes", () => {
    const versions = Array.from({ length: 9 }, (_, i) => point(i + 1, i * 10, [`c${i}`]));
    expect(changeList(versions).map((c) => c.point.version)).toEqual([9, 8, 7, 6, 5]);
  });

  it("is empty for a single version", () => {
    expect(changeList([point(1, 50, ["x"])])).toEqual([]);
  });
});
