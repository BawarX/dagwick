export type Status = "pass" | "warn" | "fail" | "skip" | "ack";
export type Grade = "A" | "B" | "C" | "D" | "F";

export interface CheckResult {
  id: string;
  title: string;
  category: string;
  weight: number;
  status: Status;
  message: string;
  fix: string;
  points: number;
  items: string[];
  example: string;
  /** Why the DAG breaks this check on purpose (status "ack"). */
  ack_reason: string;
  /** Why a "# dagwick: ack" comment for this check was ignored. */
  ack_note: string;
}

export interface ScoreReport {
  dag_id: string;
  score: number;
  grade: Grade;
  points: number;
  max_points: number;
  counts: Record<Status, number>;
  checks: CheckResult[];
}

export interface FleetIssue {
  id: string;
  title: string;
  status: Status;
  gain: number;
}

export interface RunHealth {
  window_days: number;
  runs: number;
  succeeded: number;
  failed: number;
  success_rate: number | null;
  tasks_finished: number;
  tasks_retried: number;
  retry_rate: number | null;
  median_seconds: number | null;
  duration_trend_pct: number | null;
  last_state: string | null;
  last_end: string | null;
  truncated: boolean;
}

export interface FleetHealth {
  runs: number;
  success_rate: number | null;
}

export interface HistoryPoint {
  version: number;
  created_at: string | null;
  score: number;
  grade: Grade;
  better: string[];
  worse: string[];
}

export interface ScoreHistory {
  versions: HistoryPoint[];
  truncated: boolean;
}

export interface FleetDag {
  dag_id: string;
  score: number;
  grade: Grade;
  counts: Record<Status, number>;
  is_paused: boolean;
  owners: string;
  issues: FleetIssue[];
  health?: FleetHealth;
}

export interface FleetReport {
  dags: FleetDag[];
  truncated: boolean;
}

export interface PluginProps {
  dagId?: string;
}
