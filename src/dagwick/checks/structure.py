from __future__ import annotations

import re
from typing import Any

from dagwick.core import Category, Finding, Status, check

SNAKE = re.compile(r"^[a-z0-9_]+(\.[a-z0-9_]+)*$")  # dots come from task groups


@check(
    id="decomposition",
    title="Split into steps",
    category=Category.STRUCTURE,
    weight=5,
    fix="Split the work into smaller tasks so a failure retries only the broken step.",
)
def decomposition(dag: Any) -> Finding:
    n = len(dag.tasks)
    if n >= 2:
        return Finding(Status.PASS, f"{n} tasks.")
    return Finding(Status.WARN, f"Only {n} task; a failure reruns everything.")


@check(
    id="naming",
    title="Consistent names",
    category=Category.STRUCTURE,
    weight=3,
    example='EmptyOperator(task_id="load_payments")  # not "LoadPayments"',
    fix="Use snake_case for dag_id and task_ids.",
)
def naming(dag: Any) -> Finding:
    bad = [t.task_id for t in dag.tasks if not SNAKE.match(t.task_id)]
    if not SNAKE.match(dag.dag_id):
        bad.insert(0, dag.dag_id)
    if not bad:
        return Finding(Status.PASS, "dag_id and task_ids are snake_case.")
    noun = "name is" if len(bad) == 1 else "names are"
    return Finding(Status.WARN, f"{len(bad)} {noun} not snake_case.", tuple(bad))
