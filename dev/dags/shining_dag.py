"""Demo: a DAG that follows the habits Dagwick checks for."""

from datetime import timedelta

import pendulum
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG


def notify_failure(context):
    """Stand-in for a Slack notifier."""


def notify_retry(context):
    """Stand-in for a Slack notifier."""


with DAG(
    dag_id="demo_shining_pipeline",
    schedule="0 3 * * *",
    start_date=pendulum.datetime(2025, 1, 1, tz="Asia/Baghdad"),
    catchup=False,
    max_active_runs=1,
    max_consecutive_failed_dag_runs=3,
    dagrun_timeout=timedelta(hours=2),
    tags=["demo", "dagwick"],
    doc_md="Loads demo data every night at 03:00. Owner: data-ai.",
    default_args={
        "owner": "data-ai",
        "retries": 2,
        "retry_delay": timedelta(minutes=5),
        "execution_timeout": timedelta(minutes=30),
        "on_failure_callback": notify_failure,
        "on_retry_callback": notify_retry,
    },
):
    extract = EmptyOperator(task_id="extract")
    transform = EmptyOperator(task_id="transform")
    load = EmptyOperator(task_id="load")
    extract >> transform >> load
