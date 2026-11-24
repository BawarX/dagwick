---
name: local-airflow
description: Start, restart or stop the local Airflow sandbox for dagwick and open Dagwick in the browser. Use when the user asks to "bring up / run / start local Airflow", "let me see it", "open Airflow", "show me in Airflow", or wants to try a change, branch or PR in the real UI.
---

# Local Airflow sandbox for dagwick

The user asks for this often. Go straight to a running Airflow with the page open;
don't ask questions first. No login is needed in this sandbox.

## Start (or restart) it

Run each step as its own command, from the repo root.

1. **Free port 8080.** An old sandbox, or a leftover api-server, often still holds it:
   ```bash
   pkill -f 'airflow (api-server|scheduler|dag-processor|triggerer|standalone)'
   lsof -tiTCP:8080 -sTCP:LISTEN | xargs kill 2>/dev/null; true
   ```
   Stop any background task from an earlier start too (TaskStop), so it isn't left dangling.
2. **Start it in the background** (`run_in_background: true`). `dev/run.sh` rebuilds the UI,
   runs `uv sync` and starts `airflow standalone` with the demo DAGs from `dev/dags`:
   ```bash
   exec ./dev/run.sh > <scratchpad>/runsh.log 2>&1
   ```
3. **Wait until it's healthy.** Don't use `sleep`; let curl retry:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' --retry 80 --retry-delay 3 --retry-all-errors --max-time 5 \
     http://localhost:8080/api/v2/monitor/health
   ```
4. **Check that Dagwick answers before saying it works.** The API needs a token even in this
   sandbox (the browser gets one automatically; curl doesn't):
   ```bash
   T=$(curl -s http://localhost:8080/auth/token | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
   curl -s --retry 30 --retry-delay 3 --retry-all-errors -f -H "Authorization: Bearer $T" \
     http://localhost:8080/dagwick/api/fleet | python3 -c 'import sys,json;print(len(json.load(sys.stdin)["dags"]),"DAGs scored")'
   ```
   The DAG processor needs about 10–30 s after startup before DAGs appear.
5. **Open the page:** `open <url>`, then tell the user what to look at.

## Pages

| What | URL |
| --- | --- |
| Airflow home | http://localhost:8080 |
| Dagwick fleet page | http://localhost:8080/plugin/dagwick-fleet |
| Fleet filtered by owner/tag | http://localhost:8080/plugin/dagwick-fleet?owner=data-team&tag=ingest |
| One DAG's Dagwick tab | http://localhost:8080/dags/<dag_id>/plugin/dagwick (from `DagLink` in `ui/src/components.tsx`) |
| Preview a seasonal mood | add `?dagwick_mood=halloween` (or newroz, christmas, …) to a Dagwick page |

Demo DAGs in `dev/dags`: `demo_shining_pipeline` (A, 100), `demo_average_pipeline` (C),
`DemoLegacyJob` (F), `demo_acknowledged_ingest` (acknowledged checks) and the
`fleet_demo_dags.py` set. Owners are `data-team` and `airflow`; most DAGs have tags.

## After a change

- **UI changes (`ui/src/`):** `npm run build --prefix ui`, then a hard refresh (⌘⇧R). The
  api-server serves the bundle from disk, so no restart is needed.
- **Python changes (`src/dagwick/`):** restart the sandbox (steps 1–4). The api-server only
  loads plugin code at startup.
- **DAG file changes:** wait ~10 s for the DAG processor (`REFRESH_INTERVAL=10`).
- **To show a PR or branch:** check it out first (`gh pr checkout <n>`), rebuild the UI, then
  restart. Afterwards switch the user's repo back to the branch they were on.

## Other setups (only when asked)

- **Login required** (to test auth): run `airflow standalone` with
  `AIRFLOW__CORE__SIMPLE_AUTH_MANAGER_USERS="admin:admin"` instead of `..._ALL_ADMINS=True`, and a
  fresh `AIRFLOW_HOME` in the scratchpad. The password is in
  `$AIRFLOW_HOME/simple_auth_manager_passwords.json.generated`.
- **Another Airflow version:** make a venv in the scratchpad (`uv venv --python 3.10`,
  `uv pip install "apache-airflow~=3.1.0"`, `uv pip install -e . --no-deps`), then start it with
  that venv's `airflow` first on `PATH`.

## Stop it

```bash
pkill -f 'airflow (api-server|scheduler|dag-processor|triggerer|standalone)'
lsof -tiTCP:8080 -sTCP:LISTEN | xargs kill 2>/dev/null; true
```

## Rules

- `dev/airflow_home` (the sandbox's database) is git-ignored; delete it to start fresh.
- Never commit anything the sandbox creates. Put logs and scratch DAGs in the scratchpad, not
  in the repo.
- When you finish, say which URL is open and what to look at, and offer to stop the sandbox.
