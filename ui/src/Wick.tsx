import { useId } from "react";

import type { SeasonId } from "./season";
import type { Grade } from "./types";
import { Backdrop, Costume, FLAME_FIT, Vessel, VesselFront, starPath } from "./WickSkins";

export type Mood = "radiant" | "happy" | "calm" | "worried" | "out";

const MOOD_OF: Record<Grade, Mood> = { A: "radiant", B: "happy", C: "calm", D: "worried", F: "out" };

export function moodFor(grade: Grade): Mood {
  return MOOD_OF[grade];
}

const LABEL: Record<Mood, string> = {
  radiant: "Wick is glowing",
  happy: "Wick is happy",
  calm: "Wick is burning low",
  worried: "Wick is flickering",
  out: "Wick has gone out",
};

/** Sparkles around a radiant flame: x, y, radius. */
const SPARKLES: [number, number, number][] = [
  [131, 26, 9],
  [27, 38, 6.8],
  [140, 68, 5.2],
  [21, 82, 4],
];
/** Sparkles that would sit on a seasonal prop. */
const CROWDED: Partial<Record<SeasonId, number[]>> = { eid: [0] };

/** Where the wick meets the flame, in the 160x160 box. */
const BASE_Y = 111;

interface Body {
  /** The flame's silhouette. */
  outer: string;
  /** The pale inner flame the face sits on. */
  core: string;
  /** Glossy highlight on the left shoulder. */
  shine: string;
  /** How far the face slides down as the flame shrinks. */
  faceY: number;
  /** Radius of the halo around the flame. */
  glow: number;
}

// One hand-drawn flame per mood. The belly (and so the face) stays the same
// size; what shrinks with the grade is the tip, the halo and the colour.
const BODY: Record<Exclude<Mood, "out">, Body> = {
  radiant: {
    outer:
      "M80 106 C62 106 48 94 48 78 C48 60 64 50 72 36 C76 28 82 20 91 14 C90 24 92 34 99 44 C107 54 112 64 112 78 C112 94 98 106 80 106Z",
    core: "M80 101.5 C66 101.5 55 92 55 80 C55 69 64 63 71 54 C76 48 82 44 86 38 C86 46 91 51 96 58 C102 65 105 72 105 80 C105 92 94 101.5 80 101.5Z",
    shine: "M54.5 72 C55.5 64 61 58 66 52",
    faceY: 0,
    glow: 66,
  },
  happy: {
    outer:
      "M80 106 C62 106 49 94 49 79 C49 64 63 56 71 45 C76 38 82 30 89 24 C88 32 91 40 98 48 C106 57 111 66 111 79 C111 94 98 106 80 106Z",
    core: "M80 101.5 C67 101.5 56 92 56 81 C56 71 65 65 72 58 C77 53 82 50 85 45 C85 51 90 55 95 61 C101 67 104 73 104 81 C104 92 93 101.5 80 101.5Z",
    shine: "M55.5 74 C56.5 67 61 62 66 57",
    faceY: 0,
    glow: 56,
  },
  calm: {
    outer:
      "M80 106 C63 106 51 95 51 81 C51 68 63 61 71 53 C76 48 82 42 87 36 C86 43 90 49 97 56 C104 63 109 71 109 81 C109 95 97 106 80 106Z",
    core: "M80 101.5 C68 101.5 58 93 58 83 C58 74 66 69 73 64 C77 61 81 58 84 54 C84 59 88 62 93 66 C99 71 102 76 102 83 C102 93 92 101.5 80 101.5Z",
    shine: "M57.5 77 C58.5 71 62 67 66 63",
    faceY: 2,
    glow: 46,
  },
  worried: {
    outer:
      "M80 106 C64 106 54 96 54 84 C54 72 63 67 71 61 C76 57 84 54 92 47 C90 54 93 59 98 64 C103 70 106 77 106 84 C106 96 96 106 80 106Z",
    core: "M80 101.5 C69 101.5 60 94 60 85 C60 77 67 73 73.5 69.5 C78 67 83 65 87 61 C86.5 65 89.5 68 93.5 71.5 C98.5 76 101 80 101 85 C101 94 92 101.5 80 101.5Z",
    shine: "M60 80 C61 75 64.5 72 68.5 69",
    faceY: 5,
    glow: 36,
  },
};

/**
 * Wick, the Dagwick mascot: a little flame that lives on a wick.
 *
 * The flame is the character and its mood follows the grade: tall and
 * sparkling at A, smaller and paler on the way down, and at F it goes out and
 * leaves a wisp of smoke. What it burns on (the "vessel") changes with the
 * season: a candle every day, a pumpkin at Halloween, a cupcake on its birthday.
 */
