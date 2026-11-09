from __future__ import annotations

from typing import Any

from dagwick.checks._sensors import DEFERRABLE, POKE, RESCHEDULE, sensor_modes
from dagwick.checks._source import parse, variable_get_lines
from dagwick.core import Category, Context, Finding, Status, check

PARSE_WARN_SECONDS = 5.0
PARSE_FAIL_SECONDS = 20.0


def duration(seconds: float) -> str:
    return f"{seconds:.2f} s" if seconds < 1 else f"{seconds:.1f} s"


def parse_status(seconds: float | None) -> Status:
    if seconds is None:
        return Status.SKIP
    if seconds >= PARSE_FAIL_SECONDS:
        return Status.FAIL
    if seconds >= PARSE_WARN_SECONDS:
        return Status.WARN
    return Status.PASS


@check(
    id="parse_time",
    title="Fast to parse",
    category=Category.PERFORMANCE,
    weight=5,
    example=(
        "rows = requests.get(URL).json()  # runs on every parse\n\n"
        "@task\n"
        "def load():\n"
        "    rows = requests.get(URL).json()  # runs only when the task runs"
    ),
    fix=(
        "Move slow top-level work (API calls, database queries, heavy imports) into tasks. "
        "The DAG processor re-parses the file every few minutes, and a file slower than "
        "dagbag_import_timeout (30 s by default) fails to load."
    ),
)
def parse_time(dag: Any, context: Context) -> Finding:
    status = parse_status(context.parse_seconds)
    if status is Status.SKIP:
        return Finding(Status.SKIP, "The file's parse time is not known yet.")
    took = duration(context.parse_seconds)
    if status is Status.PASS:
        return Finding(Status.PASS, f"The file parses in {took}.")
    if status is Status.WARN:
        return Finding(Status.WARN, f"The file takes {took} to parse, on every parse loop.")
    return Finding(Status.FAIL, f"The file takes {took} to parse; near the import timeout.")


@check(
    id="parse_time_variables",
    title="No Variable.get at parse time",
    category=Category.PERFORMANCE,
    weight=5,
    example='BashOperator(task_id="load", bash_command="load.sh {{ var.value.bucket }}")',
    fix=(
        "Read Variables inside a task, or through a template such as "
        "{{ var.value.name }}, so they are read when the task runs, not on every parse."
    ),
)
def parse_time_variables(dag: Any, context: Context) -> Finding:
    tree = parse(context.source) if context.source else None
    if tree is None:
        return Finding(Status.SKIP, "The DAG's source code is not available.")
    lines = variable_get_lines(tree)
    if not lines:
        return Finding(Status.PASS, "No Variable.get runs when the file is parsed.")
    noun = "call runs" if len(lines) == 1 else "calls run"
    return Finding(
        Status.FAIL,
        f"{len(lines)} Variable.get {noun} on every parse, each one a metadata or secrets lookup.",
        tuple(f"line {n}" for n in lines),
    )


SLOW_POKE_SECONDS = 60


def _minutes(seconds: float) -> str:
    return f"{seconds / 60:.0f} min" if seconds >= 90 else f"{seconds:.0f} s"


@check(
    id="sensor_slots",
    title="Sensors free their worker slot",
    category=Category.PERFORMANCE,
    weight=5,
    acknowledgeable=True,
    ack_hint="why the sensor must keep a worker slot (for example it needs sub-minute reaction)",
    example=(
        'S3KeySensor(task_id="wait_for_file", ..., deferrable=True)\n'
        "# or, for a sensor without a deferrable version:\n"
        'S3KeySensor(task_id="wait_for_file", ..., mode="reschedule", poke_interval=300)'
    ),
    fix=(
        'Make long-waiting sensors deferrable, or set mode="reschedule", so they free their '
        "worker slot between checks instead of holding it for the whole wait."
    ),
)
def sensor_slots(dag: Any, context: Context) -> Finding:
    sensors = context.sensor_tasks
    if sensors is None:
        return Finding(Status.SKIP, "Which tasks are sensors is not known.")
    if not sensors:
        return Finding(Status.SKIP, "The DAG has no sensors.")
    tree = parse(context.source) if context.source else None
    modes = sensor_modes(tree, context.default_deferrable) if tree else {}
    runs = context.sensor_runs or {}
    holding: list[str] = []
    fine = 0
    for task_id in sensors:
        mode = modes.get(task_id)
        wait, rescheduled = runs.get(task_id, (None, False))
        if rescheduled or mode in (RESCHEDULE, DEFERRABLE):
            fine += 1
        elif mode == POKE and wait is not None:
            if wait >= SLOW_POKE_SECONDS:
                holding.append(f"{task_id}: holds a worker slot for about {_minutes(wait)} per run")
            else:
                fine += 1
    if holding:
        noun = "sensor holds" if len(holding) == 1 else "sensors hold"
        return Finding(
            Status.WARN,
            f"{len(holding)} {noun} a worker slot while waiting.",
            tuple(holding),
        )
    if fine:
        return Finding(Status.PASS, "Sensors free their slot, or finish their wait quickly.")
    return Finding(
        Status.SKIP,
        "Not enough to judge yet: no recent runs, or the source does not show the mode.",
    )
