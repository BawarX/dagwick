import { useRef, useState } from "react";

import { fetchThemeSheets, fetchThemes, useLoad } from "./api";
import { Empty, Loading } from "./components";
import { SEASONS, isSeasonId } from "./season";
import { writeHidden } from "./useSeason";
import {
  type Choice,
  type ThemeInfo,
  type ThemeStatus,
  COOKIES_AT_LOAD,
  applyTheme,
  choiceCookies,
  dateRange,
  pickTheme,
  readChoice,
  removeTheme,
  setAuto,
  themeStatus,
} from "./themes";

const STATUS: Record<ThemeStatus, { label: string; tone: string }> = {
  applied: { label: "Applied", tone: "on" },
  showing: { label: "Showing now", tone: "on" },
  removed: { label: "Removed", tone: "off" },
  waiting: { label: "Not in season", tone: "idle" },
};

const LIVE_ID = "dagwick-live-theme";

/**
 * Airflow draws the theme it was given when the page loaded. To change it without a
 * reload, Dagwick adds a stylesheet: the new theme, or one that hides the loaded theme.
 */
function setLiveCss(css: string) {
  let el = document.getElementById(LIVE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = LIVE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

export function ThemesView() {
  const { data, error, reload } = useLoad((s) => fetchThemes(s), []);
  if (error)
    return (
      <Empty
        title="Couldn't load the themes"
        body={error}
        action={
          <button className="dagwick-btn" onClick={reload}>
            Try again
          </button>
        }
      />
    );
  if (!data) return <Loading label="Loading themes…" />;
  return <Themes themes={data} />;
}

function Themes({ themes }: { themes: ThemeInfo[] }) {
  const [choice, setChoice] = useState<Choice>(() => readChoice(document.cookie));
  // What Airflow drew when this page loaded; every change is applied on top of that.
  const loaded = useRef(pickTheme(themes, readChoice(COOKIES_AT_LOAD)));
  const [busy, setBusy] = useState<string>();
  const [problem, setProblem] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const change = async (next: Choice, label: string) => {
    setBusy(label);
    setProblem(undefined);
    setNotice(undefined);
    try {
      const want = pickTheme(themes, next);
      const from = loaded.current;
      let css = "";
      if (want && want !== from) {
        const [drawn, old] = await Promise.all([fetchThemeSheets(want), from ? fetchThemeSheets(from) : undefined]);
        css = (old?.reset ?? "") + drawn.css;
      } else if (!want && from) css = (await fetchThemeSheets(from)).hide;
      for (const c of choiceCookies(next)) document.cookie = c;
      setLiveCss(css);
      setChoice(next);
      // A theme shows everywhere at once: Airflow and Dagwick's banner (even if the
      // viewer once hid the banner's seasonal look).
      const shown = themes.find((t) => t.id === want);
      if (shown) writeHidden(false);
      setNotice(
        !shown
          ? "No theme is showing now."
          : shown.decorated === false
            ? `${shown.name} is on: open the Fleet tab to see Dagwick's banner.`
            : `${shown.name} is on, across Airflow and on Dagwick's banner.`,
      );
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Couldn't change the theme");
    } finally {
      setBusy(undefined);
    }
  };

  return (
    <section className="dagwick-themes">
      <header className="dagwick-themes-head">
        <h2>Seasonal themes</h2>
        <p className="dagwick-muted">
          Themes decorate all of Airflow, not only Dagwick. Your choices are saved in this browser and only change what
          you see.
        </p>
      </header>

      <div className="dagwick-theme-settings">
        <label className="dagwick-switch">
          <input
            type="checkbox"
            role="switch"
            checked={choice.auto}
            disabled={!!busy}
            onChange={(e) => change(setAuto(choice, e.target.checked), "auto")}
          />
          <span className="dagwick-switch-track" aria-hidden="true" />
          <span className="dagwick-switch-text">
            <strong>Show themes on their dates</strong>
            <small className="dagwick-muted">
              {choice.auto
                ? "Each theme appears by itself on its dates and goes away afterwards."
                : "No theme appears by itself. Apply one below whenever you like."}
            </small>
          </span>
        </label>
      </div>

      <p className="dagwick-theme-notice" role="status" aria-live="polite">
        {notice}
      </p>

      {problem && (
        <p className="dagwick-theme-problem" role="alert">
          {problem}
        </p>
      )}

      <div className="dagwick-theme-list">
        {themes.map((t) => {
          const status = themeStatus(t, themes, choice);
          const on = status === "applied" || status === "showing";
          const s = STATUS[status];
          return (
            <article key={t.id} className={`dagwick-theme${on ? " is-on" : ""}`}>
              <Scene id={t.id} />
              <div className="dagwick-theme-body">
                <div className="dagwick-theme-title">
                  <h3>{t.name}</h3>
                  <span className={`dagwick-theme-status is-${s.tone}`}>{s.label}</span>
                  {t.decorated === false && <span className="dagwick-theme-tag">Banner only</span>}
                </div>
                <p className="dagwick-theme-dates">{t.when ?? `${dateRange(t.start, t.end)} · every year`}</p>
                <p className="dagwick-muted">{t.description}</p>
                <div className="dagwick-theme-actions">
                  {on ? (
                    <button
                      className="dagwick-btn"
                      disabled={!!busy}
                      onClick={() => change(removeTheme(themes, choice, t.id), t.id)}
                    >
                      {busy === t.id ? "Removing…" : "Remove theme"}
                    </button>
                  ) : (
                    <button
                      className="dagwick-btn dagwick-btn-primary"
                      disabled={!!busy}
                      onClick={() => change(applyTheme(choice, t.id), t.id)}
                    >
                      {busy === t.id ? "Applying…" : "Apply theme"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/** A small still picture of a theme, for its card. */
function Scene({ id }: { id: string }) {
  if (id === "halloween") return <HalloweenScene />;
  if (id === "christmas") return <SnowScene />;
  return <BannerScene id={id} />;
}

/** Colours for the themes that so far only change the banner. */
const BANNER_SCENES: Record<string, [string, string]> = {
  newroz: ["#14532d", "#b91c1c"],
  eid: ["#3b2a07", "#a16207"],
  ramadan: ["#0b2a3a", "#134e4a"],
  "language-day": ["#422006", "#b45309"],
  "new-year": ["#1e1b4b", "#6d28d9"],
  birthday: ["#500724", "#be185d"],
  diwali: ["#431407", "#c2410c"],
  "lantern-festival": ["#450a0a", "#b91c1c"],
  "carsema-sor": ["#14532d", "#dc2626"],
};

/** A simple picture for a banner-only theme: its colours and its sign. */
function BannerScene({ id }: { id: string }) {
  const [from, to] = BANNER_SCENES[id] ?? ["#1f2937", "#374151"];
  const season = isSeasonId(id) ? SEASONS[id] : undefined;
  return (
    <svg className="dagwick-theme-scene" viewBox="0 0 220 110" role="img" aria-label={season?.name ?? id}>
      <defs>
        <linearGradient id={`dagwick-bs-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="220" height="110" fill={`url(#dagwick-bs-${id})`} />
      <text x="110" y="70" textAnchor="middle" fontSize="44">
        {season?.icon ?? "✨"}
      </text>
    </svg>
  );
}

function HalloweenScene() {
  const bats: [number, number, number, number][] = [
    [70, 26, 0.55, -10],
    [128, 18, 0.4, 8],
    [176, 40, 0.7, -4],
    [40, 52, 0.35, 12],
  ];
  const embers: [number, number, number][] = [
    [30, 88, 1.6],
    [96, 70, 1.2],
    [150, 84, 1.8],
    [196, 64, 1.1],
    [118, 94, 1.3],
  ];
  return (
    <svg className="dagwick-theme-scene" viewBox="0 0 220 110" role="img" aria-label="Bats over a foggy night">
      <defs>
        <radialGradient id="dagwick-hw-moon">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="dagwick-hw-ember">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset=".4" stopColor="#fb923c" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="220" height="110" fill="#1d1430" />
      <circle cx="176" cy="30" r="26" fill="#f59e0b" opacity=".12" />
      <circle cx="176" cy="30" r="15" fill="url(#dagwick-hw-moon)" />
      {bats.map(([x, y, s, r], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
          fill="#0d0714"
          d="M0 -2 C2 -6 6 -6 8 -3 C10 -6 14 -7 18 -4 C15 -3 14 0 15 3 C12 1 9 2 8 4 C6 2 3 2 0 5 C-3 2 -6 2 -8 4 C-9 2 -12 1 -15 3 C-14 0 -15 -3 -18 -4 C-14 -7 -10 -6 -8 -3 C-6 -6 -2 -6 0 -2Z"
        />
      ))}
      {embers.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r * 2.4} fill="url(#dagwick-hw-ember)" />
      ))}
      <ellipse cx="60" cy="104" rx="90" ry="14" fill="#7c3aed" opacity=".35" />
      <ellipse cx="170" cy="106" rx="80" ry="12" fill="#4c1d95" opacity=".45" />
    </svg>
  );
}

/** The snow theme's picture. */
function SnowScene() {
  const flakes: [number, number, number][] = [
    [26, 22, 7],
    [70, 46, 5],
    [112, 18, 9],
    [150, 52, 6],
    [190, 26, 7],
    [48, 64, 4],
    [132, 74, 4],
  ];
  return (
    <svg className="dagwick-theme-scene" viewBox="0 0 220 110" role="img" aria-label="Snow falling over Airflow">
      <rect width="220" height="110" fill="#1b2433" />
      {flakes.map(([x, y, r], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y}) rotate(${i * 13})`}
          stroke="#fff"
          strokeWidth={r / 6}
          strokeLinecap="round"
          fill="none"
          opacity={0.45 + (i % 3) * 0.15}
        >
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path
              key={a}
              transform={`rotate(${a})`}
              d={`M0 0 V${-r} M0 ${-r * 0.45} l${-r * 0.22} ${-r * 0.2} M0 ${-r * 0.45} l${r * 0.22} ${-r * 0.2}`}
            />
          ))}
        </g>
      ))}
      <path d="M0 96 C30 86 60 88 90 94 S150 102 180 92 S210 86 220 90 V110 H0Z" fill="#eef4fa" />
    </svg>
  );
}
