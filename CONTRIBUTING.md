# Contributing

Thanks for helping. A few rules keep Dagwick safe to install anywhere.

## Development setup

You need [uv](https://docs.astral.sh/uv/) and Node.js 20+.

```bash
uv sync                 # dev environment (Airflow is installed here for tests only)
uv run pytest           # tests with a 70 % coverage gate
uv run ruff check       # lint
./dev/run.sh            # build the UI and start a sandbox Airflow on http://localhost:8080
```

The sandbox keeps everything in `dev/airflow_home/` and loads only the demo
DAGs in `dev/dags/`.

## Rules

1. **Branch from `dev`** and open your pull request against `dev`.
2. **Keep the package dependency-free.** Do not add anything to
   `[project].dependencies`.
3. **Add tests** for every behavioural change. `uv run pytest` must pass with
   coverage of at least 70 %.
4. **Lint and format:** `uv run ruff check` and `uv run ruff format`.
5. **UI changes:** run `npm run build` in `ui/` and commit the updated
   `src/dagwick/static/dagwick.js`.
6. **Document user-facing changes** in `CHANGELOG.md` under *Unreleased*.
7. **Report security issues privately** (see `SECURITY.md`).

## Writing a check

```python
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

Always test checks against a **serialized** DAG (see `tests/conftest.py`):
that is what Dagwick scores in production, and Airflow fills defaults during
serialization that can make a naive check always pass.
