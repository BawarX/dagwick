# Checks

Each DAG gets a score from 0 to 100 and a grade: **A** ≥ 90, **B** ≥ 75,
**C** ≥ 60, **D** ≥ 40, otherwise **F**. A check that only partly passes (for
example, 2 of 3 tasks have a timeout) earns half its points. A check that does
not apply to a DAG is left out of the score.

| Category | Check | Points | Can acknowledge |
| --- | --- | --- | --- |
| Reliability | Tasks retry on failure | 15 | yes |
| Reliability | Safe use of `depends_on_past` (fails with `catchup=True` and more than one active run; warns when `default_args` sets it for every task) | 8 | yes |
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
| Structure | Tasks are connected (a task with no upstream or downstream task, a forgotten `>>`; skipped when most tasks are independent) | 3 | yes |
| Structure | Consistent names (snake_case) | 3 | no |
| Structure | File named after the DAG (`<dag_id>.py`; skipped for files that define several DAGs) | 3 | no |
| Structure | Uses current Airflow imports (no path Airflow itself marks as deprecated) | 3 | no |
| Performance | Fast to parse (warn from 5 s, fail from 20 s) | 5 | no |
| Performance | No `Variable.get` at parse time (top level, default args, decorator arguments, `@dag` function bodies) | 5 | no |
| Performance | Sensors free their worker slot (a poke-mode sensor that waits a minute or more per run; needs run history) | 5 | yes, see below |
| Security | No secrets in the DAG file (values assigned to secret-looking names, known token formats, passwords in connection URIs; the value is never shown) | 10 | no |

