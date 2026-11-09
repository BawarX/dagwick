from __future__ import annotations

import statistics
from collections.abc import Iterable
from datetime import datetime, timedelta, timezone
from typing import Any

WINDOW_DAYS = 30
RECENT_DAYS = 7
MAX_RUNS = 500
MIN_RUNS_FOR_TREND = 3
FINISHED = ("success", "failed")

Run = tuple[str, datetime | None, datetime | None]


def _state(value: Any) -> str:
    return str(getattr(value, "value", value))


def _utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


def _seconds(start: datetime | None, end: datetime | None) -> float | None:
    if start is None or end is None:
        return None
    return max((_utc(end) - _utc(start)).total_seconds(), 0.0)


def _median(values: list[float]) -> float | None:
    return round(statistics.median(values), 1) if values else None


def summarise(
    runs: Iterable[Run], tasks_finished: int, tasks_retried: int, now: datetime
) -> dict[str, Any]:
    runs = list(runs)
    succeeded = [r for r in runs if r[0] == "success"]
    failed = sum(1 for r in runs if r[0] == "failed")
    recent_since = now - timedelta(days=RECENT_DAYS)
    recent, earlier = [], []
    for _, start, end in succeeded:
        took = _seconds(start, end)
        if took is not None:
            (recent if _utc(end) >= recent_since else earlier).append(took)
    finished = len(succeeded) + failed
    trend = None
    if len(recent) >= MIN_RUNS_FOR_TREND and len(earlier) >= MIN_RUNS_FOR_TREND:
        before = statistics.median(earlier)
        if before > 0:
            trend = round((statistics.median(recent) - before) / before * 100)
    last = runs[0] if runs else None
    return {
        "window_days": WINDOW_DAYS,
        "runs": finished,
        "succeeded": len(succeeded),
        "failed": failed,
        "success_rate": round(len(succeeded) / finished * 100, 1) if finished else None,
        "tasks_finished": tasks_finished,
        "tasks_retried": tasks_retried,
        "retry_rate": round(tasks_retried / tasks_finished * 100, 1) if tasks_finished else None,
        "median_seconds": _median(recent or earlier),
        "duration_trend_pct": trend,
        "last_state": last[0] if last else None,
        "last_end": _utc(last[2]).isoformat() if last and last[2] else None,
        "truncated": len(runs) >= MAX_RUNS,
    }


def success_rate(succeeded: int, failed: int) -> float | None:
    finished = succeeded + failed
    return round(succeeded / finished * 100, 1) if finished else None


def dag_health(dag_id: str, now: datetime | None = None) -> dict[str, Any]:
    from airflow.models.dagrun import DagRun
    from airflow.models.taskinstance import TaskInstance
    from airflow.utils.session import create_session
    from sqlalchemy import case, func, select

    now = now or datetime.now(timezone.utc)
    since = now - timedelta(days=WINDOW_DAYS)
    with create_session() as session:
        runs = session.execute(
            select(DagRun.state, DagRun.start_date, DagRun.end_date)
            .where(
                DagRun.dag_id == dag_id,
                DagRun.state.in_(FINISHED),
                DagRun.end_date >= since,
            )
            .order_by(DagRun.end_date.desc())
            .limit(MAX_RUNS)
        ).all()
        tasks_finished, tasks_retried = session.execute(
            select(
                func.count(),
                func.coalesce(func.sum(case((TaskInstance.try_number > 1, 1), else_=0)), 0),
            ).where(
                TaskInstance.dag_id == dag_id,
                TaskInstance.state.in_(FINISHED),
                TaskInstance.end_date >= since,
            )
        ).one()
    return summarise(
        [(_state(state), start, end) for state, start, end in runs],
        int(tasks_finished),
        int(tasks_retried),
        now,
    )


def fleet_success(dag_ids: list[str], now: datetime | None = None) -> dict[str, dict[str, Any]]:
    from airflow.models.dagrun import DagRun
    from airflow.utils.session import create_session
    from sqlalchemy import func, select

    since = (now or datetime.now(timezone.utc)) - timedelta(days=WINDOW_DAYS)
    counts: dict[str, dict[str, int]] = {}
    with create_session() as session:
        for dag_id, state, n in session.execute(
            select(DagRun.dag_id, DagRun.state, func.count())
            .where(
                DagRun.dag_id.in_(dag_ids),
                DagRun.state.in_(FINISHED),
                DagRun.end_date >= since,
            )
            .group_by(DagRun.dag_id, DagRun.state)
        ).all():
            counts.setdefault(dag_id, {})[_state(state)] = int(n)
    return {
        dag_id: {
            "runs": c.get("success", 0) + c.get("failed", 0),
            "success_rate": success_rate(c.get("success", 0), c.get("failed", 0)),
        }
        for dag_id, c in counts.items()
    }
