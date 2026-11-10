// What Wick burns on and what it wears. Purely cosmetic: every season is the
// same flame in a different vessel and outfit (same 160x160 box as Wick.tsx).
import type { ReactNode } from "react";

import type { SeasonId } from "./season";
import type { Mood } from "./Wick";

interface SkinProps {
  season?: SeasonId;
  mood: Mood;
  /** url(#...) of a gradient defined by Wick. */
  paint: (name: string) => string;
  /** Prefix for ids that must be unique on the page. */
  uid: string;
}

/**
 * Vessels whose wick is not at the usual height move (and resize) the flame to
 * fit. `out` is the extra drop for the smoke, when it rises from lower down.
 */
export const FLAME_FIT: Partial<Record<SeasonId, { dy: number; scale: number; out?: number }>> = {
  newroz: { dy: 5, scale: 1.1, out: 17 },
  ramadan: { dy: 9.4, scale: 0.8 },
};

/** How many of the four DAG nodes stamped on the everyday candle are lit. */
const LIT_NODES: Record<Mood, number> = { radiant: 4, happy: 3, calm: 2, worried: 1, out: 0 };

const CONFETTI = ["#f472b6", "#60a5fa", "#fde047", "#4ade80", "#c084fc", "#fb923c"];

const wick = (top: number, bottom: number) => (
  <path d={`M80 ${bottom} V${top}`} stroke="var(--dagwick-wick)" strokeWidth="2.6" strokeLinecap="round" />
);

/** A round dish seen slightly from above. */
function Dish({ paint, rx = 41, cy = 141 }: { paint: SkinProps["paint"]; rx?: number; cy?: number }) {
  return (
    <>
      <ellipse cx="80" cy={cy + 3.6} rx={rx} ry="7" fill="var(--dagwick-metal-dark)" />
      <ellipse cx="80" cy={cy} rx={rx} ry="7" fill={paint("metal")} />
      <ellipse cx="80" cy={cy + 0.4} rx={rx - 9} ry="4.6" fill="var(--dagwick-metal-dark)" opacity="0.4" />
    </>
  );
}

/** A pillar candle: body, top and a little pool of melted wax. */
function Pillar({
  body,
  top,
  pool,
  edge = "none",
  w = 17.5,
  y = 114,
  bottom = 140,
}: {
  body: string;
  top: string;
  pool: string;
  edge?: string;
  w?: number;
  y?: number;
  bottom?: number;
}) {
  return (
    <>
      <path
        d={`M${80 - w} ${y} V${bottom} A${w} 4.6 0 0 0 ${80 + w} ${bottom} V${y} Z`}
        fill={body}
        stroke={edge}
        strokeWidth="1"
      />
      <ellipse cx="80" cy={y} rx={w} ry="4.6" fill={top} stroke={edge} strokeWidth="1" />
      <ellipse cx="80" cy={y + 0.5} rx={w * 0.6} ry="2.6" fill={pool} />
    </>
  );
}

/** Shading down the right side of a pillar candle. */
const pillarShade = (fill: string, opacity: number) => (
  <path d="M90.5 115 V144 Q95.5 143 97.5 140 V114 Q94.5 115 90.5 115Z" fill={fill} opacity={opacity} />
);

/** Path of a four-pointed star; `pinch` is how thin its waist is. */
export function starPath(x: number, y: number, r: number, pinch = 0.3) {
  const k = r * pinch;
  const arm = r - k;
  return `M${x} ${y - r} l${k} ${arm} ${arm} ${k} ${-arm} ${k} ${-k} ${arm} ${-k} ${-arm} ${-arm} ${-k} ${arm} ${-k}z`;
}

