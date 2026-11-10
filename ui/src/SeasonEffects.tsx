import type { CSSProperties, ReactNode } from "react";

import type { Season, SeasonId } from "./season";
import type { SeasonState } from "./useSeason";

/** Stable pseudo-random numbers, so the scene looks the same on every render. */
const rand = (i: number, k = 0) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const sec = (v: number) => `${v.toFixed(2)}s`;

const CONFETTI = ["#f472b6", "#60a5fa", "#fde047", "#4ade80", "#c084fc", "#fb923c"];
const DANCER_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#14b8a6"];
const KURDISH_LETTERS = ["ڕ", "ڵ", "ڤ", "ێ", "ۆ", "ژ", "چ", "گ", "پ", "ê", "î", "û", "ş", "ç", "x", "Kurdî", "کوردی"];

function Snow() {
  return (
    <>
      {range(28).map((i) => (
        <span
          key={i}
          className="dagwick-flake"
          style={{
            left: pct(rand(i, 1)),
            width: 3 + rand(i, 2) * 5,
            height: 3 + rand(i, 2) * 5,
            opacity: 0.5 + rand(i, 3) * 0.5,
            animationDuration: `${sec(6 + rand(i, 4) * 7)}, ${sec(2.5 + rand(i, 5) * 2)}`,
            animationDelay: `${sec(-rand(i, 6) * 12)}, ${sec(-rand(i, 7) * 3)}`,
          }}
        />
      ))}
      <svg className="dagwick-snowbank" viewBox="0 0 400 20" preserveAspectRatio="none">
        <path d="M0 20 V10 Q20 2 45 9 T95 8 T150 10 T205 7 T260 10 T320 6 T400 9 V20 Z" />
      </svg>
    </>
  );
}

function Bat({ style }: { style: CSSProperties }) {
  return (
    <span className="dagwick-bat" style={style}>
      <span className="dagwick-bat-bob">
        <svg viewBox="0 0 40 20" width="34" height="17">
          <g className="dagwick-wing-l">
            <path d="M20 9 C 14 2, 6 2, 0 6 C 5 7, 7 10, 6 13 C 10 10, 14 11, 20 12 Z" />
          </g>
          <g className="dagwick-wing-r">
            <path d="M20 9 C 26 2, 34 2, 40 6 C 35 7, 33 10, 34 13 C 30 10, 26 11, 20 12 Z" />
          </g>
          <ellipse cx="20" cy="10.5" rx="3" ry="4" />
          <path d="M18 7 l-1 -3 2 2 M22 7 l1 -3 -2 2" />
        </svg>
      </span>
    </span>
  );
}

function Bats() {
  return (
    <>
      <span className="dagwick-moon" />
      {range(7).map((i) => (
        <Bat
          key={i}
          style={{
            top: pct(0.06 + rand(i, 1) * 0.55),
            transform: `scale(${0.6 + rand(i, 2) * 0.7})`,
            animationDuration: sec(9 + rand(i, 3) * 8),
            animationDelay: sec(-rand(i, 4) * 16),
          }}
        />
      ))}
    </>
  );
}

function Confetti({ n = 30 }: { n?: number }) {
  return (
    <>
      {range(n).map((i) => (
        <span
          key={i}
          className="dagwick-confetti"
          style={{
            left: pct(rand(i, 1)),
            background: CONFETTI[i % CONFETTI.length],
            animationDuration: `${sec(4 + rand(i, 2) * 5)}, ${sec(1 + rand(i, 3) * 2)}`,
            animationDelay: `${sec(-rand(i, 4) * 9)}, 0s`,
          }}
        />
      ))}
    </>
  );
}

function Fireworks() {
  return (
    <>
      {[
        { left: "12%", top: "18%", color: "#f472b6", delay: 0 },
        { left: "82%", top: "14%", color: "#60a5fa", delay: 1.1 },
        { left: "64%", top: "30%", color: "#fde047", delay: 2.2 },
      ].map((f, i) => (
        <span key={i} className="dagwick-firework" style={{ left: f.left, top: f.top, animationDelay: sec(f.delay) }}>
          {range(12).map((j) => (
            <i key={j} style={{ background: f.color, transform: `rotate(${j * 30}deg) translateY(-26px)` }} />
          ))}
        </span>
      ))}
    </>
  );
}

