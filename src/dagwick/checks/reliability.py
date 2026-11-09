from __future__ import annotations

from typing import Any

from dagwick.checks._util import coverage
from dagwick.core import Category, Finding, Status, check


@check(
    id="retries",
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
