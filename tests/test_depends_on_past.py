"""depends_on_past: the pitfalls of tasks that wait for their own previous run (#109).

The rules come from running Airflow 3: after one failure, the later runs of a task with
depends_on_past stay "running" for good, with no error, because Airflow's deadlock check
skips them. With catchup=True and more than one active run, every missed interval is
stuck at once. Every DAG here goes through serialization, as the api-server reads it.
"""

from __future__ import annotations

from datetime import datetime
from textwrap import dedent

import pytest
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG, TaskGroup, task
from conftest import roundtrip

from dagwick import Context, Status
from dagwick.checks._source import lines_set_true, parse
from dagwick.checks.reliability import PAST_SETTINGS, depends_on_past
from dagwick.core import score_dag

START = datetime(2026, 1, 1)


def build(*, tasks=("extract", "load"), per_task=None, **dag_args):
    """A serialized DAG: tasks in a chain, ``per_task`` maps a task_id to its arguments."""
    dag_args.setdefault("schedule", "@daily")
    with DAG("orders", start_date=START, **dag_args) as dag:
        made = [EmptyOperator(task_id=t, **(per_task or {}).get(t, {})) for t in tasks]
        for upstream, downstream in zip(made, made[1:], strict=False):
            upstream >> downstream
    return roundtrip(dag)


def check(dag, source=None):
    return depends_on_past(dag, Context(source=source))


def test_a_dag_without_depends_on_past_is_skipped():
    result = check(build())
    assert result.status == Status.SKIP
    assert result.message == "No task uses depends_on_past."


def test_default_args_on_every_task_warns():
    result = check(build(default_args={"depends_on_past": True}))
    assert result.status == Status.WARN
    assert "default_args makes every task wait" in result.message
    assert result.items == ()  # every task: listing them adds nothing


@pytest.mark.parametrize("max_active_runs", [None, 2, 16])
def test_with_catchup_and_several_active_runs_it_fails(max_active_runs):
    dag_args = {"catchup": True, "default_args": {"depends_on_past": True}}
    if max_active_runs:
        dag_args["max_active_runs"] = max_active_runs
    result = check(build(**dag_args))
    assert result.status == Status.FAIL
    assert f"max_active_runs={max_active_runs or 16}" in result.message  # Airflow's default: 16
    assert "stuck in running" in result.message


def test_with_catchup_and_one_active_run_a_failure_holds_up_one_run():
    # Still stuck after a failure, but only the run right after it: by design, so no fail.
    dag = build(catchup=True, max_active_runs=1, default_args={"depends_on_past": True})
    assert check(dag).status == Status.WARN  # only because default_args sets it everywhere
    one_task = build(catchup=True, max_active_runs=1, per_task={"load": {"depends_on_past": True}})
    assert check(one_task).status == Status.PASS


def test_set_on_some_tasks_passes():
    result = check(build(tasks=("a", "b", "c"), per_task={"b": {"depends_on_past": True}}))
    assert result.status == Status.PASS
    assert result.message.startswith("depends_on_past is set on 1 of 3 tasks")


def test_set_on_some_tasks_with_catchup_fails_and_names_them():
    dag = build(
        tasks=("a", "b", "c"),
        catchup=True,
        per_task={"c": {"depends_on_past": True}, "b": {"depends_on_past": True}},
    )
    result = check(dag)
    assert result.status == Status.FAIL
    assert result.items == ("b", "c")  # no source: the tasks


def test_a_task_that_opts_out_of_default_args_passes():
    dag = build(
        default_args={"depends_on_past": True}, per_task={"load": {"depends_on_past": False}}
    )
    assert check(dag).status == Status.PASS


def test_wait_for_downstream_also_waits_for_the_past():
    one = build(per_task={"load": {"wait_for_downstream": True}})
    assert one.task_dict["load"].depends_on_past  # Airflow forces it
    assert check(one).status == Status.PASS
    everywhere = build(default_args={"wait_for_downstream": True})
    assert check(everywhere).status == Status.WARN


def test_mapped_tasks_and_task_groups_count():
    with DAG("orders", schedule="@daily", start_date=START, catchup=True) as dag:

        @task(depends_on_past=True)
        def load(day):
            return day

        with TaskGroup("report"):
            EmptyOperator(task_id="publish", depends_on_past=True)
        EmptyOperator(task_id="start") >> load.expand(day=[1, 2])

    serialized = roundtrip(dag)
    assert serialized.task_dict["load"].is_mapped
    result = check(serialized)
    assert result.status == Status.FAIL
    assert result.items == ("load", "report.publish")


# --- the line, from the source -----------------------------------------------


def test_finds_where_depends_on_past_is_set_to_true():
    source = dedent(
        """\
        default_args = {"owner": "x", "depends_on_past": True}
        BashOperator(task_id="a", depends_on_past=True)
        BashOperator(task_id="b", wait_for_downstream=True)
        BashOperator(task_id="c", depends_on_past=False)
        BashOperator(task_id="d", depends_on_past=FLAG)
        BashOperator(task_id="e", depends_on_past="True")
        make(**kwargs)
        {**base, 1: True}
        """
    )
    assert lines_set_true(parse(source), PAST_SETTINGS) == [
        (1, "depends_on_past"),
        (2, "depends_on_past"),
        (3, "wait_for_downstream"),
    ]


def load_file(tmp_path, body):
    """A DAG file, loaded like the DAG processor does and serialized; and its source."""
    try:
        from airflow.dag_processing.dagbag import DagBag
    except ImportError:  # older Airflow 3.x
        from airflow.models.dagbag import DagBag

    source = dedent(body)
    path = tmp_path / "orders.py"
    path.write_text(source, encoding="utf-8")
    bag = DagBag(dag_folder=str(path), safe_mode=False)
    assert not bag.import_errors, bag.import_errors
    (dag,) = bag.dags.values()
    return roundtrip(dag), source


def test_items_point_at_the_line_in_the_dag_file(tmp_path):
    dag, source = load_file(
        tmp_path,
        """\
        from datetime import datetime

        from airflow.providers.standard.operators.empty import EmptyOperator
        from airflow.sdk import DAG

        with DAG(
            "orders",
            schedule="@daily",
            start_date=datetime(2026, 1, 1),
            catchup=True,
            default_args={"owner": "data-team", "depends_on_past": True},
        ):
            EmptyOperator(task_id="extract") >> EmptyOperator(task_id="load")
        """,
    )
    result = check(dag, source)
    assert result.status == Status.FAIL
    assert result.items == ("line 11: depends_on_past=True",)


def test_the_report_fails_the_check_and_a_reason_acknowledges_it():
    dag = build(catchup=True, default_args={"depends_on_past": True})

    def result(report):
        return next(c for c in report["checks"] if c["id"] == "depends_on_past")

    flagged = result(score_dag(dag))
    assert flagged["status"] == "fail" and flagged["points"] == 0
    assert flagged["category"] == "reliability"
    assert flagged["fix"] and flagged["why"] and "max_active_runs=1" in flagged["example"]

    source = "# dagwick: ack depends_on_past -- each day applies changes to the day before\n"
    acked = result(score_dag(dag, Context(source=source)))
    assert acked["status"] == "ack"
    assert acked["ack_reason"] == "each day applies changes to the day before"
