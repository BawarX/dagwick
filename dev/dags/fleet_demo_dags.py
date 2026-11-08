"""More demo DAGs so the fleet page has something to show. Generated in a loop."""

from datetime import timedelta

import pendulum
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG


def alert(context):
    """Stand-in for a Slack notifier."""


START = pendulum.datetime(2025, 1, 1, tz="UTC")

SPECS = {
    # dag_id: (default_args, dag kwargs, task count)
    "demo_sales_ingest": (
        {
            "owner": "data-team",
            "retries": 2,
            "execution_timeout": timedelta(minutes=20),
            "on_failure_callback": alert,
        },
        {
            "schedule": "0 2 * * *",
            "tags": ["sales", "ingest"],
            "doc_md": "Nightly sales load.",
            "max_active_runs": 1,
            "dagrun_timeout": timedelta(hours=1),
        },
        4,
    ),
    "demo_weather_refresh": (
        {"owner": "data-team", "retries": 1, "on_failure_callback": alert},
        {
            "schedule": "@weekly",
            "tags": ["weather"],
            "description": "Weekly refresh.",
            "max_active_runs": 1,
        },
        3,
    ),
    "demo_orders_sync": (
        {"owner": "data-team", "retries": 3, "execution_timeout": timedelta(minutes=15)},
        {
            "schedule": "*/30 * * * *",
            "tags": ["orders"],
            "max_active_runs": 2,
            "dagrun_timeout": timedelta(minutes=25),
        },
        5,
    ),
    "demo_report_export": (
        {"retries": 0},
        {"schedule": "@daily", "catchup": True},
        2,
    ),
    "demo_adhoc_backfill": (
        {"owner": "data-team"},
        {"schedule": None, "tags": ["ops"]},
        1,
    ),
}

for dag_id, (default_args, kwargs, n) in SPECS.items():
    with DAG(dag_id=dag_id, start_date=START, default_args=default_args, **kwargs) as dag:
        prev = None
        for i in range(n):
            task = EmptyOperator(task_id=f"step_{i + 1}")
            if prev:
                prev >> task
            prev = task
    globals()[dag_id] = dag
