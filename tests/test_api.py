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
    entry = fleet_entry("demo_average_pipeline", True, "data-ai", score_dag(average))
    statuses = [i["status"] for i in entry["issues"]]
    assert statuses == sorted(statuses, key=lambda s: s != "fail")  # fails before warns
    fails = [i for i in entry["issues"] if i["status"] == "fail"]
    assert [i["gain"] for i in fails] == sorted((i["gain"] for i in fails), reverse=True)
    assert entry["is_paused"] is True and entry["owners"] == "data-ai"


def test_fleet_entry_for_perfect_dag_has_no_issues(shining):
    assert fleet_entry("demo_shining_pipeline", False, "", score_dag(shining))["issues"] == []
