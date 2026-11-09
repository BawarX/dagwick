from __future__ import annotations

import os
import tempfile

os.environ.setdefault("AIRFLOW_HOME", tempfile.mkdtemp(prefix="dagwick-test-"))
os.environ.setdefault("AIRFLOW__CORE__LOAD_EXAMPLES", "False")

from pathlib import Path  # noqa: E402

import pytest  # noqa: E402
from airflow.serialization.serialized_objects import DagSerialization  # noqa: E402

DAGS = Path(__file__).parent.parent / "dev" / "dags"


def _serialized(filename: str):
    try:
        from airflow.dag_processing.dagbag import DagBag
    except ImportError:  # older Airflow 3.x
        from airflow.models.dagbag import DagBag

    bag = DagBag(dag_folder=str(DAGS / filename), safe_mode=False)
    assert not bag.import_errors, bag.import_errors
    (dag,) = bag.dags.values()
    # Score what the api-server sees: the round-tripped serialized DAG.
    return DagSerialization.from_dict(DagSerialization.to_dict(dag))


@pytest.fixture(scope="session")
def shining():
    return _serialized("demo_shining_pipeline.py")


@pytest.fixture(scope="session")
def average():
    return _serialized("demo_average_pipeline.py")


@pytest.fixture(scope="session")
def dim():
    return _serialized("dim_dag.py")
