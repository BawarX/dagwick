"""Explaining checks: dagwick explain, the generated check reference, and `why` in reports."""

from __future__ import annotations

import io
import subprocess
import sys
from pathlib import Path

import pytest

from dagwick import api, core
from dagwick.cli import OK, USAGE_ERROR, main
from dagwick.core import BUILTIN_PACK, Category, Finding, Status, check, score_dag
from dagwick.explain import (
    REFERENCE_END,
    REFERENCE_START,
    docs_url,
    explain_text,
    markdown_reference,
    replace_reference,
)

DOCS = Path(__file__).resolve().parent.parent / "docs" / "checks.md"


def builtin_checks():
    return [s for s in core.registered_checks() if s.pack == BUILTIN_PACK]


def run(*args):
    out, err = io.StringIO(), io.StringIO()
    code = main(list(args), out=out, err=err)
    return code, out.getvalue(), err.getvalue()


@pytest.fixture
def isolated_registry(monkeypatch):
    monkeypatch.setattr(core, "_REGISTRY", {})
    monkeypatch.setattr(core, "_plugins_loaded", True)
    monkeypatch.setattr(core, "registered_checks", lambda: list(core._REGISTRY.values()))


@pytest.mark.parametrize("spec", builtin_checks(), ids=lambda s: s.id)
def test_every_builtin_check_is_explained(spec):
    assert spec.why, f"{spec.id}: add why= to its @check"
    assert spec.bad, f"{spec.id}: add bad= (code that breaks the check)"
    if spec.acknowledgeable:
        assert spec.ack_when, f"{spec.id}: add ack_when= (when breaking it is fine)"


def test_docs_reference_is_up_to_date():
    current = DOCS.read_text(encoding="utf-8")
    expected = replace_reference(current, markdown_reference(core.registered_checks()))
    assert current == expected, "Run `uv run python scripts/check_docs.py` and commit the docs"


def test_docs_reference_has_a_section_per_builtin_check():
    reference = DOCS.read_text(encoding="utf-8").split(REFERENCE_START)[1].split(REFERENCE_END)[0]
    headings = {line[4:] for line in reference.splitlines() if line.startswith("### ")}
    assert headings == {s.id for s in builtin_checks()}


def test_docs_state_how_many_checks_there_are():
    # Two pull requests that each add a check both turn "20" into "21", and git merges
    # that without a conflict. This makes the second one update the count.
    count, categories = len(builtin_checks()), len(Category)
    readme = (DOCS.parent.parent / "README.md").read_text(encoding="utf-8")
    linting = (DOCS.parent / "linting.md").read_text(encoding="utf-8")
    assert f"{count} checks in {categories} categories" in readme
    assert f"The same {count} checks run" in linting


def test_replace_reference_keeps_the_rest_of_the_document():
    doc = f"intro\n{REFERENCE_START}\nold\n{REFERENCE_END}\noutro\n"
    expected = f"intro\n{REFERENCE_START}\n\nnew\n\n{REFERENCE_END}\noutro\n"
    assert replace_reference(doc, "new\n") == expected


def test_explain_lists_every_check():
    code, out, _ = run("explain")
    assert code == OK
    assert out.startswith("CHECK")
    for spec in builtin_checks():
        assert spec.id in out
    assert "dagwick explain <check>" in out


def test_explain_one_check():
    code, out, _ = run("explain", "retries")
    assert code == OK
    assert out.startswith("retries: Tasks retry on failure\n")
    for heading in ("Why it matters", "Bad", "Good", "How to fix", "When it's fine to acknowledge"):
        assert f"\n{heading}\n" in out
    assert "# dagwick: ack retries -- <reason>" in out
    assert out.rstrip().endswith("docs/checks.md#retries")


def test_explain_ignores_case_and_spaces():
    assert run("explain", " Retries ")[0] == OK


def test_explain_a_check_that_cannot_be_acknowledged():
    _, out, _ = run("explain", "hardcoded_secrets")
    assert "Never: this check can't be acknowledged." in out
    assert "# dagwick: ack" not in out


def test_explain_includes_the_ack_hint():
    _, out, _ = run("explain", "failure_alerts")
    assert "The reason must say where failures are alerted instead" in " ".join(out.split())


def test_explain_unknown_check_suggests_close_ids():
    code, out, err = run("explain", "retry")
    assert code == USAGE_ERROR
    assert out == ""
    assert "unknown check 'retry'" in err and "Did you mean: retries?" in err


def test_explain_unknown_check_without_suggestion():
    code, _, err = run("explain", "zzzz")
    assert code == USAGE_ERROR
    assert "Did you mean" not in err


def test_explain_does_not_need_airflow():
    script = (
        "import io, sys\n"
        "from dagwick.cli import main\n"
        "main(['explain', 'retries'], out=io.StringIO())\n"
        "main(['explain'], out=io.StringIO())\n"
        "print(sorted(m for m in sys.modules if m == 'airflow' or m.startswith('airflow.')))\n"
    )
    result = subprocess.run(
        [sys.executable, "-c", script], capture_output=True, text=True, check=True
    )
    assert result.stdout.strip() == "[]"


def test_pack_check_is_explained_without_a_docs_link(isolated_registry):
    @check(
        id="acme_rule",
        title="Acme rule",
        category=Category.OWNERSHIP,
        weight=2,
        fix="Do the acme thing.",
        why="Acme needs it.",
    )
    def acme_rule(dag):
        return Finding(Status.PASS, "ok")

    spec = core._REGISTRY["acme_rule"]
    object.__setattr__(spec, "pack", "acme-checks")
    assert docs_url(spec) is None
    text = explain_text(spec)
    assert "from the check pack acme-checks" in text
    assert "Acme needs it." in text
    assert "More:" not in text
    assert "### acme_rule" not in markdown_reference([spec])


def test_check_without_explanation_still_explains(isolated_registry):
    @check(id="bare", title="Bare", category=Category.STRUCTURE, weight=1, fix="Fix it.")
    def bare(dag):
        return Finding(Status.PASS, "ok")

    text = explain_text(core._REGISTRY["bare"])
    assert "How to fix\n  Fix it." in text
    assert "Why it matters" not in text and "\nBad\n" not in text


class FakeDag:
    dag_id = "fake"
    tasks: list = []


def test_report_includes_why_only_when_the_check_needs_work(isolated_registry):
    @check(id="ok", title="Ok", category=Category.STRUCTURE, weight=1, fix="f", why="w-ok")
    def ok(dag):
        return Finding(Status.PASS, "fine")

    @check(id="bad", title="Bad", category=Category.STRUCTURE, weight=1, fix="f", why="w-bad")
    def bad(dag):
        return Finding(Status.FAIL, "broken")

    by_id = {c["id"]: c for c in score_dag(FakeDag())["checks"]}
    assert by_id["ok"]["why"] == ""
    assert by_id["bad"]["why"] == "w-bad"


def test_checks_endpoint_includes_why():
    by_id = {c["id"]: c for c in api.checks()}
    assert by_id["retries"]["why"].startswith("Most task failures are transient")