function Star({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return <path d={starPath(x, y, r)} fill={fill} />;
}

/* ------------------------------------------------------------------ */
/* Vessels: drawn behind the flame                                     */
/* ------------------------------------------------------------------ */

/** Everyday: a candle stub on a brass chamberstick, stamped with a little DAG. */
function Chamberstick({ mood, paint }: SkinProps) {
  const lit = LIT_NODES[mood];
  const nodes = [
    [70.5, 130.5],
    [80, 125.5],
    [80, 135.5],
    [89.5, 130.5],
  ];
  return (
    <g>
      {/* finger loop, lying flat like the dish */}
      <ellipse cx="124.5" cy="143.4" rx="10.5" ry="4.6" fill="none" stroke="var(--dagwick-metal-dark)" strokeWidth="4" />
      <path d="M118 140.4 a10.5 4.6 0 0 1 13.6 0.4" fill="none" stroke="var(--dagwick-metal)" strokeWidth="1.5" strokeLinecap="round" />
      <Dish paint={paint} />
      <Pillar body={paint("wax")} top="var(--dagwick-wax-top)" pool="var(--dagwick-wax-pool)" edge="var(--dagwick-wax-edge)" />
      {/* drips */}
      <g fill="var(--dagwick-wax-top)" stroke="var(--dagwick-wax-edge)" strokeWidth="1" strokeLinejoin="round">
        <path d="M65.8 116.9 Q69 118.2 72.8 118.5 V124.4 A3.5 3.5 0 0 1 65.8 124.4Z" />
        <path d="M88 118.4 Q91 118 93.8 117.2 V121 A2.9 2.9 0 0 1 88 121Z" />
      </g>
      {/* the DAG it keeps lit: one more node glows with every grade */}
      <path
        d="M70.5 130.5 L80 125.5 L89.5 130.5 L80 135.5Z"
        fill="none"
        stroke="var(--dagwick-wax-shade)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.7" fill={i < lit ? "var(--dagwick-flame)" : "var(--dagwick-wax-shade)"} />
      ))}
      {wick(105, 114)}
    </g>
  );
}

/** Christmas: a candy-striped candle in a pine wreath. */
function ChristmasCandle({ uid }: SkinProps) {
  const body = "M63 114 V140 A17 4.6 0 0 0 97 140 V114 Z";
  return (
    <g>
      <ellipse cx="80" cy="142" rx="42" ry="8.5" fill="#14532d" />
      <clipPath id={`${uid}-stripe`}>
        <path d={body} />
      </clipPath>
      <path d={body} fill="#dc2626" />
      <g clipPath={`url(#${uid}-stripe)`} stroke="#fff" strokeWidth="5.4">
        <path d="M56 127 L104 109 M56 141 L104 123 M56 155 L104 137" />
      </g>
      {pillarShade("#7f1d1d", 0.25)}
      {/* snow on top */}
      <path
        d="M61.5 114 A18.5 5 0 0 1 98.5 114 C99 118 96 119.6 93.4 118.2 C93 121.4 88.6 122 86.8 119.2 C85 122.6 79.4 123 77.6 119.6 C75.4 122.6 70.4 122 69.4 118.8 C66.6 120.6 61.8 119 61.5 114Z"
        fill="#fff"
      />
      <ellipse cx="80" cy="113.6" rx="18.5" ry="4.8" fill="#fff" />
      <ellipse cx="80" cy="114" rx="10" ry="2.4" fill="#dbe7f5" />
      {wick(105, 114)}
    </g>
  );
}

/** New Year: a midnight-blue candle scattered with gold stars. */
function NewYearCandle({ paint }: SkinProps) {
  return (
    <g>
      <Dish paint={paint} rx={36} />
      <Pillar body="#3730a3" top="#6366f1" pool="#4338ca" w={17} />
      {pillarShade("#1e1b4b", 0.35)}
      <path d="M65.5 118 V138" stroke="#a5b4fc" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />
      <Star x={74} y={126.5} r={4.2} fill="#fde047" />
      <Star x={86.5} y={133.5} r={3.2} fill="#fde047" />
      <Star x={87} y={121.5} r={2.2} fill="#fef9c3" />
      <circle cx="72" cy="136" r="1.2" fill="#fef9c3" />
      {/* streamers */}
      <path d="M43 136 q-6 -7 0 -12 q6 -5 0 -11" fill="none" stroke="#f472b6" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M118 135 q6 -6 1 -11 q-5 -5 2 -10" fill="none" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" />
      {wick(105, 114)}
    </g>
  );
}

