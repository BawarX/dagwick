"""Fuzz target: everything Dagwick reads from a DAG file's source text.

Dagwick never runs DAG code, but it parses the file: "# dagwick: ack"
comments, hardcoded secrets, Variable.get at parse time, deprecated imports.
Any text, valid Python or not, must give each check a Finding and never
raise, and the whole report must still score from 0 to 100.

Run with Atheris (Linux), or through ClusterFuzzLite (.clusterfuzzlite/):

    python fuzz/fuzz_dag_source.py -atheris_runs=100000
"""

from __future__ import annotations

import logging
import sys
from types import SimpleNamespace

from dagwick.acknowledge import acknowledgements
from dagwick.core import Context, Finding, Status, registered_checks, score_dag
from dagwick.settings import Scoring

# A DAG with no tasks: the checks that read the DAG object return a fixed
# result, so the fuzzer spends its time on the source-based checks.
DAG = SimpleNamespace(
    dag_id="fuzz",
    fileloc="/dags/fuzz.py",
    tasks=[],
    tags=[],
    owner="",
    description=None,
    doc_md=None,
    default_args={},
    timetable=None,
    catchup=False,
    max_active_runs=1,
    dagrun_timeout=None,
)
SCORING = Scoring()
SOURCE_CHECKS = [spec for spec in registered_checks() if spec.wants_context]


def TestOneInput(data: bytes) -> None:
    source = data.decode("utf-8", errors="replace")
    dags_in_file = data[0] % 4 if data else None  # 0 to 3 DAGs in the file, or unknown
    context = Context(source=source, dags_in_file=dags_in_file)

    acks = acknowledgements(source)
    assert all(isinstance(k, str) and isinstance(v, str) for k, v in acks.items()), acks

    # Call each check directly: score_dag would turn a crash into a SKIP.
    for spec in SOURCE_CHECKS:
        finding = spec.func(DAG, context)
        assert isinstance(finding, Finding), (spec.id, finding)
        assert isinstance(finding.status, Status), (spec.id, finding)

    report = score_dag(DAG, context, SCORING)
    assert 0 <= report["score"] <= 100, report["score"]


def main() -> None:
    import atheris

    logging.disable(logging.CRITICAL)
    atheris.instrument_all()
    atheris.Setup(sys.argv, TestOneInput)
    atheris.Fuzz()


if __name__ == "__main__":
    main()
