from __future__ import annotations

import csv
import importlib.util
import io
import json
from pathlib import Path

import pytest

_path = Path(__file__).parents[1] / "scripts" / "fleet_review.py"
_spec = importlib.util.spec_from_file_location("fleet_review", _path)
fleet_review = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fleet_review)

FLEET = {
    "truncated": False,
    "dags": [
        {
            "dag_id": "ingest",
            "owners": "data-team, ops",
            "score": 72.5,
            "grade": "C",
            "issues": [
                {"id": "retries", "title": "Tasks retry", "status": "fail", "gain": 15.0},
                {"id": "tags", "title": "=HYPERLINK()", "status": "warn", "gain": 1.5},
            ],
        },
        {"dag_id": "clean", "owners": "airflow", "score": 100, "grade": "A", "issues": []},
        {
            "dag_id": "report",
            "owners": "finance",
            "score": 40,
            "grade": "D",
            "issues": [{"id": "docs", "title": "Has docs", "status": "fail", "gain": 5}],
        },
    ],
}


def test_time_fleet_sends_token_and_times_each_run():
    calls = []

    def fetch(url, headers):
        calls.append((url, headers))
        return json.dumps(FLEET).encode()

    ticks = iter([0.0, 2.0, 10.0, 10.5])
    durations, body = fleet_review.time_fleet(
        "https://airflow.example.com/", "tok", runs=2, fetch=fetch, clock=lambda: next(ticks)
    )
    assert durations == [2.0, 0.5]
    assert body == FLEET
    assert calls[0][0] == "https://airflow.example.com/dagwick/api/fleet"
    assert calls[0][1]["Authorization"] == "Bearer tok"


def test_time_fleet_without_token_sends_no_auth_header():
    seen = {}

    def fetch(url, headers):
        seen.update(headers)
        return b'{"dags": []}'

    fleet_review.time_fleet("http://localhost:8080", None, runs=0, fetch=fetch)
    assert "Authorization" not in seen


def test_fetch_rejects_other_schemes():
    with pytest.raises(ValueError):
        fleet_review._fetch("file:///etc/passwd", {})


def test_timing_summary():
    text = fleet_review.timing_summary([3.21, 0.4], {"dags": [{}, {}], "truncated": True})
    assert "DAGs on the fleet page: 2 (truncated)" in text
    assert "run 1 (cold): 3.21 s" in text
    assert "run 2 (warm): 0.40 s" in text


def test_sheet_has_one_row_per_finding_and_defuses_formulas():
    out = io.StringIO()
    assert fleet_review.write_sheet(FLEET, out) == 3
    rows = list(csv.reader(io.StringIO(out.getvalue())))
    assert rows[0] == list(fleet_review.SHEET_COLUMNS)
    assert rows[1][:8] == [
        "ingest",
        "data-team, ops",
        "72.5",
        "C",
        "retries",
        "Tasks retry",
        "fail",
        "15.0",
    ]
    assert rows[2][5] == "'=HYPERLINK()"
    assert rows[1][8:] == ["", ""]


def test_sheet_filters_by_owner():
    out = io.StringIO()
    assert fleet_review.write_sheet(FLEET, out, owner="OPS") == 2


def test_main_sheet(tmp_path, capsys):
    path = tmp_path / "fleet.json"
    path.write_text(json.dumps(FLEET))
    assert fleet_review.main(["sheet", str(path), "--owner", "finance"]) == 0
    captured = capsys.readouterr()
    assert "report,finance" in captured.out
    assert "1 findings" in captured.err


def test_main_time_saves_json(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("AIRFLOW_TOKEN", "secret-token")
    out = tmp_path / "fleet.json"
    monkeypatch.setattr(
        fleet_review,
        "time_fleet",
        lambda url, token, runs: ([1.0], FLEET) if token == "secret-token" else ([], {}),
    )
    assert fleet_review.main(["time", "https://a.example", "--runs", "1", "--save", str(out)]) == 0
    assert json.loads(out.read_text()) == FLEET
    assert "secret-token" not in capsys.readouterr().out