/** Birthday: a striped candle in a cupcake. */
function Cupcake({ uid }: SkinProps) {
  const sprinkles: [number, number, number][] = [
    [61.5, 132.5, 30],
    [69.5, 128, -40],
    [90.5, 127.6, 25],
    [98.5, 132, -30],
    [80, 133.6, 80],
    [89.5, 134.6, -10],
    [71, 135, 10],
  ];
  return (
    <g>
      {/* wrapper */}
      <path d="M55.5 137 L104.5 137 L99.5 151 Q80 154.4 60.5 151Z" fill="#38bdf8" />
      <path
        d="M62.6 138 l3 14 M71.2 138 l1.7 15.4 M80 138 v15.8 M88.8 138 l-1.7 15.4 M97.4 138 l-3 14"
        stroke="#0284c7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* frosting */}
      <path
        d="M52.5 136 C50.5 130 58 126.5 64 127.2 C66 122.5 76 121.5 80 121.5 C84 121.5 94 122.5 96 127.2 C102 126.5 109.5 130 107.5 136 C106.2 140 100 139.6 96.5 137 C92.5 140.2 86 140.2 82.4 137.2 C78 140.6 71 140.2 67.6 137 C63 140 53.8 140.2 52.5 136Z"
        fill="#f9a8d4"
      />
      <path d="M61 129.4 C66 125 75 123.8 81 124" fill="none" stroke="#fdf2f8" strokeOpacity="0.9" strokeWidth="2.4" strokeLinecap="round" />
      {sprinkles.map(([x, y, a], i) => (
        <rect
          key={i}
          x={x - 2.2}
          y={y - 0.9}
          width="4.4"
          height="1.8"
          rx="0.9"
          fill={CONFETTI[i % CONFETTI.length]}
          transform={`rotate(${a} ${x} ${y})`}
        />
      ))}
      {/* the candle */}
      <clipPath id={`${uid}-bday`}>
        <path d="M76.2 114.4 Q80 112.6 83.8 114.4 V124.6 Q80 126 76.2 124.6Z" />
      </clipPath>
      <path d="M76.2 114.4 Q80 112.6 83.8 114.4 V124.6 Q80 126 76.2 124.6Z" fill="#fff" />
      <g clipPath={`url(#${uid}-bday)`} stroke="#3b82f6" strokeWidth="2.3">
        <path d="M74 118.5 l12 -5 M74 123.5 l12 -5 M74 128.5 l12 -5" />
      </g>
      {wick(105, 114)}
    </g>
  );
}

/** Newroz: the bonfire. Wick is the fire itself. */
function Bonfire({ mood }: SkinProps) {
  const lit = mood !== "out";
  return (
    <g>
      {lit && <ellipse cx="80" cy="146" rx="34" ry="6" fill="var(--dagwick-flame)" opacity="0.28" />}
      <path d="M53 148 L104 126" stroke="#6b3f1d" strokeWidth="11.5" strokeLinecap="round" />
      <path d="M57 143.8 L100 125.4" stroke="#8a5a2b" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M107 148 L56 126" stroke="#7c4a21" strokeWidth="11.5" strokeLinecap="round" />
      <path d="M103 143.8 L60 125.4" stroke="#a06a36" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {[
        [53, 148],
        [107, 148],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5.2" fill="#e2b77f" />
          <circle cx={x} cy={y} r="2.8" fill="none" stroke="#b07d45" strokeWidth="1.1" />
          <circle cx={x} cy={y} r="0.9" fill="#b07d45" />
        </g>
      ))}
      <g fill="var(--dagwick-flame-deep)" opacity={lit ? 1 : 0.55}>
        <circle cx="71.5" cy="142" r="1.6" />
        <circle cx="88.5" cy="143.5" r="1.3" />
        <circle cx="80" cy="146.5" r="1.8" />
      </g>
    </g>
  );
}

/** Halloween: a jack-o'-lantern. Its carved face glows only while Wick is lit. */
function Pumpkin({ mood }: SkinProps) {
  const lit = mood !== "out";
  const carve = lit ? "var(--dagwick-flame-core)" : "#431407";
  return (
    <g>
      {/* a tendril and a leaf */}
      <path d="M52 121 C44 121 40 114 44.5 110 C48 107 52 111 49 114" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 119.5 C56 113 63 112 66 114.5 C62 119 58 121 54 119.5Z" fill="#22c55e" />
      <ellipse cx="59.5" cy="133" rx="19.5" ry="17.6" fill="#ea580c" />
      <ellipse cx="100.5" cy="133" rx="19.5" ry="17.6" fill="#ea580c" />
      <ellipse cx="69" cy="133" rx="16" ry="18.8" fill="#f97316" />
      <ellipse cx="91" cy="133" rx="16" ry="18.8" fill="#f97316" />
      <ellipse cx="80" cy="133" rx="13.5" ry="19.4" fill="#fb923c" />
      <ellipse cx="80" cy="114.8" rx="15" ry="4.4" fill="#431407" />
      {/* carved face */}
      <g fill={carve}>
        <path d="M60 131 L66.6 122.6 L71.4 132Z" />
        <path d="M100 131 L93.4 122.6 L88.6 132Z" />
        <path d="M62 137 l4.6 2.4 4.2 -2.8 4.6 3.4 4.6 -3.6 4.6 3.6 4.6 -3.4 4.2 2.8 4.6 -2.4 q-6.6 9.6 -18 9.6 q-11.4 0 -18 -9.6z" />
      </g>
    </g>
  );
}

