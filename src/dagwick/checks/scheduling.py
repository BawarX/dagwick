from __future__ import annotations

from typing import Any

from dagwick.checks._util import has_schedule
from dagwick.core import Category, Finding, Status, check


@check(
    id="schedule",
    why=(
        "A DAG without a schedule only runs when something triggers it: a person, another"
        " DAG or the API. That is right for some DAGs, but often the schedule was simply "
        "forgotten and the DAG never runs. Asset schedules count as a schedule."
    ),
    bad='DAG("daily_sales", schedule=None)',
    ack_when=(
        "The DAG is meant to be triggered, for example by another DAG, the API or a "
        "person (a manual reprocessing DAG)."
    ),
    title="Has a schedule",
    category=Category.SCHEDULING,
    weight=5,
    acknowledgeable=True,
    example='DAG(..., schedule="0 3 * * *")',
    fix=(
        "Set schedule= (cron, timedelta or assets). "
        "Leave it None only if another DAG triggers this one."
    ),
)
def schedule(dag: Any) -> Finding:
    if has_schedule(dag):
        summary = getattr(dag.timetable, "summary", None) or type(dag.timetable).__name__
        return Finding(Status.PASS, f"Scheduled: {summary}.")
    return Finding(Status.WARN, "No schedule; this DAG only runs when triggered.")


@check(
    id="catchup",
    why=(
        "With catchup=True, unpausing the DAG, or deploying it with an old start_date, "
        "starts a run for every missed interval, possibly hundreds at once. They can "
        "flood the warehouse and the systems the DAG reads from."
    ),
    bad='DAG("daily_sales", schedule="@daily", catchup=True)',
    ack_when=(
        "The DAG must process every interval, for example an ingest that loads one "
        "partition per day and has to fill the gaps after an outage. Limit "
        "max_active_runs as well."
    ),
    title="No surprise backfills",
    category=Category.SCHEDULING,
    weight=5,
    acknowledgeable=True,
    example="DAG(..., catchup=False)",
    fix="Set catchup=False unless you really want every missed interval to run.",
)
def catchup(dag: Any) -> Finding:
    if not has_schedule(dag):
        return Finding(Status.SKIP, "Not scheduled, so catchup does not apply.")
    if getattr(dag, "catchup", False):
        return Finding(Status.WARN, "catchup=True; unpausing will backfill every missed interval.")
    return Finding(Status.PASS, "catchup=False.")


@check(
    id="auto_pause",
    why=(
        "A broken DAG on a frequent schedule fails on every run, all night: alerts pile "
        "up and worker slots are wasted. max_consecutive_failed_dag_runs pauses it after "
        "a few failures in a row, which stops the noise and is itself a clear signal."
    ),
    bad='DAG("sync_orders", schedule="*/5 * * * *")  # fails forever if broken',
    ack_when=(
        "Something else stops the DAG when it keeps failing, for example on-call pauses "
        "it by hand, or it must keep trying until a source comes back."
    ),
    title="Stops after repeated failures",
    category=Category.SCHEDULING,
    weight=3,
    ack_hint="what stops this DAG when it keeps failing (e.g. on-call pausing it by hand)",
    example="DAG(..., max_consecutive_failed_dag_runs=3)",
    fix=(
        "Set max_consecutive_failed_dag_runs (e.g. 3) "
        "so a broken DAG pauses instead of failing all night."
    ),
)
def auto_pause(dag: Any) -> Finding:
    if not has_schedule(dag):
        return Finding(Status.SKIP, "Not scheduled, so auto-pause does not apply.")
    n = getattr(dag, "max_consecutive_failed_dag_runs", 0) or 0
    if n > 0:
        return Finding(Status.PASS, f"Pauses itself after {n} failed runs in a row.")
    return Finding(Status.WARN, "Keeps running no matter how many runs fail.")


@check(
    id="max_active_runs",
    why=(
        "Without a limit, a backfill or catchup can start many runs at once, all reading "
        "the same sources and writing the same tables. For most ETL, runs of the same DAG"
        " should not overlap. Dagwick accepts up to 4."
    ),
    bad='DAG("daily_sales", schedule="@daily")  # max_active_runs defaults to 16',
    ack_when=(
        "Runs are independent (for example each one processes its own partition) and the "
        "systems they use can take the parallel load."
    ),
    title="Bounded parallel runs",
    category=Category.SCHEDULING,
    weight=5,
    acknowledgeable=True,
    example="DAG(..., max_active_runs=1)",
    fix="Set max_active_runs (1 for most ETL) so backfills cannot flood the warehouse.",
)
def max_active_runs(dag: Any) -> Finding:
    mar = getattr(dag, "max_active_runs", None)
    if mar is not None and mar <= 4:
        return Finding(Status.PASS, f"max_active_runs={mar}.")
    return Finding(Status.WARN, f"max_active_runs={mar}; up to {mar} runs can overlap.")
