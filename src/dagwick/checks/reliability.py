from __future__ import annotations

from typing import Any

from dagwick.checks._source import moving_start_dates, parse
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


def _has_start_date(dag: Any) -> bool:
    if getattr(dag, "start_date", None) is not None:
        return True
    return any(getattr(t, "start_date", None) is not None for t in getattr(dag, "tasks", ()))


@check(
    id="dynamic_start_date",
    why=(
        "A start_date built from the current time, such as datetime.now(), pendulum.today()"
        " or days_ago(1), is a new value every time Airflow parses the file, every few "
        "minutes. Runs are scheduled from that date, so a run may never become due, or runs "
        "appear and disappear, and in Airflow 3 each new value makes a new DAG version. The "
        "serialized DAG only keeps the timestamp, so Dagwick reads the DAG file."
    ),
    bad=(
        "START = datetime.now() - timedelta(days=1)  # a new value on every parse\n"
        'DAG("daily_sales", schedule="@daily", start_date=START)'
    ),
    ack_when=(
        "Rarely: for example a DAG that only runs when triggered (schedule=None), so "
        "start_date doesn't decide when it runs. Even then, removing the start_date is better."
    ),
    title="Fixed start_date",
    category=Category.RELIABILITY,
    weight=10,
    acknowledgeable=True,
    example='DAG(..., start_date=pendulum.datetime(2026, 1, 1, tz="UTC"))',
    fix=(
        'Use a fixed date, for example pendulum.datetime(2026, 1, 1, tz="UTC"). With '
        "catchup=False, a date in the past doesn't start a backfill."
    ),
)
def dynamic_start_date(dag: Any, context: Context) -> Finding:
    if not _has_start_date(dag):
        return Finding(Status.SKIP, "The DAG has no start_date.")
    tree = parse(context.source) if context.source else None
    if tree is None:
        return Finding(Status.SKIP, "The DAG's source code is not available.")
    found = moving_start_dates(tree)
    if not found:
        return Finding(Status.PASS, "No start_date changes when the file is parsed.")
    where = "" if len(found) == 1 else f" in {len(found)} places"
    return Finding(
        Status.FAIL,
        f"start_date uses the current time{where}, so it moves forward on every parse.",
        tuple(f"line {line}: {what}" for line, what in found),
    )
