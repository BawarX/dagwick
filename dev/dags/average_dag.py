"""Demo: a typical DAG with a few gaps."""

from datetime import timedelta

import pendulum
from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG

with DAG(
    dag_id="demo_average_pipeline",
    schedule="@hourly",
    start_date=pendulum.datetime(2025, 1, 1, tz="UTC"),
    tags=["demo"],
    description="Hourly sync of demo data.",
    default_args={"owner": "data-team", "retries": 1, "retry_delay": timedelta(minutes=2)},
):
    start = EmptyOperator(task_id="start")
    sync = EmptyOperator(task_id="SyncData", execution_timeout=timedelta(minutes=10))
    done = EmptyOperator(task_id="done")
    start >> sync >> done
