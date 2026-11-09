import { fetchHealth, useLoad } from "./api";
import type { RunHealth as Health } from "./types";

export function duration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function ago(iso: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

export function trendText(pct: number | null): string | undefined {
  if (pct === null || Math.abs(pct) < 10) return pct === null ? undefined : "steady";
  return pct > 0 ? `${pct}% slower than before` : `${-pct}% faster than before`;
}

export function RunHealth({ dagId }: { dagId: string }) {
  const { data, error } = useLoad((s) => fetchHealth(dagId, s), [dagId]);
  if (error) return null;
  if (!data) return null;
  return <HealthPanel health={data} />;
}

export function HealthPanel({ health, now }: { health: Health; now?: number }) {
  const h = health;
  return (
    <section className="dagwick-health" aria-label="Run health">
      <div className="dagwick-health-head">
        <span className="dagwick-side-title">Run health</span>
        <span className="dagwick-muted">last {h.window_days} days · not part of the score</span>
      </div>
      {h.runs === 0 ? (
        <p className="dagwick-muted dagwick-health-empty">No finished runs in the last {h.window_days} days.</p>
      ) : (
        <div className="dagwick-cats">
          <Tile
            label="Runs succeeded"
            value={`${h.success_rate}%`}
            sub={`${h.succeeded} of ${h.runs}${h.truncated ? "+" : ""} runs`}
            tone={h.success_rate !== null && h.success_rate < 90 ? "fail" : "pass"}
          />
          <Tile
            label="Tasks retried"
            value={h.retry_rate === null ? "–" : `${h.retry_rate}%`}
            sub={`${h.tasks_retried} of ${h.tasks_finished} tasks`}
            tone={h.retry_rate !== null && h.retry_rate >= 10 ? "warn" : undefined}
          />
          <Tile
            label="Typical run"
            value={h.median_seconds === null ? "–" : duration(h.median_seconds)}
            sub={trendText(h.duration_trend_pct) ?? "not enough runs for a trend"}
            tone={h.duration_trend_pct !== null && h.duration_trend_pct >= 25 ? "warn" : undefined}
          />
          <Tile
            label="Last run"
            value={h.last_state ? h.last_state[0].toUpperCase() + h.last_state.slice(1) : "–"}
            sub={h.last_end ? ago(h.last_end, now) : ""}
            tone={h.last_state === "failed" ? "fail" : h.last_state === "success" ? "pass" : undefined}
          />
        </div>
      )}
    </section>
  );
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "pass" | "warn" | "fail" }) {
  return (
    <div className={`dagwick-cat dagwick-htile${tone ? ` dagwick-htile--${tone}` : ""}`}>
      <div className="dagwick-cat-head">
        <span>{label}</span>
      </div>
      <div className="dagwick-htile-value">{value}</div>
      <div className="dagwick-muted dagwick-htile-sub">{sub}</div>
    </div>
  );
}
