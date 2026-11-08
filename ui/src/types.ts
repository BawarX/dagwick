export type Status = "pass" | "warn" | "fail" | "skip";
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

export interface FleetDag {
  dag_id: string;
  score: number;
  grade: Grade;
  counts: Record<Status, number>;
  is_paused: boolean;
  owners: string;
  issues: FleetIssue[];
}

export interface FleetReport {
  dags: FleetDag[];
  truncated: boolean;
}

export interface PluginProps {
  dagId?: string;
}
