# AGENTS.md — dagwick

Dagwick is a **Python library** published to PyPI: an Apache Airflow 3 plugin
that scores DAG quality and shows the result inside the Airflow UI (a tab on
every DAG and a fleet page in the sidebar). It is installed into an existing
Airflow environment; it is not deployed on its own.

- **Package:** `dagwick` on PyPI (`pip install dagwick`)
- **Stack:** Python 3.10 – 3.15 (backend, runs inside the Airflow api-server) +
  React/TypeScript built with Vite (UI bundle shipped inside the wheel)
- **Supported hosts:** Apache Airflow 3.1+

## Non-negotiables

- **No runtime dependencies.** `[project].dependencies` stays empty. Dagwick
  uses the Airflow and FastAPI already installed in the host. Adding a
  dependency could change a user's Airflow environment.
- **Read-only.** Never write to the Airflow database, execute DAG code, or make
  network calls.
- **Reuse Airflow's security.** Every endpoint must use Airflow's security
  dependencies (`requires_access_dag`, `requires_authenticated`, `get_user` +
  `get_authorized_dag_ids`). Never add an unauthenticated endpoint.
- **No secrets.** Settings are optional, non-secret and live under `[dagwick]`
  in `airflow.cfg` (`seasonal_moods`, `disabled_checks`, `weights`, `grades`).
- **Errors never leak internals:** return a generic message plus a reference
  id; log the details server-side.
- **Never push to `main`, tag, or publish a release yourself.** Publishing a
  GitHub Release publishes to PyPI; only maintainers do that.
- **Behavioural changes ship with tests;** coverage stays ≥ 70 % (enforced by
  `pytest --cov-fail-under=70`).

## How to run this repository

```bash
uv sync                      # dev environment (includes Airflow, for tests only)
uv run pytest                # tests + coverage gate
cd ui && npm test            # UI tests (seasonal mood dates)
uv run ruff check && uv run ruff format --check
cd ui && npm ci && npm run build   # rebuild src/dagwick/static/dagwick.js
uv build                     # wheel + sdist into dist/
./dev/run.sh                 # throwaway Airflow on http://localhost:8080 with the demo DAGs
```

## Layout

```text
src/dagwick/core.py        Check registry, scoring, grades.
src/dagwick/checks/        Built-in checks, one module per category.
src/dagwick/api.py         FastAPI app mounted at /dagwick (score, fleet, checks, static).
src/dagwick/plugin.py      AirflowPlugin: the FastAPI app + two React apps.
src/dagwick/settings.py    Optional [dagwick] settings (seasonal_moods).
ui/src/season.ts           Seasonal mood dates (tested in season.test.ts).
ui/src/SeasonEffects.tsx   Seasonal header scenes and the greeting.
src/dagwick/static/        Built UI bundle (committed; CI fails if it is stale).
ui/src/                    UI source (React + TypeScript).
tests/                     pytest suite (uses real serialized DAGs).
dev/                       Local sandbox: run.sh and demo DAGs. Not packaged.
```

## Conventions

- **Version** lives only in `src/dagwick/__init__.py` (`__version__`). The
  wheel and the UI footer both read it. Follow Semantic Versioning and update
  `CHANGELOG.md`.
- **Rebuild the UI** after changing `ui/src/` and commit the new
  `src/dagwick/static/dagwick.js`. CI rebuilds it and fails on any difference.
- **New checks** use the `@check` decorator, return a `Finding`, and come with
  tests. A check that cannot fail on Airflow 3 (for example because Airflow
  fills a default) is a bug: verify it against a *serialized* DAG.
- **The brand name** lives in `ui/src/brand.ts` and `src/dagwick/plugin.py`.
- **Lint and format with Ruff.** Do not use black, isort or flake8.
- **Branches:** feature branches go into `dev`; `main` holds released code.
- **Releases** are GitHub Releases tagged `vX.Y.Z` matching `__version__`; the
  release workflow publishes to PyPI with Trusted Publishing (no stored token).
  The full checklist is in `RELEASING.md`. Release notes come from the
  version's dated section in `CHANGELOG.md` (`scripts/release_notes.py`).
