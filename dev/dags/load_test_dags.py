"""Many generated DAGs, to time the fleet page in the sandbox (issue #33).

Off by default. Start the sandbox with, for example:

    DAGWICK_LOAD_TEST_DAGS=500 ./dev/run.sh

The DAGs vary on purpose (owner, retries, tags, docs, schedule) so their grades
spread across A to F, like a real fleet.
"""

import os
from datetime import timedelta

import pendulum
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG

COUNT = int(os.environ.get("DAGWICK_LOAD_TEST_DAGS", "0") or 0)


def alert(context):
    """Stand-in for a Slack notifier."""


START = pendulum.datetime(2025, 1, 1, tz="UTC")
SCHEDULES = ("@daily", "@hourly", "0 3 * * *", None)

for i in range(COUNT):
    default_args = {"owner": f"team-{i % 7}"} if i % 5 else {}
    if i % 3:
        default_args["retries"] = 1 + i % 3
    if i % 4:
        default_args["execution_timeout"] = timedelta(minutes=30)
        default_args["on_failure_callback"] = alert
    with DAG(
        dag_id=f"load_test_{i:04d}",
        start_date=START,
        schedule=SCHEDULES[i % len(SCHEDULES)],
        catchup=bool(i % 11 == 0),
        tags=[f"group-{i % 10}"] if i % 2 else [],
        doc_md="Generated load-test DAG." if i % 6 else None,
        max_active_runs=1 if i % 2 else 16,
        dagrun_timeout=timedelta(hours=2) if i % 4 else None,
        default_args=default_args,
    ) as dag:
        tasks = [EmptyOperator(task_id=f"step_{n}") for n in range(2 + i % 8)]
        for upstream, downstream in zip(tasks, tasks[1:], strict=False):
            upstream >> downstream
    globals()[dag.dag_id] = dag
