"""Fuzz target: parsing the optional [dagwick] settings from airflow.cfg.

An invalid value must be ignored (with a log line), never raise into the
Airflow api-server, and every parsed result must be usable for scoring.

Run with Atheris (Linux), or through ClusterFuzzLite (.clusterfuzzlite/):

    python fuzz/fuzz_settings.py -atheris_runs=100000
"""

from __future__ import annotations

import logging
import sys

from dagwick.core import grade_for
from dagwick.settings import (
    GRADE_LETTERS,
    SEASONAL_MOODS,
    Scoring,
    parse_disabled_checks,
    parse_grades,
    parse_seasonal_moods,
    parse_weights,
)


def TestOneInput(data: bytes) -> None:
    raw = data.decode("utf-8", errors="replace")

    moods = parse_seasonal_moods(raw)
    assert moods in ("auto", "off") or (
        isinstance(moods, list) and moods and all(m in SEASONAL_MOODS for m in moods)
    ), moods

    disabled = parse_disabled_checks(raw)
    assert all(d and d == d.strip() and "," not in d for d in disabled), disabled

    weights = parse_weights(raw)
    assert all(isinstance(w, int) and w > 0 for w in weights.values()), weights

    grades = parse_grades(raw)
    assert tuple(letter for letter, _ in grades) == GRADE_LETTERS, grades
    thresholds = [t for _, t in grades]
    assert all(0 <= t <= 100 for t in thresholds), grades
    assert all(a > b for a, b in zip(thresholds, thresholds[1:], strict=False)), grades
    assert grade_for(100.0, grades) == "A", grades

    Scoring(disabled=disabled, weights=weights, grades=grades).key  # noqa: B018


def main() -> None:
    import atheris

    logging.disable(logging.CRITICAL)  # invalid values are logged; keep the output readable
    atheris.instrument_all()
    atheris.Setup(sys.argv, TestOneInput)
    atheris.Fuzz()


if __name__ == "__main__":
    main()
