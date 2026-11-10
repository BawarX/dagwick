from __future__ import annotations

import pytest

from dagwick.history import _VersionCache, changes, timeline


def report(score, **statuses):
    return {
        "score": score,
        "grade": "A" if score >= 90 else "D",
        "checks": [{"id": k, "title": k.title(), "status": v} for k, v in statuses.items()],
    }


def test_changes_split_into_better_and_worse():
    before = report(50, retries="fail", docs="pass", catchup="warn", owner="warn")
    after = report(60, retries="pass", docs="warn", catchup="ack", owner="warn")
    assert changes(before, after) == {"better": ["Retries", "Catchup"], "worse": ["Docs"]}


def test_skips_and_new_or_removed_checks_are_not_changes():
    before = report(50, retries="skip", gone="fail")
    after = report(50, retries="fail", added="pass")
    assert changes(before, after) == {"better": [], "worse": []}


def test_timeline_compares_each_version_with_the_one_before():
    versions = [
        {
            "version": 1,
            "created_at": "2026-11-01T00:00:00+00:00",
            "report": report(32, retries="fail"),
        },
        {
            "version": 2,
            "created_at": "2026-11-02T00:00:00+00:00",
            "report": report(45, retries="pass"),
        },
        {"version": 3, "created_at": None, "report": report(40, retries="fail")},
    ]
    points = timeline(versions)
    assert [(p["version"], p["score"], p["better"], p["worse"]) for p in points] == [
        (1, 32, [], []),
        (2, 45, ["Retries"], []),
        (3, 40, [], ["Retries"]),
    ]
    assert points[0]["created_at"] == "2026-11-01T00:00:00+00:00"


def test_timeline_of_nothing():
    assert timeline([]) == []


def test_version_cache_is_bounded():
    cache = _VersionCache(max_entries=2)
    for i in range(3):
        cache.put(f"v{i}", {"i": i})
    assert cache.get("v0") is None
    assert cache.get("v2") == {"i": 2}


def test_history_endpoint_errors_never_leak_internals(monkeypatch):
    from fastapi import HTTPException

    from dagwick import api, history

    def boom(dag_id):
        raise RuntimeError("postgresql://user:secret@db-host/airflow is unreachable")

    monkeypatch.setattr(history, "dag_history", boom)
    with pytest.raises(HTTPException) as err:
        api.history("any_dag")
    assert err.value.status_code == 500
    assert "secret" not in str(err.value.detail) and "ref " in str(err.value.detail)


class _Result:
    def __init__(self, rows):
        self._rows = rows

    def all(self):
        return self._rows

    def first(self):
        return self._rows[0] if self._rows else None


class FakeSession:
    def __init__(self, versions, serialized, sources):
        self.versions = versions
        self.serialized = serialized
        self.sources = sources
        self.serialized_reads = 0
        self.dag_hashes = {v: f"dag-{v}" for v in serialized}
        self.source_hashes = {v: f"src-{v}" for v in sources}

    def execute(self, query):
        sql = str(query)
        if "serialized_dag" in sql:
            return _Result(list(self.dag_hashes.items()))
        if "dag_code" in sql:
            return _Result(list(self.source_hashes.items()))
        return _Result(self.versions)

    def scalars(self, query):
        version_id = query.whereclause.right.value
        if "dag_code" in str(query):
            return _Result([self.sources[version_id]] if version_id in self.sources else [])
        self.serialized_reads += 1
        row = self.serialized.get(version_id)
        return _Result([row] if row else [])


def fake_db(monkeypatch, session):
    from contextlib import contextmanager

    from airflow.utils import session as airflow_session

    from dagwick import history

    @contextmanager
    def create_session():
        yield session

    monkeypatch.setattr(airflow_session, "create_session", create_session)
    monkeypatch.setattr(history, "_cache", history._VersionCache())


def test_dag_history_scores_each_stored_version_oldest_first(monkeypatch, shining, dim):
    from datetime import datetime, timezone
    from types import SimpleNamespace

    from dagwick.history import dag_history

    when = datetime(2026, 11, 1, tzinfo=timezone.utc)
    session = FakeSession(
        versions=[("v3", 3, when), ("v2", 2, when), ("v1", 1, None)],
        serialized={"v1": SimpleNamespace(dag=dim), "v3": SimpleNamespace(dag=shining)},
        sources={"v3": "x = 1\n"},
    )
    fake_db(monkeypatch, session)
    result = dag_history("demo")
    assert result["truncated"] is False
    assert [p["version"] for p in result["versions"]] == [1, 3]
    first, last = result["versions"]
    assert first["grade"] == "F" and first["created_at"] is None
    assert last["created_at"] == when.isoformat()
    assert last["score"] > first["score"] and "Tasks retry on failure" in last["better"]

    reads = session.serialized_reads
    dag_history("demo")
    assert session.serialized_reads == reads + 1


def test_dag_history_caps_the_number_of_versions(monkeypatch, shining):
    from types import SimpleNamespace

    from dagwick.history import MAX_VERSIONS, dag_history

    rows = [(f"v{n}", n, None) for n in range(MAX_VERSIONS + 1, 0, -1)]
    session = FakeSession(rows, {r[0]: SimpleNamespace(dag=shining) for r in rows}, {})
    fake_db(monkeypatch, session)
    result = dag_history("demo")
    assert result["truncated"] is True
    assert len(result["versions"]) == MAX_VERSIONS
    assert result["versions"][-1]["version"] == MAX_VERSIONS + 1


def test_a_version_rewritten_in_place_is_scored_again(monkeypatch, shining, dim):
    """Airflow updates the newest version in place until the DAG runs again."""
    from types import SimpleNamespace

    from dagwick.history import dag_history

    session = FakeSession([("v1", 1, None)], {"v1": SimpleNamespace(dag=dim)}, {})
    fake_db(monkeypatch, session)
    assert dag_history("demo")["versions"][0]["grade"] == "F"

    session.serialized["v1"] = SimpleNamespace(dag=shining)  # same version, new code
    session.dag_hashes["v1"] = "dag-v1-edited"
    assert dag_history("demo")["versions"][0]["score"] == 100.0

    reads = session.serialized_reads
    dag_history("demo")  # unchanged since: served from the cache
    assert session.serialized_reads == reads
