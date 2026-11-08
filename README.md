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

![Dagwick tab on a DAG](https://raw.githubusercontent.com/ardalan-jalal/dagwick/main/docs/screenshots/dag-tab.png)

## Install

Dagwick needs **Apache Airflow 3.1 or newer** and **Python 3.10 or newer**.
Install it into the same environment (or image) as Airflow:

```bash
pip install dagwick
```

or add `dagwick` to your Airflow image's requirements. Then restart the Airflow
api-server. That's all:

- **No configuration**: no environment variables, Airflow Variables or
  Connections.
- **No extra dependencies**: Dagwick uses the Airflow that is already
  installed. Installing it never adds, upgrades or downgrades other packages.
- **Found automatically**: Airflow discovers it through the standard
  `airflow.plugins` entry point. You don't copy anything into `plugins/`.

Open any DAG and click the **Dagwick** tab, or click **Dagwick** in the
sidebar for the fleet view.

To remove it, run `pip uninstall dagwick` and restart the api-server.

![Dagwick fleet page](https://raw.githubusercontent.com/ardalan-jalal/dagwick/main/docs/screenshots/fleet.png)

## How it works

- **Scores the serialized DAG** from Airflow's metadata database, so it works
  on any api-server without access to the DAG files.
- **Uses Airflow's own permissions.** `/dagwick/api/score` uses Airflow's
  `requires_access_dag("GET")`, so a user only sees scores for DAGs they can
  already read.
- **Gives partial credit.** *warn* earns half the points (for example, 2 of 3
  tasks have timeouts). *skip* checks are left out of the score.
- **Is read-only.** It never writes to the database, never runs DAG code and
  makes no network calls.
- **Caches scores per DAG version**, so a DAG is re-scored only when its code
  changes.
- **Lets you add your own checks** through a `dagwick.checks` entry point.

See [SECURITY.md](SECURITY.md) for the full security design.

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
    fix="Add a tag like 'team:data'.",
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

You need [uv](https://docs.astral.sh/uv/) and Node.js 20+.

```bash
uv sync                 # dev environment (Airflow is installed here for tests only)
uv run pytest           # tests with a 70 % coverage gate
uv run ruff check       # lint
./dev/run.sh            # build the UI and start a sandbox Airflow on :8080
```

The sandbox keeps everything (database, logs, config) in `dev/airflow_home/`
and loads only the demo DAGs in `dev/dags/`. See
[CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE)
