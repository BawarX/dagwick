import type { SeasonId } from "./season";
import type { Grade } from "./types";

type Mood = "radiant" | "happy" | "calm" | "worried" | "out";

export function moodFor(grade: Grade): Mood {
  return ({ A: "radiant", B: "happy", C: "calm", D: "worried", F: "out" } as const)[grade];
}

/**
 * Dagwick: a hurricane lantern. The flame inside the glass grows with the score;
 * at grade F it goes out and smoke rises from the cap instead.
 */
export function Lamp({ mood, size = 150, season }: { mood: Mood; size?: number; season?: SeasonId }) {
  const flameScale =
    { radiant: 1.15, happy: 1, calm: 0.8, worried: 0.55, out: 0 }[mood] * (season === "newroz" ? 1.25 : 1);
  const lit = mood !== "out";
  return (
    <svg
      className={`dagwick-lamp dagwick-lamp--${mood}`}
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label={lit ? `Lantern is ${mood}` : "Lantern has gone out"}
    >
      <defs>
        <radialGradient id="dagwick-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--dagwick-flame-core)" stopOpacity="0.6" />
          <stop offset="55%" stopColor="var(--dagwick-flame)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--dagwick-flame)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dagwick-flame-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-flame-deep)" />
          <stop offset="55%" stopColor="var(--dagwick-flame)" />
          <stop offset="100%" stopColor="var(--dagwick-flame-core)" />
        </linearGradient>
        <linearGradient id="dagwick-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-metal-dark)" />
          <stop offset="45%" stopColor="var(--dagwick-metal)" />
          <stop offset="100%" stopColor="var(--dagwick-metal-dark)" />
        </linearGradient>
        <linearGradient id="dagwick-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--dagwick-glass)" stopOpacity="0.35" />
          <stop offset="30%" stopColor="var(--dagwick-glass)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--dagwick-glass)" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <ellipse cx="80" cy="146" rx="44" ry="5" fill="var(--dagwick-shadow)" />

      {season && <SeasonBehind season={season} />}

      {lit && <circle className="dagwick-glow" cx="80" cy="88" r={44 * flameScale + 16} fill="url(#dagwick-glow)" />}

      {mood === "radiant" && (
        <g className="dagwick-sparkles" fill="var(--dagwick-flame-core)">
          <path d="M128 52 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" />
          <path d="M30 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" />
          <path d="M132 100 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" />
        </g>
      )}

      <g className="dagwick-body">
        {/* carrying handle */}
        <path d="M56 50 C 56 16, 104 16, 104 50" fill="none" stroke="var(--dagwick-metal-dark)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="24" r="5" fill="none" stroke="var(--dagwick-metal-dark)" strokeWidth="3.5" />

        {/* cap */}
        <path d="M62 44 L98 44 L110 58 L50 58 Z" fill="url(#dagwick-metal)" />
        <rect x="70" y="38" width="20" height="7" rx="2" fill="var(--dagwick-metal-dark)" />

        {/* flame (behind the glass) */}
        {lit && (
          <g className="dagwick-flame" style={{ transform: `scale(${flameScale})` }}>
            <path
              d="M80 106 C 67 98, 71 82, 80 68 C 82 79, 93 86, 89 97 C 87 102, 84 105, 80 106 Z"
              fill="url(#dagwick-flame-grad)"
            />
            <path d="M80 104 C 75 99, 77 92, 80 86 C 81 92, 86 95, 84 99 C 83 102, 81 103, 80 104 Z" fill="var(--dagwick-flame-core)" />
          </g>
        )}

        {/* burner + wick */}
        <path d="M70 114 L90 114 L87 106 L73 106 Z" fill="var(--dagwick-metal-dark)" />
        <path d="M80 106 L80 102" stroke="var(--dagwick-wick)" strokeWidth="2.5" strokeLinecap="round" />

        {/* glass globe */}
        <path
          d="M58 58 C 40 72, 40 100, 58 114 L102 114 C 120 100, 120 72, 102 58 Z"
          fill="url(#dagwick-glass)"
          stroke="var(--dagwick-glass-edge)"
          strokeWidth="1.5"
        />
        <path d="M54 72 C 50 82, 50 92, 54 102" fill="none" stroke="var(--dagwick-glass)" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
        {/* guard wires */}
        <path d="M66 58 C 58 76, 58 96, 66 114" fill="none" stroke="var(--dagwick-metal-dark)" strokeWidth="2.5" />
        <path d="M94 58 C 102 76, 102 96, 94 114" fill="none" stroke="var(--dagwick-metal-dark)" strokeWidth="2.5" />

        {/* fuel tank */}
        <path d="M48 114 L112 114 L116 134 C 116 141, 44 141, 44 134 Z" fill="url(#dagwick-metal)" />
        <rect x="44" y="132" width="72" height="5" rx="2.5" fill="var(--dagwick-metal-dark)" opacity="0.6" />
        <Face mood={mood} />
      </g>

      {season && <SeasonFront season={season} />}

      {!lit && (
        <g className="dagwick-smoke" fill="none" stroke="var(--dagwick-smoke)" strokeWidth="3" strokeLinecap="round">
          <path d="M80 36 C 72 28, 88 22, 80 14 C 72 6, 88 0, 82 -6" />
        </g>
      )}
    </svg>
  );
}