function Balloons() {
  return (
    <>
      {range(5).map((i) => (
        <span
          key={i}
          className="dagwick-balloon"
          style={{
            left: pct(0.08 + rand(i, 1) * 0.84),
            background: CONFETTI[i % CONFETTI.length],
            animationDuration: sec(10 + rand(i, 2) * 6),
            animationDelay: sec(-rand(i, 3) * 14),
          }}
        />
      ))}
    </>
  );
}

/** Newroz: mountains with bonfires on the peaks, rising embers, and govend dancers holding hands. */
function Newroz() {
  return (
    <>
      {range(18).map((i) => (
        <span
          key={i}
          className="dagwick-ember"
          style={{
            left: pct(0.05 + rand(i, 1) * 0.9),
            animationDuration: sec(4 + rand(i, 2) * 4),
            animationDelay: sec(-rand(i, 3) * 8),
          }}
        />
      ))}
      <svg className="dagwick-mountains" viewBox="0 0 800 120" preserveAspectRatio="none">
        <path className="far" d="M0 120 L0 70 L90 30 L170 66 L260 18 L360 64 L450 26 L560 70 L650 22 L740 60 L800 40 L800 120 Z" />
        <path className="near" d="M0 120 L0 92 L120 58 L220 90 L330 54 L440 92 L560 60 L690 94 L800 64 L800 120 Z" />
      </svg>
      {/* Newroz bonfires on the peaks (HTML, so they keep their shape when the mountains stretch). */}
      {[
        [0.325, 0.6],
        [0.5625, 0.638],
        [0.8125, 0.61],
      ].map(([x, y], i) => (
        <span key={i} className="dagwick-fire" style={{ left: pct(x), top: pct(y), animationDelay: sec(i * 0.3) }} />
      ))}
      <div className="dagwick-govend">
        {range(9).map((i) => (
          <span key={i} className="dagwick-dancer" style={{ animationDelay: sec(i * 0.18) }}>
            <svg viewBox="0 0 20 36" width="22" height="40">
              <circle cx="10" cy="5" r="4" fill="#f1d3b3" />
              <path d="M6 3 Q10 -1 14 3 L14 5 L6 5 Z" fill={i % 2 ? "#1f2937" : "#7c2d12"} />
              <path d="M10 9 L3 32 L17 32 Z" fill={DANCER_COLORS[i % DANCER_COLORS.length]} />
              <path d="M7 32 L7 35 M13 32 L13 35" stroke="#1f2937" strokeWidth="1.6" />
              <path d="M-1 15 L21 15" stroke="#f1d3b3" strokeWidth="2" strokeLinecap="round" />
              {/* the leader waves a desmal (handkerchief) */}
              {i === 0 && <path d="M-1 15 L-5 6 L1 9 Z" fill="#facc15" />}
            </svg>
          </span>
        ))}
      </div>
    </>
  );
}

function Stars({ n = 22 }: { n?: number }) {
  return (
    <>
      {range(n).map((i) => (
        <span
          key={i}
          className="dagwick-star"
          style={{
            left: pct(rand(i, 1)),
            top: pct(rand(i, 2) * 0.7),
            animationDelay: sec(-rand(i, 3) * 3),
            animationDuration: sec(2 + rand(i, 4) * 2.5),
          }}
        />
      ))}
    </>
  );
}

function HangingLanterns() {
  return (
    <div className="dagwick-hanging">
      {[0.2, 0.55, 0.85].map((x, i) => (
        <span key={i} style={{ left: pct(x), height: 26 + i * 14, animationDelay: sec(i * 0.6) }}>
          <svg viewBox="0 0 16 26" width="16" height="26">
            <path d="M8 0 L8 4" stroke="#e9c46a" />
            <path d="M3 6 L13 6 L11 4 L5 4 Z" fill="#e9c46a" />
            <path d="M3 6 Q0 13 3 20 L13 20 Q16 13 13 6 Z" fill="#fbbf24" opacity=".85" />
            <path d="M4 20 L12 20 L10 23 L6 23 Z" fill="#e9c46a" />
          </svg>
        </span>
      ))}
    </div>
  );
}

