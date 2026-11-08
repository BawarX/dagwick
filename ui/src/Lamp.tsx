import type { Grade } from "./types";

type Mood = "radiant" | "happy" | "calm" | "worried" | "out";

export function moodFor(grade: Grade): Mood {
  return ({ A: "radiant", B: "happy", C: "calm", D: "worried", F: "out" } as const)[grade];
}

/**
 * Dagwick: a hurricane lantern. The flame inside the glass grows with the score;
 * at grade F it goes out and smoke rises from the cap instead.
 */
export function Lamp({ mood, size = 150 }: { mood: Mood; size?: number }) {
  const flameScale = { radiant: 1.15, happy: 1, calm: 0.8, worried: 0.55, out: 0 }[mood];
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
