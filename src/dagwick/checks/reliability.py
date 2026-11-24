from __future__ import annotations

from typing import Any

from dagwick.checks._source import lines_set_true, parse
from dagwick.checks._util import coverage
from dagwick.core import Category, Context, Finding, Status, check


@check(
    id="retries",
    why=(
        "Most task failures are transient: a network blip, a database restart, a rate "
        "limit. Without retries, one of them fails the whole run and someone has to clear"
        " it by hand, often at night. Retries are only safe for idempotent tasks (running"
        " twice gives the same result), so make tasks idempotent first."
    ),
    bad='default_args={"retries": 0}',
    ack_when=(
        "The task is not idempotent, so a retry would duplicate data (for example it "
        "appends rows without de-duplicating), and it can't be made idempotent yet."
    ),
    title="Tasks retry on failure",
    category=Category.RELIABILITY,
    weight=15,
    acknowledgeable=True,
    example='default_args={\n    "retries": 2,\n    "retry_delay": timedelta(minutes=5),\n}',
    fix="Set retries (for example 2) in default_args so transient errors recover on their own.",
)
def retries(dag: Any) -> Finding:
    return coverage(
        dag,
        lambda t: (getattr(t, "retries", 0) or 0) >= 1,
        noun="retry on failure",
        all_msg="Every task retries at least once.",
        none_msg="No task retries; one network blip fails the whole run.",
    )


# wait_for_downstream=True makes Airflow set depends_on_past=True as well.
PAST_SETTINGS = frozenset({"depends_on_past", "wait_for_downstream"})


def _waits_for_past(task: Any) -> bool:
    return any(getattr(task, name, False) for name in PAST_SETTINGS)


@check(
    id="depends_on_past",
    why=(
        "depends_on_past=True makes a task wait until the same task succeeded in the "
        "previous run. After one failure, later runs stop: their tasks never start, the runs "
        "stay running, and Airflow logs no error. With catchup=True and more than one active "
        "run, every missed interval starts at once and all of them get stuck. dagrun_timeout "
        "doesn't fix it: it fails those runs but marks their tasks skipped, which counts as "
        "done, so later runs go on without the failed interval. Set in default_args, "
        "depends_on_past applies to every task, usually by accident."
    ),
    bad=(
        'DAG("daily_ingest", schedule="@daily", catchup=True,\n'
        '    default_args={"depends_on_past": True})  # up to 16 runs at once'
    ),
    ack_when=(
        "Every run must build on the one before (for example each run applies changes to "
        "the previous day's table), failures are alerted, and someone fixes the failed run "
        "before later runs may go on."
    ),
    title="Safe use of depends_on_past",
    category=Category.RELIABILITY,
    weight=8,
    acknowledgeable=True,
    example=(
        'DAG("daily_ingest", schedule="@daily", catchup=True, max_active_runs=1)\n'
        'BashOperator(task_id="load_day", ..., depends_on_past=True)  # only where needed'
    ),
    fix=(
        "Set depends_on_past only on the tasks that need it, not in default_args. With "
        "catchup=True, also set max_active_runs=1, so a failure holds up one run, not all."
    ),
)
def depends_on_past(dag: Any, context: Context) -> Finding:
    tasks = list(dag.tasks)
    waiting = sorted(t.task_id for t in tasks if _waits_for_past(t))
    if not waiting:
        return Finding(Status.SKIP, "No task uses depends_on_past.")
    every_task = len(waiting) == len(tasks)
    tree = parse(context.source) if context.source else None
    lines = lines_set_true(tree, PAST_SETTINGS) if tree else []
    # Where it is set, when the source shows it; else the tasks (unless that is all of them).
    items = tuple(f"line {line}: {name}=True" for line, name in lines) or (
        () if every_task else tuple(waiting)
    )
    runs = getattr(dag, "max_active_runs", None)
    if getattr(dag, "catchup", False) and (runs is None or runs > 1):
        limit = f"max_active_runs={runs}" if runs else "no max_active_runs"
        return Finding(
            Status.FAIL,
            f"depends_on_past with catchup=True and {limit}: one failed run leaves every "
            "later run stuck in running, with no error.",
            items,
        )
    defaults = getattr(dag, "default_args", None) or {}
    if every_task and any(defaults.get(name) for name in PAST_SETTINGS):
        return Finding(
            Status.WARN,
            "default_args makes every task wait for its own previous run, so one failure "
            "stops every later run.",
            items,
        )
    return Finding(
        Status.PASS,
        f"depends_on_past is set on {len(waiting)} of {len(tasks)} tasks, not on every task "
        "through default_args.",
    )


@check(
    id="execution_timeout",
    why=(
        "A task that hangs (a stuck query, a connection that never times out) holds its "
        "worker slot forever. Other tasks queue behind it, and because it never fails, no"
        " alert fires. Set the limit a little above the task's longest normal run."
    ),
    bad='BashOperator(task_id="load", bash_command="load.sh")  # can run forever',
    title="Tasks have a time limit",
    category=Category.RELIABILITY,
    weight=10,
    example='default_args={"execution_timeout": timedelta(minutes=30)}',
    fix="Set execution_timeout in default_args so a hung task frees its worker slot.",
)
def execution_timeout(dag: Any) -> Finding:
    return coverage(
        dag,
        lambda t: getattr(t, "execution_timeout", None) is not None,
        noun="have an execution_timeout",
        all_msg="Every task has an execution_timeout.",
        none_msg="No task has an execution_timeout; a hung task can run forever.",
    )


@check(
    id="dagrun_timeout",
    why=(
        "A stuck run still counts as active. With max_active_runs=1, the next scheduled "
        "run waits behind it forever and the data silently stops updating. dagrun_timeout"
        " fails the stuck run, so the failure alert fires and the schedule moves on."
    ),
    bad='DAG("daily_sales", schedule="@daily")  # no dagrun_timeout',
    title="Runs have a time limit",
    category=Category.RELIABILITY,
    weight=8,
    example="DAG(..., dagrun_timeout=timedelta(hours=2))",
    fix="Set dagrun_timeout on the DAG so a stuck run cannot block the next one.",
)
def dagrun_timeout(dag: Any) -> Finding:
    timeout = getattr(dag, "dagrun_timeout", None)
    if timeout is None:
        return Finding(Status.FAIL, "dagrun_timeout is not set.")
    return Finding(Status.PASS, f"Runs time out after {timeout}.")
