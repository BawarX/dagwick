from __future__ import annotations

import pytest

from dagwick import api, core, settings
from dagwick.core import Category, Finding, Status, check, grade_for, score_dag
from dagwick.settings import (
    DEFAULT_GRADES,
    Scoring,
    parse_disabled_checks,
    parse_grades,
    parse_weights,
)


class FakeDag:
    dag_id = "fake"
    tasks: list = []


@pytest.fixture
def registry(monkeypatch):
    monkeypatch.setattr(core, "_REGISTRY", {})
    monkeypatch.setattr(core, "_plugins_loaded", True)
    monkeypatch.setattr(core, "registered_checks", lambda: list(core._REGISTRY.values()))

    @check(id="a", title="A", category=Category.STRUCTURE, weight=10, fix="fa")
    def a(dag):
        return Finding(Status.PASS, "ok")

    @check(id="b", title="B", category=Category.STRUCTURE, weight=10, fix="fb")
    def b(dag):
        return Finding(Status.FAIL, "bad")


@pytest.fixture
def no_env(monkeypatch):
    for name in ("DISABLED_CHECKS", "WEIGHTS", "GRADES"):
        monkeypatch.delenv(f"AIRFLOW__DAGWICK__{name}", raising=False)


# --- parsing ---------------------------------------------------------------


@pytest.mark.parametrize("raw", [None, "", " , "])
def test_unset_values_keep_todays_behaviour(raw):
    assert parse_disabled_checks(raw) == frozenset()
    assert parse_weights(raw) == {}
    assert parse_grades(raw) == DEFAULT_GRADES


def test_disabled_checks():
    assert parse_disabled_checks("file_name, naming ,") == {"file_name", "naming"}


def test_weights():
    assert parse_weights("retries:20, tags: 2") == {"retries": 20, "tags": 2}


@pytest.mark.parametrize(
    "raw", ["retries", "retries:", "retries:0", "retries:-3", "retries:x", ":5"]
)
def test_invalid_weights_are_logged_and_ignored(raw, caplog):
    assert parse_weights(f"{raw}, tags:2") == {"tags": 2}
    assert "dagwick: ignoring" in caplog.text


def test_partial_grades_keep_the_other_defaults():
    assert parse_grades("a:95, D:35.5") == (("A", 95), ("B", 75), ("C", 60), ("D", 35.5))


@pytest.mark.parametrize(
    "raw",
    ["A:70", "D:80", "A:101", "D:-1", "B:75, C:75"],
)
def test_grades_out_of_order_or_range_fall_back_to_defaults(raw, caplog):
    assert parse_grades(raw) == DEFAULT_GRADES
    assert "using the defaults" in caplog.text


def test_unknown_or_non_numeric_grade_entries_are_skipped(caplog):
    assert parse_grades("E:30, A:x, B:80") == (("A", 90), ("B", 80), ("C", 60), ("D", 40))
    assert "'E'" in caplog.text and "not a number" in caplog.text


def test_configured_grades_drive_grade_for():
    grades = parse_grades("A:95, B:85, C:70, D:50")
    assert grade_for(94.9, grades) == "B"
    assert grade_for(50, grades) == "D"
    assert grade_for(49.9, grades) == "F"


def test_reads_airflow_config(monkeypatch):
    monkeypatch.setenv("AIRFLOW__DAGWICK__DISABLED_CHECKS", "naming")
    monkeypatch.setenv("AIRFLOW__DAGWICK__WEIGHTS", "retries:20")
    monkeypatch.setenv("AIRFLOW__DAGWICK__GRADES", "A:95")
    s = settings.scoring()
    assert s.disabled == {"naming"}
    assert s.weights == {"retries": 20}
    assert s.grades[0] == ("A", 95)


def test_unreadable_config_falls_back(monkeypatch, caplog):
    from airflow.configuration import conf

    def boom(*args, **kwargs):
        raise RuntimeError("broken config")

    monkeypatch.setattr(conf, "get", boom)
    assert settings.scoring() == Scoring()
    assert "could not read [dagwick]" in caplog.text


def test_key_changes_with_settings():
    assert Scoring().key != Scoring(weights={"a": 1}).key
    assert Scoring().key != Scoring(disabled=frozenset({"a"})).key
    assert Scoring().key != Scoring(grades=parse_grades("A:95")).key


# --- scoring ---------------------------------------------------------------


def test_default_scoring(registry, no_env):
    report = score_dag(FakeDag())
    assert (report["score"], report["grade"], report["max_points"]) == (50.0, "D", 20)


def test_disabled_check_leaves_the_score(registry):
    report = score_dag(FakeDag(), scoring=Scoring(disabled=frozenset({"b"})))
    assert [c["id"] for c in report["checks"]] == ["a"]
    assert (report["score"], report["grade"]) == (100.0, "A")


def test_weight_override(registry):
    report = score_dag(FakeDag(), scoring=Scoring(weights={"a": 30}))
    assert report["max_points"] == 40
    assert report["score"] == 75.0
    assert {c["id"]: c["weight"] for c in report["checks"]} == {"a": 30, "b": 10}


def test_grade_thresholds(registry):
    report = score_dag(FakeDag(), scoring=Scoring(grades=parse_grades("D:55")))
    assert report["grade"] == "F"


def test_settings_come_from_airflow_config(registry, no_env, monkeypatch):
    monkeypatch.setenv("AIRFLOW__DAGWICK__DISABLED_CHECKS", "b")
    assert score_dag(FakeDag())["score"] == 100.0


def test_unknown_check_ids_are_logged_not_fatal(registry, monkeypatch, caplog):
    monkeypatch.setattr(core, "_warned_unknown", set())
    report = score_dag(
        FakeDag(), scoring=Scoring(disabled=frozenset({"nope"}), weights={"also_nope": 3})
    )
    assert report["score"] == 50.0
    assert "also_nope" in caplog.text and "nope" in caplog.text


def test_checks_endpoint_shows_effective_weights(registry, no_env, monkeypatch):
    monkeypatch.setattr(api, "registered_checks", lambda: list(core._REGISTRY.values()))
    monkeypatch.setenv("AIRFLOW__DAGWICK__DISABLED_CHECKS", "b")
    monkeypatch.setenv("AIRFLOW__DAGWICK__WEIGHTS", "a:7")
    by_id = {c["id"]: c for c in api.checks()}
    assert by_id["a"]["weight"] == 7 and by_id["a"]["default_weight"] == 10
    assert by_id["a"]["enabled"] is True
    assert by_id["b"]["enabled"] is False


def test_real_dag_with_settings(dim, no_env, monkeypatch):
    before = score_dag(dim)
    failing = [c["id"] for c in before["checks"] if c["status"] == "fail"]
    monkeypatch.setenv("AIRFLOW__DAGWICK__DISABLED_CHECKS", ",".join(failing))
    after = score_dag(dim)
    assert after["score"] > before["score"]
    assert not {c["id"] for c in after["checks"]} & set(failing)
