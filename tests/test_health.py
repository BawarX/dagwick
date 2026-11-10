from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from dagwick.health import MAX_RUNS, success_rate, summarise

NOW = datetime(2026, 11, 9, 12, tzinfo=timezone.utc)


def run(state, days_ago, minutes, naive=False):
    end = NOW - timedelta(days=days_ago)
    start = end - timedelta(minutes=minutes)
    if naive:
        start, end = start.replace(tzinfo=None), end.replace(tzinfo=None)
    return (state, start, end)


def test_no_runs():
    h = summarise([], 0, 0, NOW)
    assert h["runs"] == 0
    assert h["success_rate"] is None and h["retry_rate"] is None
    assert h["median_seconds"] is None and h["duration_trend_pct"] is None
    assert h["last_state"] is None and h["last_end"] is None


def test_success_rate_retries_and_last_run():
    runs = [
        run("failed", 0.5, 3),
        run("success", 1, 10),
        run("success", 2, 10),
        run("success", 3, 10),
    ]
    h = summarise(runs, tasks_finished=40, tasks_retried=4, now=NOW)
    assert (h["runs"], h["succeeded"], h["failed"]) == (4, 3, 1)
    assert h["success_rate"] == 75.0
    assert h["retry_rate"] == 10.0
    assert h["last_state"] == "failed"
    assert h["last_end"] == (NOW - timedelta(days=0.5)).isoformat()


def test_median_uses_recent_successful_runs_and_reports_the_trend():
    recent = [run("success", d, 20) for d in (1, 2, 3)]
    earlier = [run("success", d, 10) for d in (10, 11, 12, 13)]
    h = summarise(recent + earlier + [run("failed", 1.5, 500)], 10, 0, NOW)
    assert h["median_seconds"] == 1200.0
    assert h["duration_trend_pct"] == 100


def test_no_trend_without_enough_runs_on_both_sides():
    runs = [run("success", 1, 20), run("success", 2, 20)] + [
        run("success", d, 10) for d in (10, 11, 12)
    ]
    h = summarise(runs, 5, 0, NOW)
    assert h["duration_trend_pct"] is None
    assert h["median_seconds"] == 1200.0


def test_median_falls_back_to_earlier_runs_when_nothing_recent():
    h = summarise([run("success", 10, 6), run("success", 12, 8)], 2, 0, NOW)
    assert h["median_seconds"] == 420.0


def test_naive_timestamps_from_sqlite_are_treated_as_utc():
    h = summarise([run("success", 1, 5, naive=True)], 1, 0, NOW)
    assert h["median_seconds"] == 300.0
    assert h["last_end"].endswith("+00:00")


def test_runs_without_timestamps_count_but_have_no_duration():
    h = summarise([("success", None, None)], 1, 0, NOW)
    assert h["runs"] == 1 and h["median_seconds"] is None


def test_truncated_when_the_run_cap_is_hit():
    runs = [run("success", 1, 1)] * MAX_RUNS
    assert summarise(runs, 0, 0, NOW)["truncated"] is True


@pytest.mark.parametrize(
    ("ok", "bad", "rate"), [(0, 0, None), (9, 1, 90.0), (0, 3, 0.0), (2, 1, 66.7)]
)
def test_success_rate(ok, bad, rate):
    assert success_rate(ok, bad) == rate


def test_fleet_entry_carries_health_and_defaults_to_no_runs(average):
    from dagwick.api import fleet_entry
    from dagwick.core import score_dag

    report = score_dag(average)
    with_health = fleet_entry("d", False, "", report, {"runs": 12, "success_rate": 91.7})
    without = fleet_entry("d", False, "", report)
    assert with_health["health"] == {"runs": 12, "success_rate": 91.7}
    assert without["health"] == {"runs": 0, "success_rate": None}


def test_health_endpoint_errors_never_leak_internals(monkeypatch):
    from fastapi import HTTPException

    from dagwick import api, health

    def boom(dag_id):
        raise RuntimeError("postgresql://user:secret@db-host/airflow is unreachable")

    monkeypatch.setattr(health, "dag_health", boom)
    monkeypatch.setattr(api, "_dag_exists", lambda dag_id: True)
    with pytest.raises(HTTPException) as err:
        api.health("any_dag")
    assert err.value.status_code == 500
    assert "secret" not in str(err.value.detail) and "ref " in str(err.value.detail)


def test_fleet_health_degrades_to_nothing_when_the_database_fails(monkeypatch):
    from dagwick import api, health

    def boom(dag_ids):
        raise RuntimeError("database is down")

    monkeypatch.setattr(health, "fleet_success", boom)
    assert api._fleet_health(["a"]) == {}
