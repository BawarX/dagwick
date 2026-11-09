"""Test checks against the DAG as Dagwick sees it: serialized, then read back."""

from __future__ import annotations

import pytest
from airflow.sdk import DAG

from dagwick import Status, score_dag

try:
    from airflow.serialization.serialized_objects import DagSerialization
except ImportError:  # older Airflow 3.x
    from airflow.serialization.serialized_objects import SerializedDAG as DagSerialization

from dagwick_pack_example.checks import team_tag


def serialized(**kwargs):
    with DAG("example", schedule=None, **kwargs) as dag:
        pass
    return DagSerialization.from_dict(DagSerialization.to_dict(dag))


@pytest.mark.parametrize(
    ("tags", "status"),
    [
        (["team:data", "finance"], Status.PASS),
        (["team:data", "team:ml"], Status.WARN),
        (["finance", "team:"], Status.FAIL),
        ([], Status.FAIL),
    ],
)
def test_team_tag(tags, status):
    assert team_tag(serialized(tags=tags)).status == status


def test_registered_with_dagwick():
    report = score_dag(serialized(tags=["team:data"]))
    (result,) = [c for c in report["checks"] if c["id"] == "example_team_tag"]
    assert result["status"] == "pass"
