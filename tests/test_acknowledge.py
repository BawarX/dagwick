from __future__ import annotations

from textwrap import dedent

import pytest

from dagwick import Context
from dagwick.acknowledge import acknowledgements
from dagwick.api import fleet_entry
from dagwick.core import registered_checks, score_dag

# The checks a DAG may break on purpose. Changing this list is a policy decision.
ACKNOWLEDGEABLE = {
    "catchup",
    "retries",
    "max_active_runs",
    "schedule",
    "decomposition",
    "retry_alerts",
    "failure_alerts",  # with a reason saying where failures are alerted instead
    "auto_pause",  # with a reason saying what stops the DAG when it keeps failing
}


PLAIN = "x = 1\n"


def by_id(report):
    return {c["id"]: c for c in report["checks"]}


# --- reading the comment ------------------------------------------------------


def test_reads_check_ids_and_reason():
    source = "catchup=True,  # dagwick: ack catchup -- backfills daily files\n"
    assert dict(acknowledgements(source)) == {"catchup": "backfills daily files"}


def test_several_ids_case_and_dashes():
    source = dedent(
        """
        # DagWick: ACK Retries, catchup — inserts are not idempotent
        x = 1  #dagwick:ack schedule
        """
    )
    assert dict(acknowledgements(source)) == {
        "retries": "inserts are not idempotent",
        "catchup": "inserts are not idempotent",
        "schedule": "",
    }


def test_repeated_comments_join_their_reasons():
    source = (
        "# dagwick: ack retries -- one\n# dagwick: ack retries -- two\n# dagwick: ack retries\n"
    )
    assert acknowledgements(source)["retries"] == "one; two"


@pytest.mark.parametrize(
    "source",
    [
        'doc = "# dagwick: ack retries -- inside a string"\n',
        "# dagwick: retries -- no ack keyword\n",
        "# something else entirely\n",
        'broken = """never closed\n',
    ],
)
def test_ignores_strings_other_comments_and_broken_source(source):
    assert dict(acknowledgements(source)) == {}


# --- scoring ------------------------------------------------------------------


def test_acknowledged_checks_leave_the_score_and_keep_the_reason(dim):
    source = "# dagwick: ack retries, catchup -- inserts are not idempotent\n"
    before = score_dag(dim, Context(source=PLAIN))  # source checks run in both
    after = score_dag(dim, Context(source=source))
    checks = by_id(after)

    for check_id in ("retries", "catchup"):
        c = checks[check_id]
        assert c["status"] == "ack"
        assert c["ack_reason"] == "inserts are not idempotent"
        assert c["points"] == 0 and c["fix"] == "" and c["items"] == []
        assert c["message"] == by_id(before)[check_id]["message"]  # still says what is broken

    weight = checks["retries"]["weight"] + checks["catchup"]["weight"]
    assert after["max_points"] == before["max_points"] - weight
    assert after["score"] > before["score"]
    assert after["counts"]["ack"] == 2 and before["counts"]["ack"] == 0


def test_checks_that_cannot_be_acknowledged_are_still_scored(dim):
    source = "# dagwick: ack owner, execution_timeout, naming -- we know\n"
    before = score_dag(dim, Context(source=PLAIN))  # source checks run in both
    after = score_dag(dim, Context(source=source))
    for check_id in ("owner", "execution_timeout", "naming"):
        c = by_id(after)[check_id]
        assert c["status"] == by_id(before)[check_id]["status"]
        assert c["ack_reason"] == ""
        assert "can't be acknowledged" in c["ack_note"]
    assert after["score"] == before["score"]


def test_an_acknowledgement_without_a_reason_is_ignored_and_says_what_is_needed(dim):
    source = "# dagwick: ack failure_alerts, retries\n"
    checks = by_id(score_dag(dim, Context(source=source)))
    assert checks["failure_alerts"]["status"] == "fail"
    assert "where failures are alerted instead" in checks["failure_alerts"]["ack_note"]
    assert checks["retries"]["status"] == "fail"
    assert "why this DAG breaks the check on purpose" in checks["retries"]["ack_note"]


def test_acknowledging_a_passing_check_changes_nothing(shining):
    report = score_dag(shining, Context(source="# dagwick: ack retries -- not needed\n"))
    assert report["score"] == 100.0
    c = by_id(report)["retries"]
    assert c["status"] == "pass" and c["ack_reason"] == c["ack_note"] == ""


def test_acknowledged_checks_are_not_fleet_issues(dim):
    report = score_dag(dim, Context(source="# dagwick: ack retries -- not idempotent\n"))
    entry = fleet_entry("dim", False, "", report)
    assert "retries" not in {i["id"] for i in entry["issues"]}
    assert entry["counts"]["ack"] == 1


def test_only_the_agreed_checks_can_be_acknowledged():
    allowed = {c.id for c in registered_checks() if c.acknowledgeable}
    assert allowed == ACKNOWLEDGEABLE
    hints = {c.id for c in registered_checks() if c.ack_hint}
    assert hints == {"failure_alerts", "auto_pause"}
