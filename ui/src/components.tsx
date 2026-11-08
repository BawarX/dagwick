import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";

import { BRAND, DAG_TAB_ROUTE } from "./brand";
import { Lamp, moodFor } from "./Lamp";
import type { Grade } from "./types";

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** Animate a number from its previous value to `target`. */
export function useCountUp(target: number, ms = 900) {
  const [value, setValue] = useState(reducedMotion() ? target : 0);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion()) return setValue(target);
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setValue(origin + (target - origin) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    // rAF pauses in background tabs; make sure we always land on the real number.
    const done = setTimeout(() => {
      cancelAnimationFrame(raf);
      from.current = target;
      setValue(target);
    }, ms + 100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [target, ms]);
  return value;
}

export function ScoreRing({ score, grade }: { score: number; grade: Grade }) {
  const shown = useCountUp(score);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className={`dagwick-ring dagwick-grade-${grade}`} aria-label={`Score ${score} out of 100, grade ${grade}`}>
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={r} className="dagwick-ring-track" />
        <circle
          cx="66"
          cy="66"
          r={r}
          className="dagwick-ring-fill"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          transform="rotate(-90 66 66)"
        />
      </svg>
      <div className="dagwick-ring-label">
        <span className="dagwick-grade">{grade}</span>
        {/* floor, not round: 74.5 is a C and must not read "75" */}
        <span className="dagwick-score">{Math.floor(shown)}</span>
      </div>
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked; the code is still selectable */
    }
  };
  return (
    <div className="dagwick-code">
      <pre>
        <code>{code}</code>
      </pre>
      <button className="dagwick-copy" onClick={copy} aria-label="Copy code">
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}

const LAMP_SAYS: Record<Grade, string> = {
  A: "I'm glowing! ✨",
  B: "Nice and warm.",
  C: "A little more oil?",
  D: "I'm flickering…",
  F: "It's dark in here.",
};

export function Mascot({ grade, size = 150 }: { grade: Grade; size?: number }) {
  return (
    <div className="dagwick-mascot">
      <div className="dagwick-bubble">{LAMP_SAYS[grade]}</div>
      <Lamp mood={moodFor(grade)} size={size} />
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="dagwick-empty">
      <Lamp mood="out" size={110} />
      <h3>{title}</h3>
      <p className="dagwick-muted">{body}</p>
      {action}
    </div>
  );
}

export function Loading({ label = "Lighting the lamp…" }: { label?: string }) {
  return (
    <div className="dagwick-empty">
      <Lamp mood="calm" size={110} />
      <p className="dagwick-muted">{label}</p>
    </div>
  );
}

export function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" | "lg" }) {
  return <span className={`dagwick-badge dagwick-badge--${grade} dagwick-badge--${size}`}>{grade}</span>;
}

/** Small score ring used in lists. */
export function MiniRing({ score, grade }: { score: number; grade: Grade }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <div className={`dagwick-mini dagwick-grade-${grade}`} aria-label={`Score ${score}, grade ${grade}`}>
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} className="dagwick-ring-track" />
        <circle
          cx="23"
          cy="23"
          r={r}
          className="dagwick-ring-fill"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          transform="rotate(-90 23 23)"
        />
      </svg>
      <span>{Math.floor(score)}</span>
    </div>
  );
}

type LinkComponent = ComponentType<{ to: string; className?: string; children: ReactNode }>;

/** In-app link using Airflow's router when available (no full page reload). */
export function DagLink({ dagId, children, className }: { dagId: string; children: ReactNode; className?: string }) {
  const Link = (globalThis as { ReactRouterDOM?: { Link?: LinkComponent } }).ReactRouterDOM?.Link;
  const to = `/dags/${encodeURIComponent(dagId)}/plugin/${DAG_TAB_ROUTE}`;
  if (Link)
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  return (
    <a href={new URL(to.slice(1), document.baseURI).href} className={className}>
      {children}
    </a>
  );
}

export const brandEyebrow = (section: string) => (
  <div className="dagwick-eyebrow">
    <span className="dagwick-brand">{BRAND}</span> · {section}
  </div>
);
