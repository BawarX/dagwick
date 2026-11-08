# Dagwick

*The wick that keeps your DAGs lit.* Dagwick adds DAG quality scoring to the
Airflow 3 UI:

- **A Dagwick tab on every DAG.** It shows a score from 0 to 100, a grade from A
  to F, a lantern whose flame grows with the score, the next step to the next
  grade, and a concrete fix (with a code snippet) for every check that does not
  pass.
- **A fleet page in the sidebar (Dagwick).** It grades every DAG you can read,
  shows how many DAGs have each grade, lists the most common issues across
  DAGs, and lets you search and sort.

## How it works

- **Scores the serialized DAG** from Airflow's metadata database, so it works
  on any api-server without access to the DAG files.
- **Uses Airflow's own permissions.** `/dagwick/api/score` uses Airflow's
  `requires_access_dag("GET")`, so a user only sees scores for DAGs they can
  already read.
- **Gives partial credit.** *warn* earns half the points (for example, 2 of 3
  tasks have timeouts). *skip* checks are left out of the score.
- **Lets you add your own checks** through a `dagwick.checks` entry point.

## Built-in checks

| Category | Check | Weight |
| --- | --- | --- |
| Reliability | Tasks retry on failure | 15 |
| Reliability | Tasks have a time limit (`execution_timeout`) | 10 |
| Reliability | Runs have a time limit (`dagrun_timeout`) | 8 |
| Observability | Someone hears about failures (`on_failure_callback`) | 15 |
| Observability | Retries are visible (`on_retry_callback`) | 3 |
| Ownership | Has a real owner (not the default `airflow`) | 8 |
| Ownership | Documented (`doc_md`) | 8 |
| Ownership | Tagged | 5 |
| Scheduling | Has a schedule | 5 |
| Scheduling | No surprise backfills (`catchup`) | 5 |
| Scheduling | Stops after repeated failures (`max_consecutive_failed_dag_runs`) | 3 |
| Scheduling | Bounded parallel runs (`max_active_runs`) | 5 |
| Structure | Split into steps | 5 |
| Structure | Consistent names (snake_case) | 3 |

## Adding a check

```python
# my_company_checks/rules.py
from dagwick import Category, Finding, Status, check


@check(
    id="team_tag",
    title="Has a team tag",
    category=Category.OWNERSHIP,
    weight=5,
    fix="Add a tag like 'team:data-ai'.",
)
def team_tag(dag):
    if any(t.startswith("team:") for t in dag.tags):
        return Finding(Status.PASS, "Team tag present.")
    return Finding(Status.FAIL, "No team tag.")
```

```toml
# my_company_checks/pyproject.toml
[project.entry-points."dagwick.checks"]
my_company = "my_company_checks.rules"
```

Registering a check with an existing `id` replaces the built-in check.

## Development

```bash
./dev/run.sh            # build UI, install, start a sandbox Airflow on :8080
.venv/bin/pytest        # unit tests
cd ui && npm run build  # rebuild src/dagwick/static/dagwick.js
```

The sandbox keeps everything (database, logs, config) in `dev/airflow_home/`
and loads only the demo DAGs in `dev/dags/`.
