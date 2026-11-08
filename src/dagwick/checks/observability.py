from __future__ import annotations

from typing import Any

from dagwick.checks._util import coverage
from dagwick.core import Category, Finding, Status, check


@check(
    id="failure_alerts",
    title="Someone hears about failures",
    category=Category.OBSERVABILITY,
    weight=15,
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
    title="Retries are visible",
    category=Category.OBSERVABILITY,
    weight=3,
    example='default_args={"on_retry_callback": send_slack_alert}',
    fix="Add on_retry_callback so flaky tasks surface before they start failing.",
)
def retry_alerts(dag: Any) -> Finding:
    if any(getattr(t, "has_on_retry_callback", False) for t in dag.tasks):
        return Finding(Status.PASS, "Retries send a notification.")
    return Finding(Status.WARN, "Retries happen silently.")
