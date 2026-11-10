from __future__ import annotations

import threading
from typing import Any

from dagwick import settings
from dagwick.core import Context, score_dag

MAX_VERSIONS = 20
RANK = {"fail": 0, "warn": 1, "pass": 2, "ack": 2}


class _VersionCache:
    def __init__(self, max_entries: int = 2000) -> None:
        self._data: dict[str, dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._max = max_entries

    def get(self, key: str) -> dict[str, Any] | None:
        with self._lock:
            return self._data.get(key)

    def put(self, key: str, report: dict[str, Any]) -> None:
        with self._lock:
            if key not in self._data and len(self._data) >= self._max:
                self._data.pop(next(iter(self._data)))
            self._data[key] = report


_cache = _VersionCache()


def changes(before: dict[str, Any], after: dict[str, Any]) -> dict[str, list[str]]:
    old = {c["id"]: c for c in before["checks"]}
    better, worse = [], []
    for check in after["checks"]:
        prev = old.get(check["id"])
        if prev is None or check["status"] not in RANK or prev["status"] not in RANK:
            continue
        delta = RANK[check["status"]] - RANK[prev["status"]]
        if delta > 0:
            better.append(check["title"])
        elif delta < 0:
            worse.append(check["title"])
    return {"better": better, "worse": worse}


def timeline(versions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    points = []
    previous = None
    for v in versions:
        report = v["report"]
        diff = changes(previous, report) if previous else {"better": [], "worse": []}
        points.append(
            {
                "version": v["version"],
                "created_at": v["created_at"],
                "score": report["score"],
                "grade": report["grade"],
                **diff,
            }
        )
        previous = report
    return points


def _score_version(
    dag_id: str, version_id: Any, session: Any, fingerprint: tuple[Any, Any] = (None, None)
) -> dict[str, Any] | None:
    from airflow.models.dagcode import DagCode
    from airflow.models.serialized_dag import SerializedDagModel
    from sqlalchemy import select

    # Airflow rewrites the newest version in place until the DAG runs again, so the
    # version id alone is not a stable key: include the DAG and source hashes.
    scoring = settings.scoring()
    key = f"{dag_id}:{version_id}:{fingerprint[0]}:{fingerprint[1]}:{scoring.key}"
    cached = _cache.get(key)
    if cached is not None:
        return cached
    row = session.scalars(
        select(SerializedDagModel).where(SerializedDagModel.dag_version_id == version_id).limit(1)
    ).first()
    if row is None:
        return None
    source = session.scalars(
        select(DagCode.source_code).where(DagCode.dag_version_id == version_id).limit(1)
    ).first()
    context = Context(source=source)
    report = score_dag(row.dag, context, scoring)
    _cache.put(key, report)
    return report


def _fingerprints(ids: list[Any], session: Any) -> dict[Any, tuple[Any, Any]]:
    """(serialized DAG hash, source hash) per version id, in two queries."""
    from airflow.models.dagcode import DagCode
    from airflow.models.serialized_dag import SerializedDagModel
    from sqlalchemy import select

    dag_hashes = dict(
        session.execute(
            select(SerializedDagModel.dag_version_id, SerializedDagModel.dag_hash).where(
                SerializedDagModel.dag_version_id.in_(ids)
            )
        ).all()
    )
    source_hashes = dict(
        session.execute(
            select(DagCode.dag_version_id, DagCode.source_code_hash).where(
                DagCode.dag_version_id.in_(ids)
            )
        ).all()
    )
    return {i: (dag_hashes.get(i), source_hashes.get(i)) for i in ids}


def dag_history(dag_id: str) -> dict[str, Any]:
    from airflow.models.dag_version import DagVersion
    from airflow.utils.session import create_session
    from sqlalchemy import select

    with create_session() as session:
        rows = session.execute(
            select(DagVersion.id, DagVersion.version_number, DagVersion.created_at)
            .where(DagVersion.dag_id == dag_id)
            .order_by(DagVersion.version_number.desc())
            .limit(MAX_VERSIONS + 1)
        ).all()
        truncated = len(rows) > MAX_VERSIONS
        rows = rows[:MAX_VERSIONS]
        fingerprints = _fingerprints([r[0] for r in rows], session)
        versions = []
        for version_id, number, created_at in reversed(rows):
            report = _score_version(dag_id, version_id, session, fingerprints[version_id])
            if report is not None:
                versions.append(
                    {
                        "version": number,
                        "created_at": created_at.isoformat() if created_at else None,
                        "report": report,
                    }
                )
    return {"versions": timeline(versions), "truncated": truncated}
