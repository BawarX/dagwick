import { fetchHistory, useLoad } from "./api";
import type { HistoryPoint, ScoreHistory as History } from "./types";

const MAX_CHANGES = 5;

export function shortDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function changeList(versions: HistoryPoint[]): { point: HistoryPoint; from: number }[] {
  const out = [];
  for (let i = versions.length - 1; i > 0 && out.length < MAX_CHANGES; i--) {
    const point = versions[i];
    if (point.better.length || point.worse.length) out.push({ point, from: versions[i - 1].score });
  }
  return out;
}

export function ScoreHistory({ dagId }: { dagId: string }) {
  const { data } = useLoad((s) => fetchHistory(dagId, s), [dagId]);
  if (!data) return null;
  return <HistoryPanel history={data} />;
}

export function HistoryPanel({ history }: { history: History }) {
  const v = history.versions;
  return (
    <section className="dagwick-section" aria-label="Score history">
      <div className="dagwick-section-head">
        <span className="dagwick-side-title">Score history</span>
        <span className="dagwick-muted">
          {history.truncated ? `last ${v.length} versions` : `${v.length} version${v.length === 1 ? "" : "s"}`} · code
          checks only
        </span>
      </div>
      {v.length < 2 ? (
        <p className="dagwick-muted dagwick-section-empty">
          Only one version so far. Each time the DAG&apos;s code changes, its new score appears here.
        </p>
      ) : (
        <div className="dagwick-history">
          <Sparkline versions={v} />
          <ul className="dagwick-changes">
            {changeList(v).map(({ point, from }) => (
              <li key={point.version}>
                <span className="dagwick-change-head">
                  <strong>v{point.version}</strong>
                  <span className="dagwick-muted">{shortDate(point.created_at)}</span>
                  <span className={point.score >= from ? "dagwick-up" : "dagwick-down"}>
                    {Math.round(from)} → {Math.round(point.score)}
                  </span>
                </span>
                {point.better.length > 0 && <span className="dagwick-up">Now passing: {point.better.join(", ")}</span>}
                {point.worse.length > 0 && <span className="dagwick-down">Now failing: {point.worse.join(", ")}</span>}
              </li>
            ))}
            {changeList(v).length === 0 && (
              <li className="dagwick-muted">The code changed, but no check result did.</li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}

function Sparkline({ versions }: { versions: HistoryPoint[] }) {
  const w = 300;
  const h = 64;
  const pad = 6;
  const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(versions.length - 1, 1);
  const y = (score: number) => h - pad - (score / 100) * (h - 2 * pad);
  const points = versions.map((p, i) => `${x(i)},${y(p.score)}`).join(" ");
  return (
    <svg className="dagwick-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img"
      aria-label={`Score by version, from ${Math.round(versions[0].score)} to ${Math.round(versions[versions.length - 1].score)}`}>
      <polyline points={points} fill="none" stroke="var(--dagwick-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {versions.map((p, i) => (
        <circle key={p.version} cx={x(i)} cy={y(p.score)} r="3" className={`dagwick-spark-dot dagwick-spark-dot--${p.grade}`}>
          <title>{`v${p.version}: ${p.grade} ${Math.round(p.score)}`}</title>
        </circle>
      ))}
    </svg>
  );
}
