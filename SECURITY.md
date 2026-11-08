# Security policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report them
privately through GitHub: open this repository's **Security** tab and choose
**Report a vulnerability**.

We aim to acknowledge reports within 3 working days and will keep you updated
until a fix is released.

## Supported versions

Only the latest released minor version receives security fixes.

## Security design

Dagwick runs inside the Airflow api-server. It is designed to add no new attack
surface beyond what Airflow already exposes:

- **Same permissions as Airflow.** Every endpoint uses Airflow's own security
  dependencies (`requires_access_dag`, `get_authorized_dag_ids`). A user only
  sees scores for DAGs they can already read in the Airflow UI.
- **Read-only.** Dagwick reads serialized DAGs from the metadata database. It
  never writes to the database, never executes DAG code, and never makes network
  calls.
- **No secrets.** Dagwick reads no Airflow Variables, Connections or
  credentials. Its only setting, `[dagwick] seasonal_moods`, is optional and
  cosmetic.
- **Safe errors.** Error responses contain only a generic message and a
  reference id. Details go to the server log, never to the browser.
- **Same origin only.** No CORS headers are added.
- **Static files from an allowlist.** The static route never builds file paths
  from user input.
- **No third-party code in the browser.** The UI bundle uses the React that
  Airflow already provides. It loads nothing from a CDN, uses no
  `innerHTML`, and stores nothing in `localStorage`.
- **No runtime dependencies.** The package declares no dependencies of its own.
