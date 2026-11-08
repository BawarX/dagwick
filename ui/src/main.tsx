import { App } from "./App";
import { BRAND } from "./brand";
import type { PluginProps } from "./types";

function Plugin(props: PluginProps) {
  return <App {...props} />;
}

// Airflow looks up globalThis[<react_app name>], then falls back to AirflowPlugin.
const g = globalThis as Record<string, unknown>;
g[BRAND] = Plugin;
g.AirflowPlugin = Plugin;

export default Plugin;