Why each check exists, with bad and good code, is in the
[check reference](#check-reference) below. In a terminal, `dagwick explain`
lists every check and `dagwick explain <check>` explains one, without needing
Airflow.

`dagwick fix` repairs two checks automatically (see the README): **Uses current
Airflow imports** as a safe fix, and **Tasks retry on failure** as an unsafe
fix (`--unsafe-fixes`), because retrying is only right for idempotent tasks.

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
  `isolated_tasks`, `naming`, `file_name`, `current_imports`, `parse_time`,
  `parse_time_variables`, `sensor_slots`, `hardcoded_secrets` and
  `depends_on_past`. Checks from a check pack can be disabled or re-weighted
  the same way.
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

## Write a check pack

A **check pack** is a small Python package with your own rules (team tags,
naming conventions, required callbacks, ...). Dagwick stays generic, and the
pack's checks show up next to the built-in ones in the DAG tab, on the fleet
page and in `dagwick check`. A complete pack with a test is in
[`examples/dagwick-pack-example`](../examples/dagwick-pack-example).

### 1. Write the check

```python
# src/acme_dagwick/checks.py
from dagwick import Category, Finding, Status, check


@check(
    id="acme_team_tag",
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

`@check` takes:

| Parameter | Meaning |
| --- | --- |
| `id` | Unique id. Prefix it with your pack's name so it can't clash with a future built-in check. |
| `title` | Short name shown in the UI. |
| `category` | One of the `Category` members. |
| `weight` | Points the check is worth (a positive whole number). Admins can change it with [`weights`](#tune-the-scoring). |
| `fix` | One actionable sentence, shown when the check does not pass. |
| `example` | Optional code snippet that shows the fix. |
| `acknowledgeable` | `True` lets a DAG mark the check as broken on purpose with a [`# dagwick: ack`](#acknowledge-a-check-on-purpose) comment. Off by default: only allow it where there is a legitimate reason to break the rule. |
| `ack_hint` | What the acknowledgement's reason must explain, for example "where failures are alerted instead". Setting it also makes the check acknowledgeable. |
| `why` | Optional. The failure the check prevents, in a few sentences. Shown by `dagwick explain` and, when the check needs work, in the DAG tab. |
| `bad` | Optional code snippet that breaks the check (`example` shows the fix). Shown by `dagwick explain`. |
| `ack_when` | Optional. When it is fine to break the check on purpose. Shown by `dagwick explain`. |

The function returns a `Finding(status, message, items=())`:

- `Status.PASS`, `Status.FAIL`, or `Status.WARN` (half the points: it works,
  but could be better).
- `Status.SKIP` when the check does not apply to this DAG. It is left out of
  the score.
- `items` names what is affected, usually task ids, so the UI can point at it.

A check that raises an exception, or returns something other than a `Finding`,
is shown as skipped for that DAG and logged. It never breaks the page.

### 2. Use the context, if you need it

A check can take a second parameter, `context` (a `dagwick.Context`), with
facts that are not on the DAG itself. Each is `None` when unknown:

- `context.dags_in_file`: how many DAGs the DAG's file defines.
- `context.source`: the DAG file's source code, as Airflow stored it. Read it
  with `ast` or `tokenize`. Never run it.
- `context.parse_seconds`: how long the file last took to parse.

```python
@check(
    id="acme_no_print",
    title="No print()",
    category=Category.STRUCTURE,
    weight=2,
    fix="Use logging.",
)
def no_print(dag, context):
    if context.source is None:
        return Finding(Status.SKIP, "Source not available.")
    ...
```

### 3. Test it against a serialized DAG

The api-server never sees your DAG objects. It reads the **serialized** DAG
from the database, and serialization fills in defaults and drops some
attributes. Test your check on a DAG that went through serialization, or it may
pass in tests and never fail in Airflow:

```python
from airflow.sdk import DAG
from airflow.serialization.serialized_objects import DagSerialization


def serialized(**kwargs):
    with DAG("example", schedule=None, **kwargs) as dag:
        pass
    return DagSerialization.from_dict(DagSerialization.to_dict(dag))


def test_team_tag():
    assert team_tag(serialized(tags=["team:data"])).status == Status.PASS
```

### 4. Register the entry point

In your package's `pyproject.toml`:

```toml
[project.entry-points."dagwick.checks"]
acme = "acme_dagwick.checks"
```

Install the package next to Dagwick in the Airflow environment and restart the
api-server. Dagwick imports every `dagwick.checks` entry point at start-up.

- A pack that fails to import is logged and skipped. The built-in checks and
  other packs keep working.
- Each pack check is tagged with the pack's distribution name in the DAG tab.
  `GET /dagwick/api/checks` lists every check with its `pack` (`dagwick` for
  the built-in ones).
- A check with the same `id` as a built-in check replaces it, so a pack can
  tighten or relax a built-in rule.
- Admins can turn a pack's checks off or re-weight them with
  [`disabled_checks` and `weights`](#tune-the-scoring), like any other check.

### Which parts of the interface are stable

Check packs can rely on these, imported from `dagwick`:

- `check` and its keyword parameters listed above.
- `Finding` (`status`, `message`, `items`).
- `Status` (`PASS`, `WARN`, `FAIL`, `SKIP`; `ACK` is set by Dagwick, not
  returned by checks).
- `Category`. New categories may be added.
- `Context` fields `dags_in_file`, `source` and `parse_seconds`. New fields
  may be added, so read them by name.

Everything else is internal and may change in any release before 1.0. That
includes the other `Context` fields (`sensor_tasks`, `sensor_runs`,
`default_deferrable`, which exist for the built-in sensor check), `CheckSpec`,
the registry in `dagwick.core`, the modules under `dagwick.checks`, and the
layout of `score_dag`'s report.

## Check reference

Why each built-in check exists and how to fix it. This section is generated
from the checks themselves (`uv run python scripts/check_docs.py`), so it says
exactly what `dagwick explain <check>` says.

<!-- fmt:off -->
<!-- check-reference:start (generated by scripts/check_docs.py) -->

### failure_alerts

**Someone hears about failures** · observability · 15 points · can be acknowledged

**Why it matters.** A DAG that fails without telling anyone keeps failing until someone notices stale data, often days later and often a user of the data. A failure callback or notifier sends the failure to where the owners look.

Bad:

```python
default_args={"owner": "data-team"}  # no on_failure_callback
```

Good:

```python
default_args={"on_failure_callback": send_slack_alert}
```

**How to fix.** Add on_failure_callback (e.g. a Slack notifier) in default_args.

**When it's fine to acknowledge.** Failures are alerted somewhere else, for example by a central listener plugin, a Grafana or Prometheus rule on task state, or an on-call system that watches Airflow. The reason must say where failures are alerted instead (e.g. a central listener or a Grafana rule).

### retry_alerts

**Retries are visible** · observability · 3 points · can be acknowledged

**Why it matters.** A task that only succeeds on its second or third try works today and fails tomorrow. A retry notification shows the flakiness while there is still time to fix it.

Bad:

```python
default_args={"retries": 3}  # retries happen silently
```

Good:

```python
default_args={"on_retry_callback": send_slack_alert}
```

**How to fix.** Add on_retry_callback so flaky tasks surface before they start failing.

**When it's fine to acknowledge.** Retries are expected and would only be noise, for example a task that polls an API which rate-limits by design.

### docs

**Documented** · ownership · 8 points · can't be acknowledged

**Why it matters.** doc_md is shown on the DAG's page in Airflow. Whoever is on call needs to know what the DAG loads, from where, what depends on it and who owns it, without reading the code.

Bad:

```python
DAG("daily_sales")  # no doc_md
```

Good:

```python
DAG(..., doc_md=__doc__)  # reuse the module docstring
```

**How to fix.** Add doc_md explaining what the DAG loads, from where, and who to call.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### owner

**Has a real owner** · ownership · 8 points · can't be acknowledged

**Why it matters.** When a DAG breaks, the first question is who to call. The default owner, 'airflow', means nobody. The owner is shown in Airflow's DAG list and on Dagwick's fleet page, and both can be filtered by it.

Bad:

```python
DAG("daily_sales")  # owner defaults to 'airflow'
```

Good:

```python
default_args={"owner": "data-team"}
```

**How to fix.** Set owner in default_args to the responsible team (e.g. 'data-team').

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### tags

**Tagged** · ownership · 5 points · can't be acknowledged

**Why it matters.** Tags are how people filter hundreds of DAGs in Airflow's DAG list and on Dagwick's fleet page. A DAG without tags is hard to find, and is left out of every filtered view.

Bad:

```python
DAG("daily_sales")  # no tags
```

Good:

```python
DAG(..., tags=["sales", "ingest"])
```

**How to fix.** Add tags (domain, layer) so the DAG is easy to find and filter.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### parse_time

**Fast to parse** · performance · 5 points · can't be acknowledged

**Why it matters.** Airflow re-parses every DAG file every few minutes, so top-level code runs on every parse, not once. Slow files delay every change from showing up, and a file slower than dagbag_import_timeout (30 s by default) fails to load. See 'Top level Python code' in Airflow's best practices.

Bad:

```python
rows = requests.get(URL).json()  # runs on every parse
```

Good:

```python
rows = requests.get(URL).json()  # runs on every parse

@task
def load():
    rows = requests.get(URL).json()  # runs only when the task runs
```

**How to fix.** Move slow top-level work (API calls, database queries, heavy imports) into tasks. The DAG processor re-parses the file every few minutes, and a file slower than dagbag_import_timeout (30 s by default) fails to load.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### parse_time_variables

**No Variable.get at parse time** · performance · 5 points · can't be acknowledged

**Why it matters.** Each Variable.get at parse time is a metadata-database or secrets-backend call on every parse: thousands a day for one file. It slows parsing and loads the database, or a secrets backend that may charge per call. A template or a read inside the task runs only when the task runs.

Bad:

```python
bucket = Variable.get("bucket")  # top level: runs on every parse
```

Good:

```python
BashOperator(task_id="load", bash_command="load.sh {{ var.value.bucket }}")
```

**How to fix.** Read Variables inside a task, or through a template such as {{ var.value.name }}, so they are read when the task runs, not on every parse.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### sensor_slots

**Sensors free their worker slot** · performance · 5 points · can be acknowledged

**Why it matters.** A sensor in poke mode holds a worker slot for its whole wait, doing nothing. Ten sensors that each wait an hour take ten slots that real tasks need. A deferrable sensor waits in the triggerer without a worker slot; reschedule mode frees the slot between checks.

Bad:

```python
S3KeySensor(task_id="wait_for_file", ..., poke_interval=60)  # pokes for hours
```

Good:

```python
S3KeySensor(task_id="wait_for_file", ..., deferrable=True)
# or, for a sensor without a deferrable version:
S3KeySensor(task_id="wait_for_file", ..., mode="reschedule", poke_interval=300)
```

**How to fix.** Make long-waiting sensors deferrable, or set mode="reschedule", so they free their worker slot between checks instead of holding it for the whole wait.

**When it's fine to acknowledge.** The sensor must react within seconds, faster than reschedule mode or the triggerer allows. The reason must say why the sensor must keep a worker slot (for example it needs sub-minute reaction).

### dagrun_timeout

**Runs have a time limit** · reliability · 8 points · can't be acknowledged

**Why it matters.** A stuck run still counts as active. With max_active_runs=1, the next scheduled run waits behind it forever and the data silently stops updating. dagrun_timeout fails the stuck run, so the failure alert fires and the schedule moves on.

Bad:

```python
DAG("daily_sales", schedule="@daily")  # no dagrun_timeout
```

Good:

```python
DAG(..., dagrun_timeout=timedelta(hours=2))
```

**How to fix.** Set dagrun_timeout on the DAG so a stuck run cannot block the next one.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### depends_on_past

**Safe use of depends_on_past** · reliability · 8 points · can be acknowledged

**Why it matters.** depends_on_past=True makes a task wait until the same task succeeded in the previous run. After one failure, later runs stop: their tasks never start, the runs stay running, and Airflow logs no error. With catchup=True and more than one active run, every missed interval starts at once and all of them get stuck. dagrun_timeout doesn't fix it: it fails those runs but marks their tasks skipped, which counts as done, so later runs go on without the failed interval. Set in default_args, depends_on_past applies to every task, usually by accident.

Bad:

```python
DAG("daily_ingest", schedule="@daily", catchup=True,
    default_args={"depends_on_past": True})  # up to 16 runs at once
```

Good:

```python
DAG("daily_ingest", schedule="@daily", catchup=True, max_active_runs=1)
BashOperator(task_id="load_day", ..., depends_on_past=True)  # only where needed
```

**How to fix.** Set depends_on_past only on the tasks that need it, not in default_args. With catchup=True, also set max_active_runs=1, so a failure holds up one run, not all.

**When it's fine to acknowledge.** Every run must build on the one before (for example each run applies changes to the previous day's table), failures are alerted, and someone fixes the failed run before later runs may go on.

### execution_timeout

**Tasks have a time limit** · reliability · 10 points · can't be acknowledged

**Why it matters.** A task that hangs (a stuck query, a connection that never times out) holds its worker slot forever. Other tasks queue behind it, and because it never fails, no alert fires. Set the limit a little above the task's longest normal run.

Bad:

```python
BashOperator(task_id="load", bash_command="load.sh")  # can run forever
```

Good:

```python
default_args={"execution_timeout": timedelta(minutes=30)}
```

**How to fix.** Set execution_timeout in default_args so a hung task frees its worker slot.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### retries

**Tasks retry on failure** · reliability · 15 points · can be acknowledged

**Why it matters.** Most task failures are transient: a network blip, a database restart, a rate limit. Without retries, one of them fails the whole run and someone has to clear it by hand, often at night. Retries are only safe for idempotent tasks (running twice gives the same result), so make tasks idempotent first.

Bad:

```python
default_args={"retries": 0}
```

Good:

```python
default_args={
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}
```

**How to fix.** Set retries (for example 2) in default_args so transient errors recover on their own.

**When it's fine to acknowledge.** The task is not idempotent, so a retry would duplicate data (for example it appends rows without de-duplicating), and it can't be made idempotent yet.

### auto_pause

**Stops after repeated failures** · scheduling · 3 points · can be acknowledged

**Why it matters.** A broken DAG on a frequent schedule fails on every run, all night: alerts pile up and worker slots are wasted. max_consecutive_failed_dag_runs pauses it after a few failures in a row, which stops the noise and is itself a clear signal.

Bad:

```python
DAG("sync_orders", schedule="*/5 * * * *")  # fails forever if broken
```

Good:

```python
DAG(..., max_consecutive_failed_dag_runs=3)
```

**How to fix.** Set max_consecutive_failed_dag_runs (e.g. 3) so a broken DAG pauses instead of failing all night.

**When it's fine to acknowledge.** Something else stops the DAG when it keeps failing, for example on-call pauses it by hand, or it must keep trying until a source comes back. The reason must say what stops this DAG when it keeps failing (e.g. on-call pausing it by hand).

### catchup

**No surprise backfills** · scheduling · 5 points · can be acknowledged

**Why it matters.** With catchup=True, unpausing the DAG, or deploying it with an old start_date, starts a run for every missed interval, possibly hundreds at once. They can flood the warehouse and the systems the DAG reads from.

Bad:

```python
DAG("daily_sales", schedule="@daily", catchup=True)
```

Good:

```python
DAG(..., catchup=False)
```

**How to fix.** Set catchup=False unless you really want every missed interval to run.

**When it's fine to acknowledge.** The DAG must process every interval, for example an ingest that loads one partition per day and has to fill the gaps after an outage. Limit max_active_runs as well.

### max_active_runs

**Bounded parallel runs** · scheduling · 5 points · can be acknowledged

**Why it matters.** Without a limit, a backfill or catchup can start many runs at once, all reading the same sources and writing the same tables. For most ETL, runs of the same DAG should not overlap. Dagwick accepts up to 4.

Bad:

```python
DAG("daily_sales", schedule="@daily")  # max_active_runs defaults to 16
```

Good:

```python
DAG(..., max_active_runs=1)
```

**How to fix.** Set max_active_runs (1 for most ETL) so backfills cannot flood the warehouse.

**When it's fine to acknowledge.** Runs are independent (for example each one processes its own partition) and the systems they use can take the parallel load.

### schedule

**Has a schedule** · scheduling · 5 points · can be acknowledged

**Why it matters.** A DAG without a schedule only runs when something triggers it: a person, another DAG or the API. That is right for some DAGs, but often the schedule was simply forgotten and the DAG never runs. Asset schedules count as a schedule.

Bad:

```python
DAG("daily_sales", schedule=None)
```

Good:

```python
DAG(..., schedule="0 3 * * *")
```

**How to fix.** Set schedule= (cron, timedelta or assets). Leave it None only if another DAG triggers this one.

**When it's fine to acknowledge.** The DAG is meant to be triggered, for example by another DAG, the API or a person (a manual reprocessing DAG).

### hardcoded_secrets

**No secrets in the DAG file** · security · 10 points · can't be acknowledged

**Why it matters.** A credential in a DAG file is in the repository's history for good, in every clone, and in Airflow's database, where the DAG's code is shown to everyone who can read the DAG. Connections and secrets backends keep it out of the code and let you rotate it.

Bad:

```python
PASSWORD = "s3cr3t-p4ss"  # in the DAG file
```

Good:

```python
conn = BaseHook.get_connection("warehouse")  # inside the task
bash_command="load.sh {{ conn.warehouse.password }}"
```

**How to fix.** Move the credential into an Airflow Connection or a secrets backend and read it when the task runs. Treat the value as leaked: it is in the DAG file, its history and Airflow's database, so rotate it.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### current_imports

**Uses current Airflow imports** · structure · 3 points · can't be acknowledged

**Why it matters.** Airflow 3 moved many classes: operators to provider packages, the DAG authoring API to airflow.sdk. The old paths still work through deprecation shims that a future Airflow release removes. When that happens, the file fails to import and every DAG in it disappears.

Bad:

```python
from airflow.operators.bash import BashOperator
```

Good:

```python
from airflow.providers.standard.operators.bash import BashOperator
# not: from airflow.operators.bash import BashOperator
```

**How to fix.** Import from the new location Airflow points to. The old paths only work through deprecation shims that a future Airflow release removes.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### decomposition

**Split into steps** · structure · 5 points · can be acknowledged

**Why it matters.** A DAG with a single task does everything in one step. A failure near the end reruns the whole job, and Airflow can't show which part is slow or broken.

Bad:

```python
@task
def everything():
    extract()
    transform()
    load()
```

**How to fix.** Split the work into smaller tasks so a failure retries only the broken step.

**When it's fine to acknowledge.** The work really is one atomic step, for example a single SQL statement or triggering an external job.

### file_name

**File named after the DAG** · structure · 3 points · can't be acknowledged

**Why it matters.** When a DAG fails, people search the repository for its dag_id. A file named after the DAG puts its code one step away. Files that define several DAGs (DAG factories) are skipped.

Bad:

```python
# dags/sales.py
DAG("daily_sales")
```

Good:

```python
dags/load_payments.py   ->   DAG(dag_id="load_payments")
```

**How to fix.** Name the file <dag_id>.py (one DAG per file), so the DAG's code is easy to find.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

### isolated_tasks

**Tasks are connected** · structure · 3 points · can be acknowledged

**Why it matters.** A task with no upstream and no downstream task is usually a forgotten >>. Airflow runs it as soon as the DAG run begins, in parallel with everything else, so it can read data before it is written, and the graph no longer shows where it belongs. DAGs where most tasks have no dependencies, such as a batch of independent jobs, are skipped.

Bad:

```python
extract = BashOperator(task_id="extract", bash_command="extract.sh")
load = BashOperator(task_id="load", bash_command="load.sh")
report = BashOperator(task_id="report", bash_command="report.sh")
extract >> load  # report is not connected: it starts before the data is loaded
```

Good:

```python
extract >> load >> report
```

**How to fix.** Connect the task with >> or chain() so it runs in the right order.

**When it's fine to acknowledge.** The task is independent of the others on purpose, for example housekeeping that cleans up old files while the pipeline runs.

### naming

**Consistent names** · structure · 3 points · can't be acknowledged

**Why it matters.** dag_ids and task_ids show up in URLs, logs, metric names and CLI commands. snake_case ids are consistent and easy to type, search and grep; a mix of styles makes DAGs harder to find.

Bad:

```python
DAG("DailySales")
EmptyOperator(task_id="Load-Payments")
```

Good:

```python
EmptyOperator(task_id="load_payments")  # not "LoadPayments"
```

**How to fix.** Use snake_case for dag_id and task_ids.

**When it's fine to acknowledge.** Never: this check can't be acknowledged.

<!-- check-reference:end -->
<!-- fmt:on -->
