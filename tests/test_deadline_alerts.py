"""deadline_alerts: long-running DAGs without a deadline alert (#110).

How a deadline alert serializes, checked on Airflow 3.1.8, 3.2.2, 3.3.2 and 3.4.0:

| Airflow | After a round trip (dagwick check) | Read from the database (api-server) |
| ------- | ---------------------------------- | ----------------------------------- |
| 3.1     | a list of DeadlineAlert objects    | a list of DeadlineAlert objects     |
| 3.2+    | a list of encoded alert dicts      | a list of deadline_alert row ids    |

No deadline is None everywhere, so "set" means a non-empty ``dag.deadline``.
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta
from types import SimpleNamespace

import pytest
from airflow import __version__ as airflow_version
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG
from airflow.sdk.definitions.deadline import AsyncCallback, DeadlineAlert, DeadlineReference
from conftest import roundtrip

from dagwick import Context, Status
from dagwick.checks.reliability import _duration, deadline_alerts
from dagwick.core import score_dag
from dagwick.health import median_seconds, typical_run_seconds

HOUR = 3600.0
AIRFLOW = tuple(int(part) for part in airflow_version.split(".")[:2])


def alert(hours=3):
    return DeadlineAlert(
        reference=DeadlineReference.DAGRUN_QUEUED_AT,
        interval=timedelta(hours=hours),
        callback=AsyncCallback(asyncio.sleep, kwargs={"delay": 0}),
    )


def build(**dag_args):
    with DAG("nightly", schedule="@daily", start_date=datetime(2026, 1, 1), **dag_args) as dag:
        EmptyOperator(task_id="load")
    return roundtrip(dag)


def check(dag, run_seconds=None):
    return deadline_alerts(dag, Context(typical_run_seconds=run_seconds))


def test_the_serialized_deadline_on_this_airflow():
    (kept,) = build(deadline=alert()).deadline
    if AIRFLOW < (3, 2):
        assert isinstance(kept, DeadlineAlert)
    else:
        assert kept["reference"]["reference_type"] == "DagRunQueuedAtDeadline"
    assert build().deadline is None


@pytest.mark.parametrize(
    ("deadline", "message"),
    [(alert(), "1 deadline alert is set."), ([alert(1), alert(3)], "2 deadline alerts are set.")],
)
def test_a_deadline_alert_passes_even_for_long_runs(deadline, message):
    result = check(build(deadline=deadline, dagrun_timeout=timedelta(hours=6)), 3 * HOUR)
    assert result.status == Status.PASS
    assert result.message == message


def test_the_database_form_of_a_deadline_counts():
    # From Airflow 3.2 the api-server's DAG keeps the ids of its deadline_alert rows.
    dag = SimpleNamespace(deadline=["01a20d07-df6b-76eb-9a86-1291ac20a0b0"], dagrun_timeout=None)
    assert check(dag, 3 * HOUR).status == Status.PASS
    assert check(SimpleNamespace(deadline=[], dagrun_timeout=None), 3 * HOUR).status == Status.WARN


def test_an_airflow_without_deadline_alerts_skips():
    result = check(SimpleNamespace(dagrun_timeout=timedelta(hours=6)), 3 * HOUR)
    assert result.status == Status.SKIP
    assert result.message == "This Airflow version has no deadline alerts."


def test_long_runs_without_a_deadline_warn():
    result = check(build(), 2.5 * HOUR)
    assert result.status == Status.WARN
    assert result.message.startswith("Runs usually take 2.5 h, and no deadline alert")


def test_a_long_dagrun_timeout_without_a_deadline_warns():
    result = check(build(dagrun_timeout=timedelta(hours=6)))
    assert result.status == Status.WARN
    assert result.message.startswith("A run may take up to 6.0 h (dagrun_timeout)")


def test_a_long_dagrun_timeout_warns_even_when_runs_are_short():
    # A stuck run is the late run: it stays quiet until the timeout.
    assert check(build(dagrun_timeout=timedelta(hours=6)), 300).status == Status.WARN


@pytest.mark.parametrize(
    ("dag_args", "run_seconds", "message"),
    [
        ({}, 300, "Runs usually take 5 min, too short to need a deadline."),
        ({"dagrun_timeout": timedelta(hours=2)}, None, "Not enough to judge"),
        ({}, None, "Not enough to judge"),
    ],
)
def test_short_or_unknown_runs_are_skipped(dag_args, run_seconds, message):
    result = check(build(**dag_args), run_seconds)
    assert result.status == Status.SKIP
    assert result.message.startswith(message)


@pytest.mark.parametrize(("seconds", "text"), [(45, "45 s"), (300, "5 min"), (9000, "2.5 h")])
def test_durations_read_naturally(seconds, text):
    assert _duration(seconds) == text


def test_the_report_warns_and_a_reason_acknowledges_it():
    dag = build(dagrun_timeout=timedelta(hours=6))

    def result(context):
        report = score_dag(dag, context)
        return next(c for c in report["checks"] if c["id"] == "deadline_alerts")

    flagged = result(Context())
    assert flagged["status"] == "warn" and flagged["points"] == flagged["weight"] / 2
    assert flagged["category"] == "reliability"
    assert flagged["fix"] and flagged["why"] and "DeadlineAlert(" in flagged["example"]

    source = "# dagwick: ack deadline_alerts -- a freshness check pages us when data is late\n"
    acked = result(Context(source=source))
    assert acked["status"] == "ack"
    assert acked["ack_reason"] == "a freshness check pages us when data is late"


# --- run times: the run-health data, read-only ---------------------------------


def test_median_seconds_per_dag_skips_runs_without_both_times():
    start = datetime(2026, 1, 1, 0, 0)
    rows = [
        ("a", start, start + timedelta(minutes=10)),
        ("a", start, start + timedelta(minutes=30)),
        ("a", start, start + timedelta(minutes=20)),
        ("b", start, None),
        ("c", None, start),
    ]
    assert median_seconds(rows) == {"a": 1200.0}


def test_typical_run_seconds_needs_no_query_for_no_dags():
    assert typical_run_seconds([]) == {}


def test_run_times_are_unknown_when_the_database_fails(monkeypatch):
    from airflow.utils import session as airflow_session

    from dagwick import api

    def boom():
        raise RuntimeError("database is down")

    monkeypatch.setattr(airflow_session, "create_session", boom)
    assert api._typical_runs(["nightly"]) == {}


def test_score_by_id_reads_run_times_and_rescores_when_a_dag_becomes_long(monkeypatch, shining):
    from airflow.models import serialized_dag

    from dagwick import api

    fake = SimpleNamespace(dag_hash="h1", dag=shining)
    monkeypatch.setattr(serialized_dag.SerializedDagModel, "get", lambda dag_id: fake)
    monkeypatch.setattr(api, "_cache", api._ScoreCache())

    def status(report):
        return {c["id"]: c["status"] for c in report["checks"]}["deadline_alerts"]

    short = api._score_by_id("demo", 1, (None, None), 600.0)
    same_band = api._score_by_id("demo", 1, (None, None), 900.0)
    long_runs = api._score_by_id("demo", 1, (None, None), 2 * HOUR)
    assert short is same_band and status(short) == "skip"
    assert long_runs is not short and status(long_runs) == "warn"

    asked = []
    monkeypatch.setattr(api, "_typical_runs", lambda ids: asked.append(ids) or {"demo": 2 * HOUR})
    assert status(api._score_by_id("demo", 1, (None, None))) == "warn"  # the DAG tab asks itself
    assert asked == [["demo"]]
