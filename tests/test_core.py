from __future__ import annotations

import pytest

from dagwick import core
from dagwick.core import Category, Finding, Status, check, grade_for, score_dag


class FakeDag:
    dag_id = "fake"
    tasks: list = []


@pytest.fixture
def isolated_registry(monkeypatch):
    monkeypatch.setattr(core, "_REGISTRY", {})
    monkeypatch.setattr(core, "_plugins_loaded", True)
    monkeypatch.setattr(core, "registered_checks", lambda: list(core._REGISTRY.values()))


@pytest.mark.parametrize(
    ("score", "grade"),
    [(100, "A"), (90, "A"), (89.9, "B"), (75, "B"), (60, "C"), (40, "D"), (39.9, "F"), (0, "F")],
)
def test_grade_boundaries(score, grade):
    assert grade_for(score) == grade


def test_weights_warn_is_half_and_skip_excluded(isolated_registry):
    @check(id="a", title="A", category=Category.STRUCTURE, weight=10, fix="fa")
    def a(dag):
        return Finding(Status.PASS, "ok")

    @check(id="b", title="B", category=Category.STRUCTURE, weight=10, fix="fb")
    def b(dag):
        return Finding(Status.WARN, "meh")

    @check(id="c", title="C", category=Category.STRUCTURE, weight=50, fix="fc")
    def c(dag):
        return Finding(Status.SKIP, "n/a")

    report = score_dag(FakeDag())
    assert report["max_points"] == 20
    assert report["points"] == 15
    assert report["score"] == 75.0
    fixes = {r["id"]: r["fix"] for r in report["checks"]}
    assert fixes == {"a": "", "b": "fb", "c": ""}


def test_crashing_check_is_skipped_not_fatal(isolated_registry):
    @check(id="boom", title="Boom", category=Category.STRUCTURE, weight=5, fix="")
    def boom(dag):
        raise RuntimeError("bad")

    @check(id="ok", title="Ok", category=Category.STRUCTURE, weight=5, fix="")
    def ok(dag):
        return Finding(Status.PASS, "fine")

    report = score_dag(FakeDag())
    statuses = {r["id"]: r["status"] for r in report["checks"]}
    assert statuses == {"boom": "skip", "ok": "pass"}
    assert report["score"] == 100.0


def test_reregistering_overrides(isolated_registry):
    @check(id="x", title="first", category=Category.STRUCTURE, weight=5, fix="")
    def first(dag):
        return Finding(Status.FAIL, "")

    @check(id="x", title="second", category=Category.STRUCTURE, weight=5, fix="")
    def second(dag):
        return Finding(Status.PASS, "")

    assert [c["title"] for c in score_dag(FakeDag())["checks"]] == ["second"]


def test_rejects_non_positive_weight():
    with pytest.raises(ValueError):
        check(id="w", title="w", category=Category.STRUCTURE, weight=0, fix="")


def test_checks_may_ask_for_context(isolated_registry):
    from dagwick.core import Context

    seen = {}

    @check(id="ctx", title="Ctx", category=Category.STRUCTURE, weight=1, fix="")
    def ctx(dag, context):
        seen["n"] = context.dags_in_file
        return Finding(Status.PASS, "")

    @check(id="plain", title="Plain", category=Category.STRUCTURE, weight=1, fix="")
    def plain(dag):  # old-style checks keep working
        return Finding(Status.PASS, "")

    score_dag(FakeDag(), Context(dags_in_file=3))
    assert seen["n"] == 3
    score_dag(FakeDag())
    assert seen["n"] is None
