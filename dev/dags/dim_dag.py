from datetime import datetime

from airflow.providers.standard.operators.empty import EmptyOperator
from airflow.sdk import DAG

with DAG(dag_id="DemoLegacyJob", schedule="@daily", start_date=datetime(2025, 1, 1), catchup=True):
    EmptyOperator(task_id="do_everything")
