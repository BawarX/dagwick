import { useState } from "react";

import { DagView } from "./DagView";
import { FleetView } from "./FleetView";
import { PageTabs, readView } from "./PageTabs";
import { ThemesView } from "./ThemesView";
import { STYLES } from "./styles";
import type { PluginProps } from "./types";

/** One bundle, two places: the DAG tab (Airflow passes dagId) and the fleet page (no dagId). */
export function App({ dagId }: PluginProps) {
  return (
    <div className="dagwick">
      <style>{STYLES}</style>
      {dagId ? <DagView key={dagId} dagId={dagId} /> : <NavPage />}
    </div>
  );
}

/** The sidebar page: tabs like Airflow's own "Dags | Dag Runs | Task Instances". */
function NavPage() {
  const [view, setView] = useState(() => readView(window.location.search));
  return (
    <>
      <PageTabs view={view} onChange={setView} />
      {view === "themes" ? <ThemesView /> : <FleetView />}
    </>
  );
}