/** Ramadan: a fanous. This is the back of it; the frame is drawn in front of the flame. */
function FanousBack({ mood }: SkinProps) {
  const lit = mood !== "out";
  return (
    <g>
      <path d="M44.5 44 H115.5 V122 H44.5Z" fill="#5eead4" opacity={lit ? 0.16 : 0.07} />
      <path d="M71.5 122 h17 l-2.6 -4.8 h-11.8z" fill="#a16207" />
      {wick(113, 117.4)}
    </g>
  );
}

/** Eid: an emerald candle with a gold band on a small gold stand. */
function EidCandle({ paint }: SkinProps) {
  return (
    <g>
      <Dish paint={paint} rx={30} />
      <Pillar body="#047857" top="#34d399" pool="#10b981" w={17} />
      {pillarShade("#022c22", 0.3)}
      <path d="M65.5 118 V138" stroke="#a7f3d0" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M63 124.5 A17 4.6 0 0 0 97 124.5 V131.5 A17 4.6 0 0 1 63 131.5Z" fill="#fbbf24" />
      <path d="M70 131.4 l3 -3 3 3.4 -3 3z M80 132.6 l3 -3 3 3 -3 3.2z M89.4 131.2 l2.6 -2.8 2.6 2.4 -2.6 3z" fill="#b45309" />
      {wick(105, 114)}
    </g>
  );
}

/** Kurdish Language Day: a candle on a stack of books. */
function Books({ paint }: SkinProps) {
  return (
    <g>
      {/* bottom book, spine towards us */}
      <rect x="43" y="137" width="74" height="14.5" rx="3" fill="#9f1239" />
      <path d="M52 137 v14.5 M108 137 v14.5" stroke="#fbbf24" strokeWidth="1.6" />
      <text x="80" y="148.6" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fde68a">
        ک
      </text>
      {/* top book, pages towards us */}
      <rect x="49" y="125" width="64" height="12" rx="2.4" fill="#1d4ed8" />
      <rect x="52" y="127.4" width="61" height="7.2" rx="1" fill="#fef3c7" />
      <path d="M52 129.8 h61 M52 132.2 h61" stroke="#e7d7a8" strokeWidth="0.8" />
      {/* a short candle on top */}
      <Pillar
        body={paint("wax")}
        top="var(--dagwick-wax-top)"
        pool="var(--dagwick-wax-pool)"
        edge="var(--dagwick-wax-edge)"
        w={13}
        y={114.5}
        bottom={123.6}
      />
      {wick(105, 114.5)}
    </g>
  );
}

/** Diwali: a clay diya, painted along its rim, with the wick at its spout. */
function Diya() {
  return (
    <g>
      <ellipse cx="80" cy="140" rx="36" ry="5" fill="#000" opacity="0.18" />
      <path d="M46 116 Q80 108 110 114 L127 106 Q122 118 112 123 Q104 140 80 140 Q56 140 49 126 Q44 120 46 116Z" fill="#c2410c" />
      <path d="M49 126 Q56 140 80 140 Q104 140 112 123 Q100 134 80 134 Q60 134 49 126Z" fill="#9a3412" />
      <ellipse cx="79" cy="115.6" rx="31" ry="5.4" fill="#7c2d12" />
      <ellipse cx="79" cy="116.2" rx="26" ry="3.6" fill="#a16207" opacity="0.7" />
      <path d="M56 125.5 Q80 132 106 124.5" fill="none" stroke="#fde68a" strokeWidth="1.8" strokeDasharray="0.1 5.2" strokeLinecap="round" />
      <path d="M62 129.6 l3 -2.6 3 2.6 -3 2.6z M77 131.6 l3 -2.6 3 2.6 -3 2.6z M92 130.4 l3 -2.6 3 2.6 -3 2.6z" fill="#fbbf24" />
      {wick(105, 115)}
    </g>
  );
}

