from __future__ import annotations

from typing import Any

from dagwick.checks._util import coverage
from dagwick.core import Category, Finding, Status, check


@check(
    id="failure_alerts",
    why=(
        "A DAG that fails without telling anyone keeps failing until someone notices "
        "stale data, often days later and often a user of the data. A failure callback or"
        " notifier sends the failure to where the owners look."
    ),
    bad='default_args={"owner": "data-team"}  # no on_failure_callback',
    ack_when=(
        "Failures are alerted somewhere else, for example by a central listener plugin, a"
        " Grafana or Prometheus rule on task state, or an on-call system that watches "
        "Airflow."
    ),
    title="Someone hears about failures",
    category=Category.OBSERVABILITY,
    weight=15,
    ack_hint="where failures are alerted instead (e.g. a central listener or a Grafana rule)",
    example='default_args={"on_failure_callback": send_slack_alert}',
    fix="Add on_failure_callback (e.g. a Slack notifier) in default_args.",
)
def failure_alerts(dag: Any) -> Finding:
    if getattr(dag, "has_on_failure_callback", False):
        return Finding(Status.PASS, "The DAG has an on_failure_callback.")
    return coverage(
        dag,
        lambda t: bool(getattr(t, "has_on_failure_callback", False)),
        noun="alert on failure",
        all_msg="Every task alerts on failure.",
        none_msg="Nothing alerts on failure; it will fail silently.",
    )


@check(
    id="retry_alerts",
    why=(
        "A task that only succeeds on its second or third try works today and fails "
        "tomorrow. A retry notification shows the flakiness while there is still time to "
        "fix it."
    ),
    bad='default_args={"retries": 3}  # retries happen silently',
    ack_when=(
        "Retries are expected and would only be noise, for example a task that polls an "
        "API which rate-limits by design."
    ),
    title="Retries are visible",
    category=Category.OBSERVABILITY,
    weight=3,
    acknowledgeable=True,
    example='default_args={"on_retry_callback": send_slack_alert}',
    fix="Add on_retry_callback so flaky tasks surface before they start failing.",
)
def retry_alerts(dag: Any) -> Finding:
    if any(getattr(t, "has_on_retry_callback", False) for t in dag.tasks):
        return Finding(Status.PASS, "Retries send a notification.")
    return Finding(Status.WARN, "Retries happen silently.")
