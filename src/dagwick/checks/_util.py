from __future__ import annotations

from collections.abc import Callable
from typing import Any

from dagwick.core import Finding, Status


def coverage(
    dag: Any,
    predicate: Callable[[Any], bool],
    *,
    noun: str,
    all_msg: str,
    none_msg: str,
) -> Finding:
    """PASS if every task matches, WARN if some do, FAIL if none do."""
    tasks = list(dag.tasks)
    if not tasks:
        return Finding(Status.SKIP, "The DAG has no tasks.")
    missing = tuple(sorted(t.task_id for t in tasks if not predicate(t)))
    if not missing:
        return Finding(Status.PASS, all_msg)
    if len(missing) == len(tasks):
        return Finding(Status.FAIL, none_msg)  # every task: listing them adds nothing
    ok = len(tasks) - len(missing)
    return Finding(Status.WARN, f"{ok} of {len(tasks)} tasks {noun}.", missing)


def has_schedule(dag: Any) -> bool:
    timetable = getattr(dag, "timetable", None)
    return timetable is not None and type(timetable).__name__ != "NullTimetable"
