export type View = "fleet" | "themes";

const TABS: { id: View; label: string }[] = [
  { id: "fleet", label: "Fleet" },
  { id: "themes", label: "Themes" },
];

export function readView(search: string): View {
  return new URLSearchParams(search).get("view") === "themes"
    ? "themes"
    : "fleet";
}

/** The query string with the view, keeping every other parameter (fleet is the default). */
export function writeView(search: string, view: View): string {
  const params = new URLSearchParams(search);
  if (view === "fleet") params.delete("view");
  else params.set("view", view);
  const out = params.toString();
  return out ? `?${out}` : "";
}

/** Page tabs in the style of Airflow's own "Dags | Dag Runs | Task Instances". */
export function PageTabs({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  const pick = (next: View) => {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(
      window.history.state,
      "",
      pathname + writeView(search, next) + hash,
    );
    onChange(next);
  };
  return (
    <nav className="dagwick-pagetabs" aria-label="Dagwick pages">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`dagwick-pagetab${view === t.id ? " is-active" : ""}`}
          aria-current={view === t.id ? "page" : undefined}
          onClick={() => pick(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