/** The Lantern Festival: a red candle with gold bands. */
function LanternCandle({ paint }: SkinProps) {
  return (
    <g>
      <Dish paint={paint} rx={32} />
      <Pillar body="#b91c1c" top="#f87171" pool="#dc2626" w={17} />
      {pillarShade("#450a0a", 0.35)}
      <path d="M65.5 118 V138" stroke="#fecaca" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M63 121 A17 4.6 0 0 0 97 121 V124 A17 4.6 0 0 1 63 124Z M63 133 A17 4.6 0 0 0 97 133 V136 A17 4.6 0 0 1 63 136Z" fill="#facc15" />
      <path d="M73 127.6 h14 M80 125 v6" stroke="#facc15" strokeWidth="1.4" strokeLinecap="round" />
      {wick(105, 114)}
    </g>
  );
}

/** Çarşema Sor: a white candle with a red band, among painted eggs (drawn in front). */
function EggCandle({ paint }: SkinProps) {
  return (
    <g>
      <Dish paint={paint} rx={38} />
      <Pillar body={paint("wax")} top="var(--dagwick-wax-top)" pool="var(--dagwick-wax-pool)" edge="var(--dagwick-wax-edge)" w={16} />
      <path d="M64 125 A16 4.6 0 0 0 96 125 V130 A16 4.6 0 0 1 64 130Z" fill="#dc2626" />
      {wick(105, 114)}
    </g>
  );
}

const VESSELS: Record<SeasonId, (p: SkinProps) => ReactNode> = {
  christmas: ChristmasCandle,
  "new-year": NewYearCandle,
  birthday: Cupcake,
  newroz: Bonfire,
  halloween: Pumpkin,
  ramadan: FanousBack,
  eid: EidCandle,
  "language-day": Books,
  diwali: Diya,
  "lantern-festival": LanternCandle,
  "carsema-sor": EggCandle,
};

export function Vessel(props: SkinProps) {
  const Draw = props.season ? VESSELS[props.season] : Chamberstick;
  return <g className="dagwick-vessel">{Draw(props)}</g>;
}

/* ------------------------------------------------------------------ */
/* In front of the flame                                               */
/* ------------------------------------------------------------------ */

/** Pine tufts along the front of the Christmas wreath. */
const WREATH = Array.from({ length: 11 }, (_, i) => {
  const a = ((8 + i * 16.4) * Math.PI) / 180;
  return [80 - Math.cos(a) * 41, 143 + Math.sin(a) * 8.4] as const;
});