function Bunting() {
  return (
    <svg className="dagwick-bunting" viewBox="0 0 800 40" preserveAspectRatio="none">
      <path d="M0 4 Q400 34 800 4" fill="none" stroke="#e9c46a" strokeWidth="1.5" />
      {range(16).map((i) => {
        const x = 25 + i * 48;
        const y = 4 + 30 * (1 - ((x - 400) / 400) ** 2) * 0.95;
        return <path key={i} d={`M${x - 10} ${y} L${x + 10} ${y} L${x} ${y + 16} Z`} fill={CONFETTI[i % CONFETTI.length]} />;
      })}
    </svg>
  );
}

function Letters() {
  return (
    <>
      {range(16).map((i) => (
        <span
          key={i}
          className="dagwick-letter"
          style={{
            left: pct(0.04 + rand(i, 1) * 0.92),
            fontSize: 13 + rand(i, 2) * 11,
            animationDuration: sec(7 + rand(i, 3) * 6),
            animationDelay: sec(-rand(i, 4) * 12),
          }}
        >
          {KURDISH_LETTERS[i % KURDISH_LETTERS.length]}
        </span>
      ))}
    </>
  );
}

/** Diwali: a garland of marigolds along the top and a row of lit diyas along the bottom. */
function Diwali() {
  const n = 9;
  return (
    <>
      <svg className="dagwick-marigolds" viewBox="0 0 800 46" preserveAspectRatio="none">
        <path d="M0 4 Q200 36 400 4 Q600 36 800 4" fill="none" stroke="#65a30d" strokeWidth="2" />
        {range(26).map((i) => {
          const x = 8 + i * 31;
          const t = (x % 400) / 400;
          const y = 4 + 2 * (1 - t) * t * 32; // on the two swags of the string
          return <circle key={i} cx={x} cy={y.toFixed(1)} r="6" fill={i % 3 ? "#f59e0b" : "#ea580c"} />;
        })}
        {[200, 600].map((x) => (
          <g key={x}>
            {range(3).map((k) => (
              <circle key={k} cx={x} cy={26 + k * 6.5} r="3.6" fill={k % 2 ? "#ea580c" : "#fbbf24"} />
            ))}
          </g>
        ))}
      </svg>
      <Stars n={10} />
      {range(n).map((i) => (
        <span key={i} className="dagwick-diya" style={{ left: pct(0.05 + (i / (n - 1)) * 0.9) }}>
          <span className="dagwick-diya-flame" style={{ animationDelay: sec(-rand(i, 1)), animationDuration: sec(0.35 + rand(i, 2) * 0.3) }} />
          <svg viewBox="0 0 30 14" width="30" height="14">
            <path d="M2 3 Q15 0 26 3 L30 1.6 Q28 5 25 6.4 Q22 13 15 13 Q6 13 3 7 Q1 5 2 3Z" fill="#c2410c" />
            <ellipse cx="14" cy="3.4" rx="11" ry="2" fill="#7c2d12" />
            <path d="M6 8.6 h16" stroke="#fde68a" strokeWidth="1.2" strokeDasharray="1.4 2" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </>
  );
}

/** The Lantern Festival: round red lanterns swinging from the top, sky lanterns drifting up. */
function LanternFestival() {
  return (
    <>
      {range(7).map((i) => (
        <span
          key={i}
          className="dagwick-sky-lantern"
          style={{
            left: pct(0.06 + rand(i, 1) * 0.88),
            transform: `scale(${(0.6 + rand(i, 2) * 0.6).toFixed(2)})`,
            animationDuration: sec(14 + rand(i, 3) * 10),
            animationDelay: sec(-rand(i, 4) * 22),
          }}
        />
      ))}
      <div className="dagwick-hanging dagwick-hanging--red">
        {[0.14, 0.4, 0.66, 0.9].map((x, i) => (
          <span key={i} style={{ left: pct(x), height: 30 + (i % 2) * 18, animationDelay: sec(i * 0.7) }}>
            <svg viewBox="0 0 26 34" width="26" height="34">
              <rect x="9" y="0" width="8" height="3" rx="1" fill="#facc15" />
              <ellipse cx="13" cy="14" rx="12" ry="11" fill="#dc2626" />
              <path d="M13 3 Q5 14 13 25 M13 3 Q21 14 13 25 M2 14 H24" fill="none" stroke="#7f1d1d" strokeWidth="0.9" />
              <rect x="9" y="24" width="8" height="3" rx="1" fill="#facc15" />
              <path d="M11 27 V33 M13 27 V34 M15 27 V33" stroke="#facc15" strokeWidth="1" />
            </svg>
          </span>
        ))}
      </div>
    </>
  );
}

/** Çarşema Sor: red spring flowers along the bottom, painted eggs, and the sunrise. */
function CarsemaSor() {
  const EGGS = ["#dc2626", "#facc15", "#16a34a", "#2563eb", "#c026d3"];
  return (
    <>
      <span className="dagwick-sunrise" />
      <svg className="dagwick-meadow" viewBox="0 0 800 60" preserveAspectRatio="none">
        <path d="M0 60 V44 Q200 34 400 42 T800 40 V60Z" className="ground" />
      </svg>
      {range(14).map((i) => (
        <span
          key={i}
          className="dagwick-poppy"
          style={{
            left: pct(0.03 + (i / 13) * 0.94 + (rand(i, 1) - 0.5) * 0.03),
            height: 18 + rand(i, 2) * 16,
            animationDelay: sec(-rand(i, 3) * 3),
          }}
        >
          <svg viewBox="0 0 16 14" width="16" height="14">
            <circle cx="5" cy="6" r="4.6" fill="#dc2626" />
            <circle cx="11" cy="6" r="4.6" fill="#ef4444" />
            <circle cx="8" cy="9" r="4.6" fill="#b91c1c" />
            <circle cx="8" cy="7" r="2" fill="#1c1917" />
          </svg>
        </span>
      ))}
      {[0.22, 0.47, 0.71].map((x, g) => (
        <svg key={g} className="dagwick-eggs" style={{ left: pct(x) }} viewBox="0 0 44 22" width="44" height="22">
          {[0, 1, 2].map((k) => {
            const c = EGGS[(g * 2 + k) % EGGS.length];
            const cx = 8 + k * 14;
            return (
              <g key={k}>
                <ellipse cx={cx} cy="13" rx="6.4" ry="8" fill={c} />
                <path d={`M${cx - 6} 12 q3 -3 6 0 t6 0`} fill="none" stroke="#fef3c7" strokeWidth="1.2" />
              </g>
            );
          })}
        </svg>
      ))}
    </>
  );
}

const SCENES: Record<SeasonId, () => ReactNode> = {
  christmas: () => <Snow />,
  halloween: () => <Bats />,
  "new-year": () => (
    <>
      <Fireworks />
      <Confetti />
    </>
  ),
  birthday: () => (
    <>
      <Balloons />
      <Confetti n={18} />
    </>
  ),
  newroz: () => <Newroz />,
  ramadan: () => (
    <>
      <Stars />
      <HangingLanterns />
    </>
  ),
  eid: () => (
    <>
      <Bunting />
      <Stars n={14} />
    </>
  ),
  "language-day": () => <Letters />,
  diwali: () => <Diwali />,
  "lantern-festival": () => <LanternFestival />,
  "carsema-sor": () => <CarsemaSor />,
};

/** Decorative layer behind the hero content. Hidden from screen readers. */
export function SeasonEffects({ season }: { season?: Season }) {
  if (!season) return null;
  return (
    <div className={`dagwick-fx dagwick-fx--${season.id}`} aria-hidden="true">
      {SCENES[season.id]()}
    </div>
  );
}

/** "🎄 Merry Christmas!" with a way to hide it. */
export function SeasonGreeting({ state }: { state: SeasonState }) {
  const { season, available, hidden, setHidden } = state;
  if (season) {
    return (
      <div className="dagwick-greeting">
        <span aria-hidden="true">{season.icon}</span>
        <span>{season.greeting}</span>
        <button className="dagwick-greeting-hide" onClick={() => setHidden(true)} title="Hide seasonal decorations">
          Hide
        </button>
      </div>
    );
  }
  if (available && hidden) {
    return (
      <button className="dagwick-greeting-show" onClick={() => setHidden(false)}>
        {available.icon} Show the {available.name} mood
      </button>
    );
  }
  return null;
}
