"""The fuzz targets in fuzz/ run in CI on a few fixed inputs.

Atheris only runs on Linux (see .clusterfuzzlite/), so this keeps the targets
importable and correct everywhere, and turns past crashes into regression tests.
"""

from __future__ import annotations

import importlib.util
import random
from pathlib import Path

import pytest

FUZZ = Path(__file__).parent.parent / "fuzz"
DAGS = Path(__file__).parent.parent / "dev" / "dags"


def _target(name: str):
    spec = importlib.util.spec_from_file_location(name, FUZZ / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.TestOneInput


def _inputs() -> list[bytes]:
    rng = random.Random(1234)
    fixed = [
        b"",
        b"\x00",
        b"\xff\xfe",
        b"auto",
        b"off, newroz,eid,unknown",
        b"A:95, B:80, C:61, D:41",
        b"A:10, B:20",
        b"A:nan, B:inf, C:-1, D:1e400",
        b"retries:20, tags:0, x:-3, y:1.5, :, a:, :b,,",
        b"# dagwick: ack catchup, retries -- backfills\n# dagwick: ack x\n",
        b"from airflow.models import Variable\nx = Variable.get('k')\npassword = 'hunter22'\n",
        b"from airflow.operators.bash import BashOperator\n",
        b"(" * 300 + b")" * 300,
        b"def f(:\n\t\x0c'''",
    ]
    fixed += [path.read_bytes() for path in sorted(DAGS.glob("*.py"))]
    fixed += [rng.randbytes(rng.randint(1, 200)) for _ in range(50)]
    return fixed


@pytest.mark.parametrize("name", ["fuzz_settings", "fuzz_dag_source"])
def test_fuzz_target_accepts_inputs(name):
    target = _target(name)
    for data in _inputs():
        target(data)