export function VesselFront({ season, mood, paint }: SkinProps) {
  const lit = mood !== "out";
  switch (season) {
    case "christmas":
      return (
        <g className="dagwick-vessel">
          {WREATH.map(([x, y], i) => (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="6.4" fill={i % 2 ? "#15803d" : "#166534"} />
          ))}
          {WREATH.map(([x, y], i) => (
            <path
              key={i}
              d={`M${(x - 3).toFixed(1)} ${(y - 1.6).toFixed(1)} q3 -3.4 6 0`}
              fill="none"
              stroke="#4ade80"
              strokeOpacity="0.55"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          ))}
          <g fill="#ef4444">
            <circle cx="54" cy="149" r="2.6" />
            <circle cx="59.4" cy="151.6" r="2.2" />
            <circle cx="104" cy="149.6" r="2.6" />
            <circle cx="109.4" cy="146.8" r="2.2" />
          </g>
          {/* bow */}
          <path d="M80 151 C74 144.6 66.5 145.4 67 151 C66.5 156.6 74 157.4 80 151Z M80 151 C86 144.6 93.5 145.4 93 151 C93.5 156.6 86 157.4 80 151Z" fill="#ef4444" />
          <circle cx="80" cy="151" r="2.9" fill="#b91c1c" />
        </g>
      );
    case "newroz":
      return (
        <g className="dagwick-vessel">
          {lit && (
            <g className="dagwick-licks" fill={paint("flame")}>
              <path d="M58 131 C52 123 55 114 60 108 C60 115 66 118 66 125 C66 131 61 134 58 131Z" />
              <path d="M102 131 C108 124 106 116 101 111 C101 117 95 119 95 125 C95 131 99 134 102 131Z" />
            </g>
          )}
        </g>
      );
    case "halloween":
      return (
        <g className="dagwick-vessel">
          <path d="M65 114.8 A15 4.4 0 0 0 95 114.8 L95 118.6 Q80 123 65 118.6Z" fill="#fb923c" />
          <path d="M65 114.8 A15 4.4 0 0 0 95 114.8" fill="none" stroke="#c2410c" strokeWidth="1.2" />
          <g className="dagwick-spider">
            <path
              d="M106.4 121.6 l-4.4 -3.4 M106 124.4 l-5.2 -0.6 M106.6 127 l-4.2 2.6 M113.6 121.6 l4.4 -3.4 M114 124.4 l5.2 -0.6 M113.4 127 l4.2 2.6"
              stroke="#1a1024"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <ellipse cx="110" cy="124.4" rx="4.4" ry="4" fill="#1a1024" />
            <circle cx="108.5" cy="123.4" r="0.9" fill="#bef264" />
            <circle cx="111.5" cy="123.4" r="0.9" fill="#bef264" />
          </g>
        </g>
      );
    case "ramadan":
      return (
        <g className="dagwick-vessel">
          {/* posts */}
          <path d="M44.5 43 V123 M115.5 43 V123" stroke="#eab308" strokeWidth="2.6" />
          <path d="M44.5 57 Q44.5 46.6 56 46.6 M115.5 57 Q115.5 46.6 104 46.6" fill="none" stroke="#eab308" strokeWidth="1.6" />
          {/* dome */}
          <path d="M46.5 39 C46.5 29.5 67 30 77 24.5 Q80 22.6 83 24.5 C93 30 113.5 29.5 113.5 39Z" fill="#0f766e" />
          <path d="M80 24 V39 M64.5 31 Q62.6 35 63 39 M95.5 31 Q97.4 35 97 39" fill="none" stroke="#fbbf24" strokeWidth="1.3" />
          <rect x="40.5" y="38" width="79" height="6.4" rx="2.4" fill="#eab308" />
          <path d="M80 24 V20.4" stroke="#eab308" strokeWidth="1.8" />
          <path d="M82 11.4 a4.7 4.7 0 1 0 3.7 7.7 a3.7 3.7 0 1 1 -3.7 -7.7z" fill="var(--dagwick-moon)" />
          {/* base */}
          <rect x="40.5" y="121.6" width="79" height="6.4" rx="2.4" fill="#eab308" />
          <path d="M44 128 H116 L109.5 143 H50.5Z" fill="#0f766e" />
          <path d="M80 130.6 l4.4 4.9 -4.4 4.9 -4.4 -4.9z M62 132.4 l2.8 3.1 -2.8 3.1 -2.8 -3.1z M98 132.4 l2.8 3.1 -2.8 3.1 -2.8 -3.1z" fill="#fbbf24" />
          <rect x="47" y="142.4" width="66" height="6" rx="2.4" fill="#ca8a04" />
        </g>
      );
    case "eid":
      // A plate of kulîçe (klicha), the Kurdish date-filled cookies baked for Eid.
      return (
        <g className="dagwick-vessel">
          <ellipse cx="129" cy="148" rx="19" ry="4" fill="#e5e7eb" />
          <ellipse cx="129" cy="147.4" rx="14" ry="2.4" fill="#cbd5e1" opacity="0.6" />
          {[
            [119, 142],
            [131, 140],
            [140, 144],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="6.5" fill="#c98b4a" stroke="#8a5a2b" strokeWidth="1" />
              <path d={`M${x - 3.5} ${y} a3.5 3.5 0 1 1 7 0`} fill="none" stroke="#8a5a2b" strokeWidth="1" />
              <circle cx={x} cy={y} r="1.2" fill="#8a5a2b" />
            </g>
          ))}
        </g>
      );
    case "diwali":
      // Marigolds heaped at the foot of the diya.
      return (
        <g className="dagwick-vessel">
          {[
            [44, 138, "#f59e0b"],
            [52, 142, "#ea580c"],
            [108, 142, "#f59e0b"],
            [117, 138, "#ea580c"],
          ].map(([x, y, c], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="5.6" fill={c as string} />
              <circle cx={x} cy={y} r="2.6" fill="#fde68a" opacity="0.6" />
            </g>
          ))}
        </g>
      );
    case "lantern-festival":
      // A small round lantern standing beside the candle.
      return (
        <g className="dagwick-vessel">
          <path d="M129 112 V118" stroke="#facc15" strokeWidth="1.2" />
          <rect x="124.5" y="117" width="9" height="3" rx="1" fill="#facc15" />
          <ellipse cx="129" cy="130" rx="13" ry="11.5" fill="#dc2626" />
          {lit && <ellipse cx="129" cy="130" rx="7" ry="7" fill="#fde68a" opacity="0.35" />}
          <path d="M129 118.6 Q120 130 129 141.4 M129 118.6 Q138 130 129 141.4" fill="none" stroke="#7f1d1d" strokeWidth="0.9" />
          <rect x="124.5" y="140" width="9" height="3" rx="1" fill="#facc15" />
          <path d="M127 143 V150 M129 143 V151 M131 143 V150" stroke="#facc15" strokeWidth="1" />
        </g>
      );
    case "carsema-sor":
      // Painted eggs around the candle.
      return (
        <g className="dagwick-vessel">
          {(
            [
              [50, 140, "#dc2626", -14],
              [61, 146, "#facc15", 8],
              [99, 146, "#16a34a", -8],
              [110, 140, "#2563eb", 14],
            ] as const
          ).map(([x, y, c, a], i) => (
            <g key={i} transform={`rotate(${a} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="6.2" ry="8" fill={c} />
              <path d={`M${x - 5.8} ${y - 1} q2.9 -3 5.8 0 t5.8 0`} fill="none" stroke="#fef3c7" strokeWidth="1.2" />
              <circle cx={x} cy={y + 4} r="1.1" fill="#fef3c7" />
            </g>
          ))}
        </g>
      );
    case "language-day":
      // An inkwell and a quill.
      return (
        <g className="dagwick-vessel">
          <path d="M139 99 C128 106 122 120 123.5 135 C132 127 140 114 139 99Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M138 102 L123 140" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M131 109 l-5.4 2.4 M133.6 115 l-7.6 3.6 M131 122.6 l-6 3" stroke="#cbd5e1" strokeWidth="0.9" />
          <path d="M114.5 139.5 h16 l-1.8 11.5 h-12.4z" fill="#1e293b" />
          <ellipse cx="122.5" cy="139.5" rx="8" ry="2.2" fill="#334155" />
          <ellipse cx="122.5" cy="139.6" rx="5.4" ry="1.3" fill="#1e3a8a" />
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Behind everything                                                   */
/* ------------------------------------------------------------------ */

export function Backdrop({ season }: SkinProps) {
  if (season === "eid") {
    return (
      <g fill="var(--dagwick-moon)">
        <path d="M131 6 a15 15 0 1 0 13 24 a12 12 0 1 1 -13 -24z" />
        <path d="M150 42 l1.5 4 4.3 .2 -3.4 2.6 1.2 4.2 -3.6 -2.4 -3.6 2.4 1.2 -4.2 -3.4 -2.6 4.3 -.2z" />
      </g>
    );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Outfits                                                             */
/* ------------------------------------------------------------------ */

/** Where a hat sits: the centre of its band, for each flame shape. */
const CROWN: Record<Mood, string> = {
  radiant: "translate(84 42) rotate(12)",
  happy: "translate(84 49) rotate(11)",
  calm: "translate(83.5 57.5) rotate(9)",
  worried: "translate(84 63.5) rotate(11) scale(.94)",
  out: "translate(80 58.5) rotate(-5) scale(.94)",
};

/** Eye line of the face, for things worn on it. */
const EYES: Record<Mood, [number, number, number]> = {
  radiant: [69, 91, 77],
  happy: [69, 91, 78],
  calm: [69, 91, 79],
  worried: [69, 91, 80],
  out: [72.2, 87.8, 72.5],
};

function Flower({ x, y, petal, centre, r = 3 }: { x: number; y: number; petal: string; centre: string; r?: number }) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * 72 - 90) * (Math.PI / 180);
        return (
          <circle key={i} cx={(x + Math.cos(a) * r * 1.15).toFixed(2)} cy={(y + Math.sin(a) * r * 1.15).toFixed(2)} r={r} fill={petal} />
        );
      })}
      <circle cx={x} cy={y} r={r * 0.75} fill={centre} />
    </g>
  );
}

function PartyHat({ cone, pom }: { cone: string; pom: string }) {
  return (
    <>
      <path d="M-14 1 L14 1 L2 -37Z" fill={cone} />
      <path d="M-9.8 -9 L10.4 -9 M-5.6 -19 L7.2 -19 M-1.6 -28.4 L4.4 -28.4" stroke="#fde047" strokeWidth="3.2" />
      <ellipse cx="0" cy="1" rx="14.5" ry="2.8" fill="#fde047" />
      <circle cx="2" cy="-38" r="4.8" fill={pom} />
    </>
  );
}

/**
 * Things Wick wears. "head" pieces sit on the crown of the flame (or of the
 * smoke); "face" pieces sit on the face and move down with it.
 */
export function Costume({ season, mood, part }: { season?: SeasonId; mood: Mood; part: "head" | "face" }) {
  if (part === "face") {
    if (season !== "language-day") return null;
    const [l, r, y] = EYES[mood];
    return (
      <g className="dagwick-acc" fill="#fff" fillOpacity="0.2" stroke="#92400e" strokeWidth="1.8">
        <circle cx={l} cy={y} r="8" />
        <circle cx={r} cy={y} r="8" />
        <path d={`M${l + 7.6} ${y - 2} Q${(l + r) / 2} ${y - 5} ${r - 7.6} ${y - 2}`} fill="none" />
      </g>
    );
  }
  const hat = (() => {
    switch (season) {
      case "christmas":
        return (
          <>
            <path d="M-15 -1 C-14 -22 0 -35 15 -31 C24 -28.5 30 -20 31.5 -9 C26 -18 18.5 -16 15 -1Z" fill="#dc2626" />
            <path d="M15 -1 C18.5 -16 26 -18 31.5 -9 C25 -13 20 -9 15 -1Z" fill="#991b1b" opacity="0.55" />
            <circle cx="32" cy="-6.6" r="5.8" fill="#fff" />
            <rect x="-18.5" y="-6.4" width="37" height="10.4" rx="5.2" fill="#fff" />
          </>
        );
      case "new-year":
        return <PartyHat cone="#7c3aed" pom="#f472b6" />;
      case "birthday":
        return <PartyHat cone="#ec4899" pom="#60a5fa" />;
      case "halloween":
        return (
          <>
            <ellipse cx="0" cy="1.5" rx="25.5" ry="6.4" fill="#2e1065" />
            <path d="M-13.5 0 C-11 -16 -5 -28 7 -40 C6 -33 9 -30 15.5 -31 C10 -23 12 -12 13.5 0Z" fill="#4c1d95" />
            <path d="M-12.6 -4.4 C-12 -7 -11.4 -9 -10.6 -11.4 L11.8 -11.4 C12.2 -9 12.6 -7 13 -4.4Z" fill="#f97316" />
            <rect x="-4.4" y="-12.2" width="8.8" height="8.6" rx="1.3" fill="none" stroke="#fde047" strokeWidth="1.9" />
          </>
        );
      case "carsema-sor":
        // A crown of red spring flowers.
        return (
          <>
            <path d="M-17 2 Q0 -7 17 2" fill="none" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
            <Flower x={-13} y={0} petal="#dc2626" centre="#1c1917" />
            <Flower x={13} y={0} petal="#ef4444" centre="#1c1917" />
            <Flower x={0} y={-4.6} petal="#b91c1c" centre="#1c1917" r={3.5} />
          </>
        );
      case "newroz":
        return (
          <>
            <path d="M-18 2 Q0 -8 18 2" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M-9 -3 q-2 -5 -6 -4 q1 4 6 4z M9 -3 q2 -5 6 -4 q-1 4 -6 4z" fill="#22c55e" />
            <Flower x={-14} y={0.5} petal="#f9a8d4" centre="#fde047" />
            <Flower x={14} y={0.5} petal="#c4b5fd" centre="#fde047" />
            <Flower x={0} y={-4.6} petal="#ffffff" centre="#f59e0b" r={3.5} />
          </>
        );
      default:
        return null;
    }
  })();
  return hat ? (
    <g className="dagwick-acc" transform={CROWN[mood]}>
      {hat}
    </g>
  ) : null;
}
