from __future__ import annotations

import re
from pathlib import PurePath
from typing import Any

from dagwick.core import Category, Context, Finding, Status, check

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


@check(
    id="file_name",
    title="File named after the DAG",
    category=Category.STRUCTURE,
    weight=3,
    example='dags/load_payments.py   ->   DAG(dag_id="load_payments")',
    fix="Name the file <dag_id>.py (one DAG per file), so the DAG's code is easy to find.",
)
def file_name(dag: Any, context: Context) -> Finding:
    fileloc = getattr(dag, "fileloc", None)
    if not fileloc:
        return Finding(Status.SKIP, "The DAG's file is unknown.")
    if context.dags_in_file and context.dags_in_file > 1:
        return Finding(
            Status.SKIP, f"The file defines {context.dags_in_file} DAGs (a DAG factory)."
        )
    path = PurePath(fileloc)
    if path.stem == dag.dag_id:
        return Finding(Status.PASS, f"Defined in {path.name}.")
    return Finding(Status.WARN, f"Defined in {path.name}; expected {dag.dag_id}.py.", (path.name,))
