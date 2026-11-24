from __future__ import annotations

import re
from pathlib import PurePath
from typing import Any

from dagwick.checks._source import deprecated_imports, parse
from dagwick.core import Category, Context, Finding, Status, check

SNAKE = re.compile(r"^[a-z0-9_]+(\.[a-z0-9_]+)*$")  # dots come from task groups


@check(
    id="decomposition",
    why=(
        "A DAG with a single task does everything in one step. A failure near the end "
        "reruns the whole job, and Airflow can't show which part is slow or broken."
    ),
    bad="@task\ndef everything():\n    extract()\n    transform()\n    load()",
    ack_when=(
        "The work really is one atomic step, for example a single SQL statement or "
        "triggering an external job."
    ),
    title="Split into steps",
    category=Category.STRUCTURE,
    weight=5,
    acknowledgeable=True,
    fix="Split the work into smaller tasks so a failure retries only the broken step.",
)
def decomposition(dag: Any) -> Finding:
    n = len(dag.tasks)
    if n >= 2:
        return Finding(Status.PASS, f"{n} tasks.")
    return Finding(Status.WARN, f"Only {n} task; a failure reruns everything.")


def _neighbours(task: Any) -> set[str]:
    """The task ids directly upstream or downstream of ``task``."""
    upstream = getattr(task, "upstream_task_ids", None) or ()
    downstream = getattr(task, "downstream_task_ids", None) or ()
    return {*upstream, *downstream}


@check(
    id="isolated_tasks",
    why=(
        "A task with no upstream and no downstream task is usually a forgotten >>. Airflow "
        "runs it as soon as the DAG run begins, in parallel with everything else, so it can "
        "read data before it is written, and the graph no longer shows where it belongs. "
        "DAGs where most tasks have no dependencies, such as a batch of independent jobs, "
        "are skipped."
    ),
    bad=(
        'extract = BashOperator(task_id="extract", bash_command="extract.sh")\n'
        'load = BashOperator(task_id="load", bash_command="load.sh")\n'
        'report = BashOperator(task_id="report", bash_command="report.sh")\n'
        "extract >> load  # report is not connected: it starts before the data is loaded"
    ),
    ack_when=(
        "The task is independent of the others on purpose, for example housekeeping that "
        "cleans up old files while the pipeline runs."
    ),
    title="Tasks are connected",
    category=Category.STRUCTURE,
    weight=3,
    acknowledgeable=True,
    example="extract >> load >> report",
    fix="Connect the task with >> or chain() so it runs in the right order.",
)
def isolated_tasks(dag: Any) -> Finding:
    tasks = list(dag.tasks)
    if len(tasks) < 2:
        return Finding(Status.SKIP, "Fewer than two tasks, so there is nothing to connect.")
    # The serialized DAG stores each task's downstream ids and rebuilds the upstream
    # ones when it is loaded. Both ends of every edge count, so either side is enough.
    with_edges: set[str] = set()
    for task in tasks:
        neighbours = _neighbours(task)
        if neighbours:
            with_edges |= {task.task_id, *neighbours}
    isolated = sorted(t.task_id for t in tasks if t.task_id not in with_edges)
    connected = len(tasks) - len(isolated)
    if not isolated:
        return Finding(Status.PASS, "Every task is connected to another task.")
    if not connected:
        return Finding(
            Status.SKIP, "No task depends on another, so the tasks look independent on purpose."
        )
    if len(isolated) >= connected:
        return Finding(
            Status.SKIP,
            f"{len(isolated)} of {len(tasks)} tasks have no upstream or downstream task, "
            "so they look independent on purpose.",
        )
    noun, verb = ("task has", "it runs") if len(isolated) == 1 else ("tasks have", "they run")
    return Finding(
        Status.WARN,
        f"{len(isolated)} {noun} no upstream or downstream task, so {verb} in parallel "
        "with the rest.",
        tuple(isolated),
    )


@check(
    id="naming",
    why=(
        "dag_ids and task_ids show up in URLs, logs, metric names and CLI commands. "
        "snake_case ids are consistent and easy to type, search and grep; a mix of styles"
        " makes DAGs harder to find."
    ),
    bad='DAG("DailySales")\nEmptyOperator(task_id="Load-Payments")',
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
    why=(
        "When a DAG fails, people search the repository for its dag_id. A file named "
        "after the DAG puts its code one step away. Files that define several DAGs (DAG "
        "factories) are skipped."
    ),
    bad='# dags/sales.py\nDAG("daily_sales")',
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


@check(
    id="current_imports",
    why=(
        "Airflow 3 moved many classes: operators to provider packages, the DAG authoring "
        "API to airflow.sdk. The old paths still work through deprecation shims that a "
        "future Airflow release removes. When that happens, the file fails to import and "
        "every DAG in it disappears."
    ),
    bad="from airflow.operators.bash import BashOperator",
    title="Uses current Airflow imports",
    category=Category.STRUCTURE,
    weight=3,
    example=(
        "from airflow.providers.standard.operators.bash import BashOperator\n"
        "# not: from airflow.operators.bash import BashOperator"
    ),
    fix=(
        "Import from the new location Airflow points to. The old paths only work through "
        "deprecation shims that a future Airflow release removes."
    ),
)
def current_imports(dag: Any, context: Context) -> Finding:
    tree = parse(context.source) if context.source else None
    if tree is None:
        return Finding(Status.SKIP, "The DAG's source code is not available.")
    found = deprecated_imports(tree)
    if not found:
        return Finding(Status.PASS, "No deprecated Airflow import paths.")
    noun = "import uses a path" if len(found) == 1 else "imports use paths"
    return Finding(
        Status.WARN,
        f"{len(found)} {noun} Airflow has deprecated.",
        tuple(f"line {line}: {old} → {new}" for line, old, new in found),
    )
