"""Demo: a well-built DAG that breaks two checks on purpose.

Open its Dagwick tab to see acknowledged checks (greyed out, with the reason,
left out of the score) and the notes shown when an acknowledgement is ignored.
"""

from datetime import datetime, timedelta

from airflow.providers.standard.operators.bash import BashOperator
from airflow.sdk import DAG


def notify_on_call(context):
    """Stand-in for a real alert (Slack, PagerDuty, ...)."""


with DAG(
    dag_id="demo_acknowledged_ingest",
    schedule="@daily",
    start_date=datetime(2025, 1, 1),
    catchup=True,  # dagwick: ack catchup -- backfills one file per missed day after outages
    max_active_runs=1,
    dagrun_timeout=timedelta(hours=2),
    max_consecutive_failed_dag_runs=3,
    tags=["demo", "ingest"],
    default_args={
        "owner": "data-team",
        "retries": 0,  # dagwick: ack retries -- inserts are not idempotent; a retry double-loads
        "execution_timeout": timedelta(minutes=30),
        "on_failure_callback": notify_on_call,
    },
    # The two acknowledgements below are ignored on purpose, to show their notes:
    # dagwick: ack docs -- the docs check cannot be acknowledged
    # dagwick: ack retry_alerts
):
    extract = BashOperator(task_id="extract", bash_command="echo extract")
    load = BashOperator(task_id="load", bash_command="echo load")
    extract >> load
