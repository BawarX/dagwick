from __future__ import annotations

import pytest

from dagwick.core import score_dag


def by_id(report):
    return {c["id"]: c for c in report["checks"]}


def test_shining_dag_passes_everything(shining):
    report = score_dag(shining)
    assert report["score"] == 100.0
    assert report["grade"] == "A"
    assert report["counts"]["fail"] == report["counts"]["warn"] == 0
    assert all(c["fix"] == "" for c in report["checks"])


def test_dim_dag_gets_an_f(dim):
    report = score_dag(dim)
    assert report["grade"] == "F"
    checks = by_id(report)
    for failing in (
        "retries",
        "execution_timeout",
        "dagrun_timeout",
        "failure_alerts",
        "owner",
        "tags",
        "docs",
    ):
        assert checks[failing]["status"] == "fail", failing
        assert checks[failing]["fix"], failing
    assert checks["catchup"]["status"] == "warn"
    assert checks["decomposition"]["status"] == "warn"
    assert checks["naming"]["status"] == "warn"
    assert checks["max_active_runs"]["status"] == "warn"
    assert checks["auto_pause"]["status"] == "warn"


@pytest.mark.parametrize(
    ("check_id", "status"),
    [
        ("retries", "pass"),
        ("execution_timeout", "warn"),  # only one of three tasks
        ("docs", "warn"),  # description but no doc_md
        ("naming", "warn"),  # SyncData
        ("failure_alerts", "fail"),
        ("owner", "pass"),
    ],
)
def test_average_dag_partial_credit(average, check_id, status):
    assert by_id(score_dag(average))[check_id]["status"] == status


def test_default_owner_is_not_an_owner(dim):
    # Airflow fills owner="airflow" by default; the old plugin counted that as set.
    assert dim.owner == "airflow"
    assert by_id(score_dag(dim))["owner"]["status"] == "fail"


def test_unscheduled_dag_skips_catchup_and_warns_on_schedule():
    from airflow.providers.standard.operators.empty import EmptyOperator
    from airflow.sdk import DAG
    from airflow.serialization.serialized_objects import DagSerialization

    with DAG("manual_only", schedule=None) as dag:
        EmptyOperator(task_id="a")
    s = DagSerialization.from_dict(DagSerialization.to_dict(dag))
    checks = by_id(score_dag(s))
    assert checks["schedule"]["status"] == "warn"
    assert checks["catchup"]["status"] == "skip"
    assert checks["catchup"]["points"] == 0


def test_partial_checks_name_the_affected_tasks(average):
    checks = by_id(score_dag(average))
    assert checks["execution_timeout"]["items"] == ["done", "start"]
    assert checks["naming"]["items"] == ["SyncData"]
    assert "timedelta" in checks["execution_timeout"]["example"]


def test_passing_checks_carry_no_fix_items_or_example(shining):
    for c in score_dag(shining)["checks"]:
        assert c["items"] == [] and c["example"] == "" and c["fix"] == ""
