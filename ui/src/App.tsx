import { DagView } from "./DagView";
import { FleetView } from "./FleetView";
import { STYLES } from "./styles";
import type { PluginProps } from "./types";

/** One bundle, two places: the DAG tab (Airflow passes dagId) and the fleet page (no dagId). */
export function App({ dagId }: PluginProps) {
  return (
    <div className="dagwick">
      <style>{STYLES}</style>
      {dagId ? <DagView key={dagId} dagId={dagId} /> : <FleetView />}
    </div>
  );
}
