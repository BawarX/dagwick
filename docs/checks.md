# Checks

Each DAG gets a score from 0 to 100 and a grade: **A** ≥ 90, **B** ≥ 75,
**C** ≥ 60, **D** ≥ 40, otherwise **F**. A check that only partly passes (for
example, 2 of 3 tasks have a timeout) earns half its points. A check that does
not apply to a DAG is left out of the score.

| Category | Check | Points | Can acknowledge |
| --- | --- | --- | --- |
| Reliability | Tasks retry on failure | 15 | yes |
| Reliability | Tasks have a time limit (`execution_timeout`) | 10 | no |
| Reliability | Runs have a time limit (`dagrun_timeout`) | 8 | no |
| Observability | Someone hears about failures (`on_failure_callback`) | 15 | yes, see below |
| Observability | Retries are visible (`on_retry_callback`) | 3 | yes |
| Ownership | Has a real owner (not the default `airflow`) | 8 | no |
| Ownership | Documented (`doc_md`) | 8 | no |
| Ownership | Tagged | 5 | no |
| Scheduling | Has a schedule | 5 | yes |
| Scheduling | No surprise backfills (`catchup`) | 5 | yes |
| Scheduling | Stops after repeated failures (`max_consecutive_failed_dag_runs`) | 3 | yes, see below |
| Scheduling | Bounded parallel runs (`max_active_runs`) | 5 | yes |
| Structure | Split into steps | 5 | yes |
| Structure | Consistent names (snake_case) | 3 | no |
| Structure | File named after the DAG (`<dag_id>.py`; skipped for files that define several DAGs) | 3 | no |
| Structure | Uses current Airflow imports (no path Airflow itself marks as deprecated) | 3 | no |
| Performance | Fast to parse (warn from 5 s, fail from 20 s) | 5 | no |
| Performance | No `Variable.get` at parse time (top level, default args, decorator arguments, `@dag` function bodies) | 5 | no |
| Performance | Sensors free their worker slot (a poke-mode sensor that waits a minute or more per run; needs run history) | 5 | yes, see below |
| Security | No secrets in the DAG file (values assigned to secret-looking names, known token formats, passwords in connection URIs; the value is never shown) | 10 | no |

## Tune the scoring

Every Dagwick setting is optional. Without them, scores are exactly as
described above. Add a `[dagwick]` section to `airflow.cfg`:

```ini
[dagwick]
# Leave these checks out of every score (check ids, comma-separated).
disabled_checks = file_name, naming
# Points for a check, as check_id:points (positive whole numbers).
weights = retries:20, tags:2
# The lowest score for each grade. Letters you leave out keep their default.
grades = A:90, B:75, C:60, D:40
```

or set the same values as environment variables:
`AIRFLOW__DAGWICK__DISABLED_CHECKS`, `AIRFLOW__DAGWICK__WEIGHTS` and
`AIRFLOW__DAGWICK__GRADES`.

- **Check ids** are listed by `GET /dagwick/api/checks`, which also shows each
  check's current `weight`, its `default_weight` and whether it is `enabled`.
  The ids of the built-in checks are `retries`, `execution_timeout`,
  `dagrun_timeout`, `failure_alerts`, `retry_alerts`, `owner`, `docs`, `tags`,
  `schedule`, `catchup`, `auto_pause`, `max_active_runs`, `decomposition`,
  `naming`, `file_name`, `current_imports`, `parse_time`,
  `parse_time_variables`, `sensor_slots` and `hardcoded_secrets`. Checks from
  a check pack can be disabled or re-weighted the same way.
- A disabled check is left out completely: it is not run, not shown, and earns
  no points.
- **Grades** must go A > B > C > D, each from 0 to 100. The DAG tab and the
  fleet page follow the configured thresholds.
- `dagwick check` reads the same settings from the `airflow.cfg` (or
  environment) it runs with, so CI grades DAGs the same way the UI does.
- An invalid value never breaks Dagwick: it is logged and ignored. A bad
  weight entry is skipped, an unknown check id is logged, and grades that are
  out of order or out of range fall back to the defaults.
- Restart the api-server after changing `airflow.cfg`.

## Acknowledge a check on purpose

Some DAGs break a check on purpose: an ingest DAG backfills missed days with
`catchup=True`, or a task that inserts without de-duplicating must never retry.
Mark it with a comment anywhere in the DAG file:

```python
DAG(
    "daily_ingest",
    catchup=True,  # dagwick: ack catchup -- backfills daily files after outages
    default_args={"retries": 0},  # dagwick: ack retries -- inserts are not idempotent
)
```

Several checks can share one comment: `# dagwick: ack retries, catchup -- <reason>`.
The comment applies to every DAG defined in that file.

An acknowledged check:

- shows as **acknowledged**, greyed out, with its reason. It is never hidden.
- is left out of the score, like a check that does not apply.
- is left out of "Most common issues" and counted as "N acknowledged" on the
  fleet page.

Only the checks marked in the table above can be acknowledged. The others
protect things no DAG should go without, and an acknowledgement for them is
ignored with a note. A reason after `--` is required. For the three checks marked
"see below", it must say where the problem is handled instead, or why it
cannot be:

- **Someone hears about failures:** where failures are alerted instead (for
  example a central listener or a Grafana rule).
- **Stops after repeated failures:** what stops the DAG when it keeps failing
  (for example on-call pausing it by hand).
- **Sensors free their worker slot:** why the sensor must keep its slot (for
  example it has to react within seconds, faster than a reschedule allows).

Dagwick reads the comment from the DAG file's source as Airflow stored it, with
Python's `tokenize` module. The file is never run.

## Add your own check

```python
# my_checks/rules.py
from dagwick import Category, Finding, Status, check


@check(
    id="team_tag",
    title="Has a team tag",
    category=Category.OWNERSHIP,
    weight=5,
    fix="Add a tag like 'team:data'.",
    example='DAG(..., tags=["team:data"])',
)
def team_tag(dag):
    if any(t.startswith("team:") for t in dag.tags):
        return Finding(Status.PASS, "Team tag present.")
    return Finding(Status.FAIL, "No team tag.")
```

Register the module in your package's `pyproject.toml`, then install that
package next to Dagwick:

```toml
[project.entry-points."dagwick.checks"]
my_checks = "my_checks.rules"
```

A check with the same `id` as a built-in check replaces it.

Pass `acknowledgeable=True` to `@check` to let DAGs acknowledge it, or
`ack_hint="..."` to also say what the reason must explain. Checks cannot be
acknowledged unless they opt in.

A check can also take a second parameter, `context` (a `dagwick.Context`), for
facts that are not on the DAG itself: `context.dags_in_file`, `context.source`
(the DAG file's source code, as Airflow stored it) and `context.parse_seconds`
(how long the file last took to parse). Each is `None` when unknown.

Checks that read the source never run it: they read it with Python's `ast`
module. Deprecated import paths come from Airflow's own deprecation table, so
the check follows whichever Airflow version is installed.
