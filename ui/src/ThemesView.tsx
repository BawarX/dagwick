import { useRef, useState } from "react";

import { fetchThemeSheets, fetchThemes, useLoad } from "./api";
import { Empty, Loading } from "./components";
import {
  type Choice,
  type ThemeInfo,
  type ThemeStatus,
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
  // What Airflow drew when this page loaded; a change is applied on top of it.
  const loaded = useRef(pickTheme(themes, readChoice(document.cookie)));
  const [busy, setBusy] = useState<string>();
  const [problem, setProblem] = useState<string>();

  const change = async (next: Choice, label: string) => {
    setBusy(label);
    setProblem(undefined);
    try {
      const want = pickTheme(themes, next);
      const from = loaded.current;
      let css = "";
      if (want && want !== from) css = (await fetchThemeSheets(want)).css;
      else if (!want && from) css = (await fetchThemeSheets(from)).hide;
      for (const c of choiceCookies(next)) document.cookie = c;
      setLiveCss(css);
      setChoice(next);
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
              <SnowScene />
              <div className="dagwick-theme-body">
                <div className="dagwick-theme-title">
                  <h3>{t.name}</h3>
                  <span className={`dagwick-theme-status is-${s.tone}`}>{s.label}</span>
                </div>
                <p className="dagwick-theme-dates">{dateRange(t.start, t.end)} · every year</p>
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

/** A small still picture of the snow theme, for its card. */
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
