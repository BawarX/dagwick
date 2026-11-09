from __future__ import annotations

from fastapi.testclient import TestClient

from dagwick.api import _ScoreCache, app, fleet_entry
from dagwick.core import score_dag

client = TestClient(app)


def test_static_serves_only_allowlisted_files():
    assert client.get("/static/dagwick.js").status_code == 200
    assert client.get("/static/icon.svg").headers["content-type"].startswith("image/svg")
    assert client.get("/static/..%2Fapi.py").status_code == 404
    assert client.get("/static/api.py").status_code == 404


def test_cache_invalidates_when_dag_hash_changes():
    cache = _ScoreCache(max_entries=2)
    cache.put("a", "h1", {"score": 1})
    assert cache.get("a", "h1") == {"score": 1}
    assert cache.get("a", "h2") is None  # DAG changed: re-score


def test_cache_is_bounded():
    cache = _ScoreCache(max_entries=2)
    for i in range(3):
        cache.put(f"d{i}", "h", {"i": i})
    assert cache.get("d0", "h") is None
    assert cache.get("d2", "h") == {"i": 2}


def test_fleet_entry_lists_issues_worst_first(average):
    entry = fleet_entry("demo_average_pipeline", True, "data-team", score_dag(average))
    statuses = [i["status"] for i in entry["issues"]]
    assert statuses == sorted(statuses, key=lambda s: s != "fail")  # fails before warns
    fails = [i for i in entry["issues"] if i["status"] == "fail"]
    assert [i["gain"] for i in fails] == sorted((i["gain"] for i in fails), reverse=True)
    assert entry["is_paused"] is True and entry["owners"] == "data-team"


def test_fleet_entry_for_perfect_dag_has_no_issues(shining):
    assert fleet_entry("demo_shining_pipeline", False, "", score_dag(shining))["issues"] == []


def test_score_unknown_dag_is_404(monkeypatch):
    import pytest
    from fastapi import HTTPException

    from dagwick import api

    monkeypatch.setattr(api, "_score_by_id", lambda dag_id: None)
    with pytest.raises(HTTPException) as err:
        api.score("missing_dag")
    assert err.value.status_code == 404


def test_score_errors_never_leak_internals(monkeypatch):
    import pytest
    from fastapi import HTTPException

    from dagwick import api

    def boom(dag_id):
        raise RuntimeError("postgresql://user:secret@db-host/airflow is unreachable")

    monkeypatch.setattr(api, "_score_by_id", boom)
    with pytest.raises(HTTPException) as err:
        api.score("any_dag")
    assert err.value.status_code == 500
    detail = str(err.value.detail)
    assert "secret" not in detail and "db-host" not in detail and "Traceback" not in detail
    assert "ref " in detail  # a reference id the operator can find in the logs


def test_unhandled_errors_return_generic_json():
    import asyncio
    import json

    from dagwick.api import _unhandled

    response = asyncio.run(_unhandled(None, ValueError("internal path /opt/airflow/x.py")))
    body = json.loads(response.body)
    assert response.status_code == 500
    assert "/opt/airflow" not in body["detail"]


def test_score_by_id_uses_cache(monkeypatch, shining):
    from types import SimpleNamespace

    from airflow.models import serialized_dag

    from dagwick import api

    calls = []
    fake = SimpleNamespace(dag_hash="h1", dag=shining)
    monkeypatch.setattr(
        serialized_dag.SerializedDagModel, "get", lambda dag_id: calls.append(1) or fake
    )
    monkeypatch.setattr(api, "_cache", api._ScoreCache())
    monkeypatch.setattr(api, "_dags_per_file", lambda filelocs=None: {shining.fileloc: 1})
    first = api._score_by_id("demo_shining_pipeline")
    second = api._score_by_id("demo_shining_pipeline")
    assert first is second and first["grade"] == "A"
    monkeypatch.setattr(serialized_dag.SerializedDagModel, "get", lambda dag_id: None)
    assert api._score_by_id("gone") is None


def test_score_by_id_rescores_when_the_files_dag_count_changes(monkeypatch, shining):
    from types import SimpleNamespace

    from airflow.models import serialized_dag

    from dagwick import api

    fake = SimpleNamespace(dag_hash="h1", dag=shining)
    monkeypatch.setattr(serialized_dag.SerializedDagModel, "get", lambda dag_id: fake)
    monkeypatch.setattr(api, "_cache", api._ScoreCache())
    single = api._score_by_id("demo_shining_pipeline", dags_in_file=1)
    factory = api._score_by_id("demo_shining_pipeline", dags_in_file=4)
    status = {c["id"]: c["status"] for c in factory["checks"]}
    assert single is not factory and status["file_name"] == "skip"