export function Wick({ mood, size = 150, season }: { mood: Mood; size?: number; season?: SeasonId }) {
  // Unique gradient ids, so several mascots can share a page.
  const uid = `dagwick-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const paint = (name: string) => `url(#${uid}-${name})`;
  const lit = mood !== "out";
  const fit = (season && FLAME_FIT[season]) || { dy: 0, scale: 1 };
  // Flames are drawn with their base at y=106; `seat` puts that base on the wick.
  const baseY = BASE_Y + fit.dy + (lit ? 0 : (fit.out ?? 0));
  const seat = `translate(80 ${baseY}) scale(${fit.scale}) translate(-80 -106)`;

  return (
    <svg
      className={`dagwick-wick dagwick-wick--${mood}`}
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label={LABEL[mood]}
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--dagwick-flame-core)" stopOpacity="0.55" />
          <stop offset="50%" stopColor="var(--dagwick-flame)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--dagwick-flame)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-flame-deep)" />
          <stop offset="62%" stopColor="var(--dagwick-flame)" />
          <stop offset="100%" stopColor="var(--dagwick-flame-tip)" />
        </linearGradient>
        <linearGradient id={`${uid}-core`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-flame-core)" />
          <stop offset="100%" stopColor="var(--dagwick-flame-heart)" />
        </linearGradient>
        <linearGradient id={`${uid}-cool`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-flame-cool)" stopOpacity="0.85" />
          <stop offset="38%" stopColor="var(--dagwick-flame-cool)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-smoke`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--dagwick-smoke-hi)" />
          <stop offset="100%" stopColor="var(--dagwick-smoke-lo)" />
        </linearGradient>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-metal-dark)" />
          <stop offset="42%" stopColor="var(--dagwick-metal)" />
          <stop offset="100%" stopColor="var(--dagwick-metal-dark)" />
        </linearGradient>
        <linearGradient id={`${uid}-wax`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-wax-top)" />
          <stop offset="55%" stopColor="var(--dagwick-wax)" />
          <stop offset="100%" stopColor="var(--dagwick-wax-shade)" />
        </linearGradient>
      </defs>

      <ellipse cx="80" cy="152.5" rx="43" ry="4.5" fill="var(--dagwick-shadow)" />
      <Backdrop season={season} mood={mood} paint={paint} uid={uid} />

      {lit && (
        <circle
          className="dagwick-glow"
          cx="80"
          cy={baseY - 30 * fit.scale}
          r={BODY[mood].glow * fit.scale}
          fill={paint("glow")}
        />
      )}
      {mood === "radiant" && (
        <g className="dagwick-sparkles" fill="var(--dagwick-spark)">
          {SPARKLES.filter((_, i) => !(season && CROWDED[season]?.includes(i))).map(([x, y, r]) => (
            <path key={x} d={starPath(x, y, r, 0.24)} />
          ))}
        </g>
      )}

      <Vessel season={season} mood={mood} paint={paint} uid={uid} />
      <g transform={seat}>
        {/* spirit: lights up when it first appears; hop: a little jump on hover */}
        <g className="dagwick-spirit">
          <g className="dagwick-hop">
            {lit ? <Flame mood={mood} season={season} paint={paint} /> : <Smoke season={season} paint={paint} />}
          </g>
        </g>
      </g>
      <VesselFront season={season} mood={mood} paint={paint} uid={uid} />
    </svg>
  );
}

function Flame({
  mood,
  season,
  paint,
}: {
  mood: Exclude<Mood, "out">;
  season?: SeasonId;
  paint: (name: string) => string;
}) {
  const body = BODY[mood];
  return (
    <g className="dagwick-flame">
      {mood === "radiant" && (
        <g fill={paint("flame")}>
          <path className="dagwick-arm" d="M50 84 C42 78 36.5 66 39.5 53 C42.5 59.5 49 62.5 57 64Z" />
          <path className="dagwick-arm" d="M110 84 C118 78 123.5 66 120.5 53 C117.5 59.5 111 62.5 103 64Z" />
        </g>
      )}
      <path d={body.outer} fill={paint("flame")} />
      {mood === "worried" && <path d={body.outer} fill={paint("cool")} />}
      <path className="dagwick-core" d={body.core} fill={paint("core")} />
      <path d={body.shine} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3.4" strokeLinecap="round" />
      <g transform={`translate(0 ${body.faceY})`}>
        <Face mood={mood} />
        <Costume season={season} mood={mood} part="face" />
      </g>
      <Costume season={season} mood={mood} part="head" />
    </g>
  );
}

/** Grade F: the flame is out. An ember still glows on the wick and Wick is a wisp of smoke. */
function Smoke({ season, paint }: { season?: SeasonId; paint: (name: string) => string }) {
  return (
    <g>
      <circle className="dagwick-ember-halo" cx="80" cy="100.5" r="6.5" fill="var(--dagwick-flame-deep)" opacity="0.3" />
      <circle className="dagwick-ember" cx="80" cy="100.5" r="2.4" fill="var(--dagwick-flame-deep)" />
      <g fill="var(--dagwick-smoke-lo)">
        <circle className="dagwick-puff" cx="100" cy="45" r="4.6" opacity="0.55" />
        <circle className="dagwick-puff" cx="107" cy="32" r="3.2" opacity="0.4" />
        <circle className="dagwick-puff" cx="62" cy="42" r="3.6" opacity="0.45" />
      </g>
      <g className="dagwick-ghost">
        <g fill={paint("smoke")} opacity="0.95">
          <path d="M80 99.5 C75 95 84 91 79.5 86.5 C77 84 73 84 70.5 81 L89.5 81 C88.5 84.5 86.5 86 84.5 89 C82 93 85 96 80 99.5Z" />
          <circle cx="80" cy="71" r="17.5" />
          <circle cx="66.5" cy="77" r="9.5" />
          <circle cx="93.5" cy="77" r="9.5" />
          <circle cx="71" cy="59.5" r="9" />
          <circle cx="88" cy="58.5" r="10.5" />
        </g>
        <Face mood="out" />
        <Costume season={season} mood="out" part="face" />
        <Costume season={season} mood="out" part="head" />
      </g>
    </g>
  );
}