function Face({ mood }: { mood: Mood }) {
  const y = 122;
  const ink = "var(--dagwick-ink)";
  const mouth = {
    radiant: "M73 127 Q 80 134 87 127",
    happy: "M74 128 Q 80 132 86 128",
    calm: "M75 129 L 85 129",
    worried: "M74 131 Q 80 126 86 131",
    out: "M75 131 Q 80 128 85 131",
  }[mood];
  return (
    <g className="dagwick-face">
      {mood === "radiant" || mood === "happy" ? (
        <>
          <path d={`M65 ${y} q4 -4.5 8 0`} stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d={`M87 ${y} q4 -4.5 8 0`} stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "out" ? (
        <>
          <path d={`M65 ${y - 1} l8 2`} stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
          <path d={`M87 ${y + 1} l8 -2`} stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : (
        <g className="dagwick-eyes">
          <circle cx="69" cy={y} r="3" fill={ink} />
          <circle cx="91" cy={y} r="3" fill={ink} />
        </g>
      )}
      <path d={mouth} stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {(mood === "radiant" || mood === "happy") && (
        <>
          <circle cx="60" cy="127" r="3.5" fill="var(--dagwick-blush)" />
          <circle cx="100" cy="127" r="3.5" fill="var(--dagwick-blush)" />
        </>
      )}
      {mood === "worried" && <path d="M100 116 q3 5 0 8 q-3 -3 0 -8z" fill="var(--dagwick-tear)" />}
    </g>
  );
}

/** Seasonal props drawn behind the lantern (same 160x160 coordinate box). */
function SeasonBehind({ season }: { season: SeasonId }) {
  if (season === "ramadan" || season === "eid") {
    return (
      <g fill="#fde68a">
        <path d="M128 4 a15 15 0 1 0 13 24 a12 12 0 1 1 -13 -24z" />
        <path d="M148 40 l1.5 4 4.3 .2 -3.4 2.6 1.2 4.2 -3.6 -2.4 -3.6 2.4 1.2 -4.2 -3.4 -2.6 4.3 -.2z" />
      </g>
    );
  }
  return null;
}

/** Seasonal props drawn on top of the lantern. */
function SeasonFront({ season }: { season: SeasonId }) {
  switch (season) {
    case "christmas":
      return (
        <g className="dagwick-acc">
          <path d="M54 40 C 60 10, 96 2, 124 18 C 112 16, 104 22, 106 40 Z" fill="#dc2626" />
          <circle cx="126" cy="19" r="7" fill="#fff" />
          <rect x="48" y="36" width="64" height="12" rx="6" fill="#fff" />
          <path d="M48 114 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 16 0 Z" fill="#fff" />
          <g transform="translate(104 117)">
            <path d="M0 0 q6 -8 12 -2 q-6 0 -12 2z" fill="#16a34a" />
            <path d="M0 0 q-2 -10 6 -12 q-2 6 -6 12z" fill="#15803d" />
            <circle cx="1" cy="-1" r="2.4" fill="#dc2626" />
            <circle cx="4.5" cy="1" r="2.2" fill="#ef4444" />
          </g>
        </g>
      );
    case "new-year":
    case "birthday":
      return (
        <g className="dagwick-acc" transform="rotate(-12 80 40)">
          <polygon points="68,42 92,42 80,2" fill={season === "birthday" ? "#ec4899" : "#7c3aed"} />
          <path d="M71 34 L89 34 M74 24 L86 24 M77 14 L83 14" stroke="#fde047" strokeWidth="3" />
          <circle cx="80" cy="2" r="4.5" fill={season === "birthday" ? "#60a5fa" : "#f472b6"} />
        </g>
      );
    case "newroz":
      return (
        <g className="dagwick-acc">
          <path d="M66 44 q4 -7 8 -2 M94 44 q-4 -7 -8 -2" stroke="#22c55e" strokeWidth="2" fill="none" />
          <circle cx="60" cy="43" r="5" fill="#f9a8d4" />
          <circle cx="60" cy="43" r="2" fill="#fde047" />
          <circle cx="80" cy="37" r="5.5" fill="#fef08a" />
          <circle cx="80" cy="37" r="2.2" fill="#f97316" />
          <circle cx="100" cy="43" r="5" fill="#ffffff" />
          <circle cx="100" cy="43" r="2" fill="#fde047" />
        </g>
      );
    case "halloween":
      return (
        <g className="dagwick-acc dagwick-spider">
          <path d="M104 58 L112 84" stroke="#d8d0e8" strokeWidth=".8" />
          <circle cx="112" cy="87" r="3.4" fill="#1a1024" />
          <path d="M108 85 l-4 -2 M108 88 l-4 1 M116 85 l4 -2 M116 88 l4 1" stroke="#1a1024" strokeWidth="1" />
        </g>
      );
    case "eid":
      // A plate of kulîçe (klicha), the Kurdish date-filled cookies baked for Eid.
      return (
        <g className="dagwick-acc">
          <ellipse cx="128" cy="141" rx="20" ry="4" fill="#e5e7eb" />
          {[
            [118, 135],
            [130, 133],
            [140, 137],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="6.5" fill="#c98b4a" stroke="#8a5a2b" strokeWidth="1" />
              <path d={`M${x - 3.5} ${y} a3.5 3.5 0 1 1 7 0`} fill="none" stroke="#8a5a2b" strokeWidth="1" />
              <circle cx={x} cy={y} r="1.2" fill="#8a5a2b" />
            </g>
          ))}
        </g>
      );
    case "language-day":
      // A small scroll with the Kurdish letter "ک".
      return (
        <g className="dagwick-acc">
          <rect x="114" y="104" width="30" height="24" rx="3" fill="#fff7e6" stroke="#c9a46b" />
          <rect x="112" y="102" width="34" height="5" rx="2.5" fill="#e9d3a7" />
          <rect x="112" y="125" width="34" height="5" rx="2.5" fill="#e9d3a7" />
          <text x="129" y="122" textAnchor="middle" fontSize="15" fill="#7c2d12" fontWeight="700">
            ک
          </text>
        </g>
      );
    default:
      return null;
  }
}
