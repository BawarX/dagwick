"""dynamic_start_date: a start_date that reads the clock, so it moves on every parse (#108).

The serialized DAG only keeps a timestamp, so the check reads the DAG file. The last
tests load real DAG files and serialize them, as the api-server sees them.
"""

from __future__ import annotations

from datetime import datetime
from textwrap import dedent

import pytest
from conftest import roundtrip

from dagwick import Context, Status
from dagwick.checks._source import moving_start_dates, parse
from dagwick.checks.reliability import dynamic_start_date
from dagwick.core import score_dag


def found(source):
    return moving_start_dates(parse(dedent(source)))


@pytest.mark.parametrize(
    ("source", "expected"),
    [
        pytest.param(
            'DAG("a", start_date=datetime.now())',
            [(1, "datetime.now()")],
            id="on-the-dag",
        ),
        pytest.param(
            """
            @dag(schedule="@daily", start_date=pendulum.now("UTC"))
            def a():
                pass
            """,
            [(2, "pendulum.now()")],
            id="dag-decorator",
        ),
        pytest.param(
            'DAG("a", default_args={"owner": "x", "start_date": datetime.now()})',
            [(1, "datetime.now()")],
            id="default-args-inline",
        ),
        pytest.param(
            """
            default_args = {
                "owner": "x",
                "start_date": datetime.now() - timedelta(days=1),
            }
            DAG("a", default_args=default_args)
            """,
            [(4, "datetime.now()")],
            id="default-args-variable",
        ),
        pytest.param(
            'args = {"start_date": date.today()}\nDAG("a", default_args=args)',
            [(1, "date.today()")],
            id="default-args-any-name",
        ),
        pytest.param(
            'DAG("a", default_args=dict(owner="x", start_date=pendulum.today()))',
            [(1, "pendulum.today()")],
            id="default-args-dict-call",
        ),
        pytest.param(
            'default_args = {"owner": "x"}\ndefault_args["start_date"] = datetime.utcnow()',
            [(2, "datetime.utcnow()")],
            id="default-args-item",
        ),
        pytest.param(
            'BASE = {"start_date": days_ago(1)}\nDAG("a", default_args={**BASE, "owner": "x"})',
            [(1, "days_ago()")],
            id="default-args-spread",
        ),
        pytest.param(
            'BASE = {"owner": "x"}\n'
            'DAG("a", default_args=BASE | {"start_date": pendulum.yesterday()})',
            [(2, "pendulum.yesterday()")],
            id="default-args-merge",
        ),
        pytest.param(
            'START = pendulum.today("UTC").add(days=-1)\nDAG("a", start_date=START)',
            [(2, "START (pendulum.today() on line 1)")],
            id="variable",
        ),
        pytest.param(
            'NOW = datetime.now()\nSTART = NOW - timedelta(days=1)\nDAG("a", start_date=START)',
            [(3, "START (datetime.now() on line 1)")],
            id="variable-chain",
        ),
        pytest.param(
            'START: datetime = datetime.now()\nDAG("a", start_date=START)',
            [(2, "START (datetime.now() on line 1)")],
            id="annotated-variable",
        ),
        pytest.param(
            'YEAR = datetime.now().year\nDAG("a", start_date=datetime(YEAR, 1, 1))',
            [(2, "YEAR (datetime.now() on line 1)")],
            id="derived-from-the-clock",
        ),
        pytest.param(
            """
            def make_dag(dag_id):
                return DAG(dag_id, start_date=timezone.utcnow())
            """,
            [(3, "timezone.utcnow()")],
            id="dag-factory",
        ),
        pytest.param(
            """
            def add_tasks():
                EmptyOperator(task_id="t", start_date=datetime.now())
            """,
            [(3, "datetime.now()")],
            id="task-in-a-factory",
        ),
        pytest.param(
            'make_dag("a", start_date=pendulum.tomorrow())',
            [(1, "pendulum.tomorrow()")],
            id="factory-call-at-parse-time",
        ),
        pytest.param(
            """
            @task(start_date=datetime.now())
            def t():
                pass
            """,
            [(2, "datetime.now()")],
            id="task-decorator",
        ),
        pytest.param(
            'DAG("a", start_date=datetime.fromtimestamp(time.time()))',
            [(1, "time.time()")],
            id="time-time",
        ),
        pytest.param(
            'DAG("a", start_date=dt.datetime.now(dt.timezone.utc).replace(hour=0))',
            [(1, "dt.datetime.now()")],
            id="module-alias-and-method-chain",
        ),
    ],
)
def test_finds_a_start_date_that_reads_the_clock(source, expected):
    assert found(source) == expected


@pytest.mark.parametrize(
    "source",
    [
        pytest.param('DAG("a", start_date=datetime(2025, 1, 1))', id="datetime"),
        pytest.param('DAG("a", start_date=pendulum.datetime(2025, 1, 1, tz="UTC"))', id="pendulum"),
        pytest.param(
            'DAG("a", default_args={"start_date": pendulum.parse("2025-01-01")})',
            id="parsed-from-text",
        ),
        pytest.param('DAG("a", start_date=None)', id="none"),
        pytest.param(
            'START = datetime.now()\nSTART = datetime(2025, 1, 1)\nDAG("a", start_date=START)',
            id="reassigned-before-use",
        ),
        pytest.param(
            """
            @task
            def extract():
                return fetch(start_date=date.today())
            """,
            id="inside-a-task",
        ),
        pytest.param(
            """
            def fetch_recent(client):
                return client.get(start_date=date.today() - timedelta(days=7))
            """,
            id="inside-a-helper",
        ),
        pytest.param('WINDOW = {"start_date": date.today()}', id="not-default-args"),
        pytest.param(
            'DAG("a", default_args={"params": {"start_date": date.today()}})',
            id="nested-in-default-args",
        ),
    ],
)
def test_leaves_fixed_and_run_time_values_alone(source):
    assert found(source) == []