function Face({ mood }: { mood: Mood }) {
  const ink = mood === "out" ? "var(--dagwick-smoke-ink)" : "var(--dagwick-ink)";
  const line = { fill: "none", stroke: ink, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (mood) {
    case "radiant":
      return (
        <g className="dagwick-face">
          <path d="M63.5 79.5 q5.5 -8 11 0" {...line} strokeWidth="3.2" />
          <path d="M85.5 79.5 q5.5 -8 11 0" {...line} strokeWidth="3.2" />
          <path d="M71.5 85 q8.5 2.6 17 0 q-0.6 9.8 -8.5 9.8 q-7.9 0 -8.5 -9.8z" fill="var(--dagwick-mouth)" />
          <path d="M75.2 92.4 q4.8 -3.2 9.6 0 q-1.8 2.4 -4.8 2.4 q-3 0 -4.8 -2.4z" fill="var(--dagwick-tongue)" />
          <Blush />
        </g>
      );
    case "happy":
      return (
        <g className="dagwick-face">
          <g className="dagwick-eyes">
            <ellipse cx="69" cy="78" rx="4.3" ry="5.4" fill={ink} />
            <ellipse cx="91" cy="78" rx="4.3" ry="5.4" fill={ink} />
            <circle cx="70.5" cy="75.8" r="1.6" fill="#fff" />
            <circle cx="92.5" cy="75.8" r="1.6" fill="#fff" />
          </g>
          <path d="M72.5 87 q7.5 6.6 15 0" {...line} strokeWidth="3" />
          <Blush />
        </g>
      );
    case "calm":
      return (
        <g className="dagwick-face">
          <g className="dagwick-eyes">
            <circle cx="69" cy="79" r="3.7" fill={ink} />
            <circle cx="91" cy="79" r="3.7" fill={ink} />
            <circle cx="70.2" cy="77.6" r="1.1" fill="#fff" />
            <circle cx="92.2" cy="77.6" r="1.1" fill="#fff" />
          </g>
          <path d="M75 89 h10" {...line} strokeWidth="3" />
        </g>
      );
    case "worried":
      return (
        <g className="dagwick-face">
          <path d="M62 72 l9.5 -3.4" {...line} strokeWidth="2.6" />
          <path d="M98 72 l-9.5 -3.4" {...line} strokeWidth="2.6" />
          <g className="dagwick-eyes">
            <ellipse cx="69" cy="80" rx="4.2" ry="5" fill={ink} />
            <ellipse cx="91" cy="80" rx="4.2" ry="5" fill={ink} />
            <circle cx="70.4" cy="78" r="1.8" fill="#fff" />
            <circle cx="92.4" cy="78" r="1.8" fill="#fff" />
            <circle cx="67.6" cy="82.4" r="0.9" fill="#fff" />
            <circle cx="89.6" cy="82.4" r="0.9" fill="#fff" />
          </g>
          <path d="M73 91 q3.5 -4 7 0 t7 0" {...line} strokeWidth="2.8" />
          <g className="dagwick-sweat">
            <path d="M105.5 56 q4.8 7 0 11 q-4.8 -4 0 -11z" fill="var(--dagwick-tear)" />
            <circle cx="104.4" cy="63.6" r="1" fill="#fff" opacity="0.8" />
          </g>
        </g>
      );
    case "out":
      return (
        <g className="dagwick-face">
          <path d="M66.5 66 l8 -2.2" {...line} strokeWidth="2.2" />
          <path d="M93.5 66 l-8 -2.2" {...line} strokeWidth="2.2" />
          <path d="M68 71.5 q4.2 3.8 8.4 0" {...line} strokeWidth="2.8" />
          <path d="M83.6 71.5 q4.2 3.8 8.4 0" {...line} strokeWidth="2.8" />
          <path d="M76 82.5 q4 -3.2 8 0" {...line} strokeWidth="2.6" />
          <path d="M70 76 q2.6 3.8 0 5.8 q-2.6 -2 0 -5.8z" fill="var(--dagwick-tear)" />
        </g>
      );
  }
}

function Blush() {
  return (
    <g fill="var(--dagwick-blush)" opacity="0.75">
      <ellipse cx="59.5" cy="86.5" rx="5.4" ry="3.3" />
      <ellipse cx="100.5" cy="86.5" rx="5.4" ry="3.3" />
    </g>
  );
}
