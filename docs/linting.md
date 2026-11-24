# Lint and fix your DAGs

Dagwick is a linter for Airflow DAGs. The same 21 checks run in two places:

- **On your DAG files**, with the `dagwick` command: on your machine, in
  pre-commit and in CI, before a DAG is merged.
- **Inside Airflow**, as a grade on every DAG and a fleet page, once the plugin
  is installed (see the [README](../README.md#setup)).

| Command | What it does | Needs Airflow | Runs DAG code |
| --- | --- | --- | --- |
| `dagwick check` | Grades DAG files A–F and lists what to fix | yes | yes, like Airflow's DAG processor |
| `dagwick fix` | Fixes what can be fixed automatically | only to fix imports | no, it only reads the files |
| `dagwick explain` | Explains why a check exists | no | no |

## Install

In the environment where you develop or test DAGs, next to the Airflow version
you deploy:

```bash
pip install dagwick
```

`dagwick check` imports the DAG files, so it needs Airflow and everything your
DAGs import. `dagwick fix` reads the new import paths from Airflow, so without
Airflow it fixes everything except imports. `dagwick explain` needs nothing.

## Check

```bash
dagwick check dags/                   # grade every DAG in the folder
dagwick check dags/ --min-grade C     # exit 1 if any DAG is below C
dagwick check dags/my_dag.py --json   # the full report as JSON
```

Each problem comes with how to fix it. Problems `dagwick fix` can fix are
marked `[dagwick fix]`, or `[dagwick fix --unsafe-fixes]` when the fix changes
what the DAG does.

## Understand a check

```bash
dagwick explain               # list every check
dagwick explain retries       # why it matters, bad and good code, how to fix it
```

The same explanations are in the [check reference](checks.md#check-reference).

## Fix

```bash
dagwick fix dags/                           # show the diff; exit 1 if there is something to fix
dagwick fix dags/ --write                   # change the files
dagwick fix dags/ --write --unsafe-fixes    # also fixes that change what the DAG does
```

| Check | Fix | Kind |
| --- | --- | --- |
| Uses current Airflow imports | Moves each deprecated import to the path Airflow points to | safe |
| Tasks retry on failure | Adds `"retries": 2` to `default_args` | unsafe |

- **Safe** fixes don't change what the DAG does.
- **Unsafe** fixes do, so they need `--unsafe-fixes` and a review. Retrying is
  only right for tasks that are idempotent (running twice gives the same
  result).

`dagwick fix` never imports or runs your files. It keeps formatting, comments
and line endings, and running it twice changes nothing. When it isn't sure,
for example an import with a comment inside it, it leaves the code alone and
`dagwick check` keeps reporting the problem. Run your formatter afterwards if
you sort imports.

## Break a check on purpose

Some DAGs break a check for a good reason: an ingest that must backfill, a task
that must never retry. Say so in the DAG file, with the reason:

```python
DAG(
    "daily_ingest",
    catchup=True,  # dagwick: ack catchup -- backfills daily files after outages
)
```

The check then shows as acknowledged and leaves the score, and `dagwick fix`
leaves it alone. Only some checks can be acknowledged; `dagwick explain <check>`
says whether one can and when it is fine. See
[Acknowledge a check on purpose](checks.md#acknowledge-a-check-on-purpose).

## Exit codes

| Code | `dagwick check` | `dagwick fix` | `dagwick explain` |
| --- | --- | --- | --- |
| `0` | All DAGs at or above `--min-grade` | Nothing to fix, or `--write` fixed it | Explained |
| `1` | A DAG is below `--min-grade` | There is something to fix (without `--write`) | |
| `2` | A file failed to load | A file couldn't be read or parsed | Unknown check |

## pre-commit

```yaml
- repo: https://github.com/dagwick/dagwick
  rev: v0.3.0
  hooks:
    - id: dagwick-fix   # apply safe fixes; the commit stops so you can review them
    - id: dagwick       # grade the changed DAG files
      args: [--min-grade, C]   # default: D
```

The hooks use `language: system`, so run pre-commit from an environment where
Airflow and Dagwick are installed. `dagwick-fix` needs Dagwick newer than 0.3.0.

## GitHub Actions

```yaml
name: DAGs
on: pull_request

jobs:
  dagwick:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Install Airflow, your DAGs' dependencies and Dagwick
        run: |
          AIRFLOW_VERSION=3.1.8
          pip install "apache-airflow==${AIRFLOW_VERSION}" dagwick \
            -c "https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-3.12.txt"
          pip install -r requirements.txt
      - name: Nothing left that dagwick fix can fix
        run: dagwick fix dags/
      - name: Every DAG grades C or better
        run: dagwick check dags/ --min-grade C
```

Use the Airflow version you deploy, and pin actions to a commit SHA if your
organization requires it.

## Adopt it in an existing repository

A repository with many DAGs rarely passes on the first run. A gentle start:

1. Run `dagwick fix dags/ --write` once and commit the safe fixes on their own.
2. Run `dagwick check dags/` and look at the most common problems. The fleet
   page in Airflow shows the same, across all DAGs.
3. Start CI at `--min-grade F` or `D`, so only the worst DAGs fail, and raise it
   as the DAGs improve.
4. Acknowledge the checks that are broken on purpose, with a reason, instead of
   disabling them for everyone.
5. If a check doesn't fit your team, turn it off or change its weight in
   [`[dagwick]` settings](checks.md#tune-the-scoring). `dagwick check` reads
   the same `airflow.cfg` as the UI.

## Dagwick and Ruff

Ruff has Airflow rules too (`AIR`). They are fast, need no Airflow and run in
your editor. Use both: Ruff for instant feedback while typing, Dagwick for
checks that need the real DAG, a grade, and the view inside Airflow.

| Topic | Ruff | Dagwick |
| --- | --- | --- |
| Removed or moved Airflow imports | `AIR301`, `AIR302`, `AIR311`, `AIR312`, `AIR321` | `current_imports`, fixed by `dagwick fix` |
| Explicit `schedule` | `AIR002` (the argument is missing) | `schedule` (the DAG never runs on its own) |
| `Variable.get` outside a task | `AIR003` (preview) | `parse_time_variables` |
| Values that change on every parse | `AIR304` (preview): a call like `datetime.now()` written in a DAG or task argument | `dynamic_start_date`, for `start_date`: also through variables and `default_args`, and helpers like `days_ago()` or `timezone.utcnow()` |
| Task variable named after its `task_id` | `AIR001` | — |

Dagwick's other checks look at the DAG as Airflow sees it, after
`default_args`, defaults and DAG factories: retries, timeouts, failure alerts,
owner, docs, tags, catchup, parallel runs, auto-pause, naming, file names,
tasks with no dependencies, parse time, sensors (with run history) and secrets.
Ruff can't see those from the source alone.

Where both report the same problem, fixing it once clears both.

Airflow 3.2 and later also look for values that change on every parse when
they parse a DAG file, and show a DAG warning in the UI
(`[dag_processor] dag_version_inflation_check_level`: `warning` by default,
`error` to stop such a DAG from loading). Dagwick finds a moving `start_date`
before the DAG is deployed, and on Airflow 3.1 too.
