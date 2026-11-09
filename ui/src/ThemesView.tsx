import { useState } from "react";

import { fetchThemes, useLoad } from "./api";
import { Empty, Loading } from "./components";
import {
  type ThemeInfo,
  type ThemeStatus,
  PREVIEW_COOKIE,
  dateRange,
  offCookie,
  offList,
  previewCookie,
  readCookies,
  themeStatus,
  withOff,
} from "./themes";

const STATUS: Record<ThemeStatus, { label: string; tone: string }> = {
  showing: { label: "Showing now", tone: "on" },
  preview: { label: "Previewing", tone: "on" },
  off: { label: "Off for you", tone: "off" },
  waiting: { label: "Not in season", tone: "idle" },
};

/** Airflow reads its theme once per page load, so a change shows after a reload. */
function save(cookie: string) {
  document.cookie = cookie;
  window.location.reload();
}

export function ThemesView() {
  const { data, error, reload } = useLoad((s) => fetchThemes(s), []);
  const [cookies] = useState(() => document.cookie);
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
  const off = offList(cookies);
  const preview = readCookies(cookies)[PREVIEW_COOKIE] || undefined;
  return (
    <section className="dagwick-themes">
      <header className="dagwick-themes-head">
        <h2>Seasonal themes</h2>
        <p className="dagwick-muted">
          On their dates, themes decorate all of Airflow, not only Dagwick, and
          switch off by themselves afterwards. Your choices are saved in this
          browser and only change what you see.
        </p>
      </header>
      <div className="dagwick-theme-list">
        {data.map((t) => (
          <ThemeCard
            key={t.id}
            theme={t}
            status={themeStatus(t, off, preview)}
            off={off}
          />
        ))}
      </div>
    </section>
  );
}

function ThemeCard({
  theme,
  status,
  off,
}: {
  theme: ThemeInfo;
  status: ThemeStatus;
  off: string[];
}) {
  const isOff = off.includes(theme.id);
  const s = STATUS[status];
  return (
    <article className="dagwick-theme">
      <SnowScene />
      <div className="dagwick-theme-body">
        <div className="dagwick-theme-title">
          <h3>{theme.name}</h3>
          <span className={`dagwick-theme-status is-${s.tone}`}>{s.label}</span>
        </div>
        <p className="dagwick-theme-dates">
          {dateRange(theme.start, theme.end)} · every year
        </p>
        <p className="dagwick-muted">{theme.description}</p>
        <div className="dagwick-theme-actions">
          <label className="dagwick-switch">
            <input
              type="checkbox"
              role="switch"
              checked={!isOff}
              onChange={(e) =>
                save(offCookie(withOff(off, theme.id, !e.target.checked)))
              }
            />
            <span aria-hidden="true" />
            Show on its dates
          </label>
          {status === "preview" ? (
            <button
              className="dagwick-btn"
              onClick={() => save(previewCookie())}
            >
              Stop preview
            </button>
          ) : (
            <button
              className="dagwick-btn"
              onClick={() => save(previewCookie(theme.id))}
            >
              Preview now
            </button>
          )}
        </div>
      </div>
    </article>
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
    <svg
      className="dagwick-theme-scene"
      viewBox="0 0 220 110"
      role="img"
      aria-label="Snow falling over Airflow"
    >
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
      <path
        d="M0 96 C30 86 60 88 90 94 S150 102 180 92 S210 86 220 90 V110 H0Z"
        fill="#eef4fa"
      />
    </svg>
  );
}
