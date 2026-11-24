"""isolated_tasks: tasks with no upstream and no downstream task (issue #111).

Every DAG goes through serialization first, as the api-server reads it: the
serialized DAG stores each task's downstream ids and rebuilds the upstream ones.
"""

from __future__ import annotations

from types import SimpleNamespace

import pytest
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG, TaskGroup, chain, task, task_group
from conftest import roundtrip

from dagwick import Context, Status
from dagwick.checks.structure import isolated_tasks
from dagwick.core import score_dag


def empty(*task_ids):
    return [EmptyOperator(task_id=task_id) for task_id in task_ids]


def finding(dag):
    return isolated_tasks(roundtrip(dag))


def test_a_forgotten_task_warns_and_is_named():
    with DAG("forgotten", schedule=None) as dag:
        extract, load, _report = empty("extract", "load", "report")
        extract >> load
    result = finding(dag)
    assert result.status == Status.WARN
    assert result.items == ("report",)
    assert result.message == (
        "1 task has no upstream or downstream task, so it runs in parallel with the rest."
    )


def test_several_forgotten_tasks_are_listed_in_order():
    with DAG("forgotten", schedule=None) as dag:
        chain(*empty("extract", "transform", "load"))
        empty("zip_logs", "notify")
    result = finding(dag)
    assert result.status == Status.WARN
    assert result.items == ("notify", "zip_logs")
    assert result.message.startswith("2 tasks have no upstream or downstream task, so they run")


def test_a_connected_dag_passes():
    with DAG("connected", schedule=None) as dag:
        start, a, b, end = empty("start", "a", "b", "end")
        start >> [a, b] >> end
    result = finding(dag)
    assert result.status == Status.PASS
    assert result.items == ()


@pytest.mark.parametrize("n", [0, 1])
def test_fewer_than_two_tasks_is_skipped(n):
    with DAG("small", schedule=None) as dag:
        empty(*(f"t{i}" for i in range(n)))
    assert finding(dag).status == Status.SKIP


@pytest.mark.parametrize(
    ("connected", "alone", "status"),
    [
        (2, 1, Status.WARN),  # most tasks are connected
        (3, 2, Status.WARN),
        (2, 2, Status.SKIP),  # half and half is not "most"
        (2, 5, Status.SKIP),  # mostly independent jobs
        (0, 4, Status.SKIP),  # no dependencies at all: independent on purpose
    ],
)
def test_warns_only_when_most_tasks_are_connected(connected, alone, status):
    with DAG("mixed", schedule=None) as dag:
        if connected:
            chain(*empty(*(f"step_{i}" for i in range(connected))))
        empty(*(f"job_{i}" for i in range(alone)))
    result = finding(dag)
    assert result.status == status
    if status == Status.SKIP:
        assert "independent on purpose" in result.message


def test_task_group_dependencies_count_and_items_keep_the_group_prefix():
    with DAG("groups", schedule=None) as dag:
        start, end = empty("start", "end")
        with TaskGroup("transform") as transform:
            clean, enrich = empty("clean", "enrich")
            clean >> enrich
        with TaskGroup("side"):
            empty("lonely")
        start >> transform >> end
    result = finding(dag)
    assert result.status == Status.WARN
    assert result.items == ("side.lonely",)


def test_dependencies_between_task_groups_count():
    with DAG("group_to_group", schedule=None) as dag:
        with TaskGroup("extract") as extract:
            empty("orders", "customers")
        with TaskGroup("load") as load:
            empty("warehouse")
        extract >> load
    assert finding(dag).status == Status.PASS


def test_mapped_tasks_are_connected_by_their_inputs():
    with DAG("mapped", schedule=None) as dag:

        @task
        def list_files():
            return ["a.csv", "b.csv"]

        @task
        def process(name):
            return name

        @task
        def summarize(results):
            return len(results)

        summarize(process.expand(name=list_files()))
    serialized = roundtrip(dag)
    assert serialized.task_dict["process"].is_mapped
    assert isolated_tasks(serialized).status == Status.PASS


def test_a_mapped_task_with_no_dependencies_warns():
    with DAG("mapped", schedule=None) as dag:

        @task
        def extract():
            return 1

        @task
        def load(rows):
            return rows

        @task
        def ping(host):
            return host

        load(extract())
        ping.expand(host=["db", "api"])  # mapped over a literal list: nothing upstream
    serialized = roundtrip(dag)
    assert serialized.task_dict["ping"].is_mapped
    result = isolated_tasks(serialized)
    assert result.status == Status.WARN
    assert result.items == ("ping",)


def test_tasks_in_a_mapped_task_group_are_connected():
    with DAG("mapped_group", schedule=None) as dag:

        @task
        def regions():
            return ["eu", "us"]

        @task_group
        def per_region(region):
            @task
            def fetch(name):
                return name

            @task
            def store(rows):
                return rows

            store(fetch(region))

        per_region.expand(region=regions())
    assert finding(dag).status == Status.PASS


def test_a_taskflow_task_that_takes_no_input_is_not_connected():
    with DAG("taskflow", schedule=None) as dag:

        @task
        def extract():
            return 1

        @task
        def load(rows):
            return rows

        @task
        def notify():
            return None

        load(extract())
        notify()  # forgotten: load(extract()) >> notify()
    assert finding(dag).items == ("notify",)


def test_downstream_ids_alone_are_enough():
    a = SimpleNamespace(task_id="a", downstream_task_ids={"b"})
    b = SimpleNamespace(task_id="b", downstream_task_ids=set())
    c = SimpleNamespace(task_id="c", downstream_task_ids=None)
    assert isolated_tasks(SimpleNamespace(tasks=[a, b, c])).items == ("c",)


def test_demo_dags(shining, average, dim):
    assert isolated_tasks(shining).status == Status.PASS
    assert isolated_tasks(average).status == Status.PASS
    assert isolated_tasks(dim).status == Status.SKIP  # a single task


def test_the_report_lists_the_tasks_and_a_reason_acknowledges_the_check():
    with DAG("forgotten", schedule=None) as dag:
        extract, load, _cleanup = empty("extract", "load", "cleanup_tmp")
        extract >> load
    serialized = roundtrip(dag)

    flagged = next(c for c in score_dag(serialized)["checks"] if c["id"] == "isolated_tasks")
    assert flagged["status"] == "warn"
    assert flagged["items"] == ["cleanup_tmp"]
    assert flagged["points"] == flagged["weight"] / 2
    assert flagged["fix"] and flagged["why"] and flagged["example"]

    source = "# dagwick: ack isolated_tasks -- cleanup_tmp clears old files on its own\n"
    report = score_dag(serialized, Context(source=source))
    acked = next(c for c in report["checks"] if c["id"] == "isolated_tasks")
    assert acked["status"] == "ack"
    assert acked["ack_reason"] == "cleanup_tmp clears old files on its own"