def test_reports_each_value_once_in_line_order():
    source = """\
        default_args = {"start_date": days_ago(2)}
        DAG("a", start_date=datetime.now(), default_args=default_args)
        DAG("b", default_args=default_args)
        """
    assert found(source) == [(1, "days_ago()"), (2, "datetime.now()")]


def test_variables_that_refer_to_each_other_do_not_loop():
    source = """\
        START = START + timedelta(days=1)
        A = B
        B = A
        default_args = {**default_args}
        DAG("a", start_date=START, default_args=A)
        """
    assert found(source) == []


# --- on serialized DAGs ------------------------------------------------------

HEADER = """\
from datetime import datetime, timedelta

import pendulum
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG
"""


def load(tmp_path, body):
    """A DAG file, loaded like the DAG processor does and serialized; and its source."""
    try:
        from airflow.dag_processing.dagbag import DagBag
    except ImportError:  # older Airflow 3.x
        from airflow.models.dagbag import DagBag

    source = HEADER + dedent(body)
    path = tmp_path / "start_date_dag.py"
    path.write_text(source, encoding="utf-8")
    bag = DagBag(dag_folder=str(path), safe_mode=False)
    assert not bag.import_errors, bag.import_errors
    (dag,) = bag.dags.values()
    return roundtrip(dag), source


def line_of(source, text):
    return next(n for n, line in enumerate(source.splitlines(), 1) if text in line)


def test_a_moving_start_date_on_the_dag_fails_with_its_line(tmp_path):
    dag, source = load(
        tmp_path,
        """
        with DAG("moving", schedule="@daily", start_date=datetime.now() - timedelta(days=1)):
            EmptyOperator(task_id="load")
        """,
    )
    assert isinstance(dag.start_date, datetime)  # all the serialized DAG knows
    result = dynamic_start_date(dag, Context(source=source))
    assert result.status == Status.FAIL
    assert result.items == (f"line {line_of(source, 'datetime.now()')}: datetime.now()",)
    assert result.message == "start_date uses the current time, so it moves forward on every parse."


def test_a_moving_start_date_in_default_args_fails(tmp_path):
    dag, source = load(
        tmp_path,
        """
        START = pendulum.today("UTC").add(days=-1)
        default_args = {"owner": "data-team", "start_date": START}
        with DAG("moving", schedule="@daily", default_args=default_args):
            EmptyOperator(task_id="load")
        """,
    )
    result = dynamic_start_date(dag, Context(source=source))
    assert result.status == Status.FAIL
    used, set_from = line_of(source, '"start_date": START'), line_of(source, "START = ")
    assert result.items == (f"line {used}: START (pendulum.today() on line {set_from})",)


@pytest.mark.parametrize(
    "dag_args",
    [
        'start_date=pendulum.datetime(2026, 1, 1, tz="UTC")',
        'default_args={"start_date": datetime(2026, 1, 1)}',
    ],
)
def test_a_fixed_start_date_passes(tmp_path, dag_args):
    dag, source = load(
        tmp_path,
        f"""
        with DAG("fixed", schedule="@daily", {dag_args}):
            EmptyOperator(task_id="load")
        """,
    )
    assert dynamic_start_date(dag, Context(source=source)).status == Status.PASS


def test_a_dag_without_a_start_date_is_skipped(tmp_path):
    dag, source = load(
        tmp_path,
        """
        with DAG("manual", schedule=None):
            EmptyOperator(task_id="load")
        """,
    )
    result = dynamic_start_date(dag, Context(source=source))
    assert result.status == Status.SKIP
    assert "no start_date" in result.message


def test_without_the_source_the_check_skips(tmp_path):
    dag, _ = load(
        tmp_path,
        """
        with DAG("moving", schedule="@daily", start_date=datetime.now()):
            EmptyOperator(task_id="load")
        """,
    )
    assert dynamic_start_date(dag, Context()).status == Status.SKIP


def test_the_report_fails_the_check_and_a_reason_acknowledges_it(tmp_path):
    body = """
        with DAG("moving", schedule=None, start_date=datetime.now()):
            EmptyOperator(task_id="load")
        """
    dag, source = load(tmp_path, body)

    def result(report):
        return next(c for c in report["checks"] if c["id"] == "dynamic_start_date")

    flagged = result(score_dag(dag, Context(source=source)))
    assert flagged["status"] == "fail" and flagged["points"] == 0
    assert flagged["category"] == "reliability"
    assert flagged["fix"] and flagged["why"] and "pendulum.datetime" in flagged["example"]

    acked_source = source + "# dagwick: ack dynamic_start_date -- only ever triggered by hand\n"
    acked = result(score_dag(dag, Context(source=acked_source)))
    assert acked["status"] == "ack"
    assert acked["ack_reason"] == "only ever triggered by hand"
