# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - unreleased

### Added

- **Seasonal moods (experimental, off by default).** During holidays the lantern dresses up and the page
  header gets an animated scene: falling snow at Christmas, bats at Halloween,
  bonfires and govend dancers at Newroz, Kurdish letters on Kurdish Language
  Day, lanterns at Ramadan, kulîçe at Eid, fireworks at New Year. Each mood
  shows a short English greeting. Decoration only: scores never change.
- One optional, non-secret setting: `[dagwick] seasonal_moods`
  (`off` by default | `auto` | a list of moods). Viewers can also hide moods for themselves.
- Preview any mood with `?dagwick_mood=<id>`.
- New check, **File named after the DAG**: warns when a DAG's file is not
  `<dag_id>.py`, so the code is easy to find from the DAG name. Files that
  define several DAGs (DAG factories) are skipped.
- Checks can take an optional second parameter, `context`, with facts that
  are not on the DAG itself (for example how many DAGs share its file).
- New checks that read the DAG file's source as Airflow stored it, without
  running it: **No `Variable.get` at parse time** and **Uses current Airflow
  imports** (paths Airflow itself marks as deprecated, with the new location).
- New check, **Fast to parse**: warns from 5 s and fails from 20 s, using the
  parse time Airflow records for each file.
- New category, **Performance**.
- `Context` gains `source` and `parse_seconds`.
- **Acknowledge a check on purpose.** A `# dagwick: ack <check> -- <reason>`
  comment in the DAG file marks a check the DAG breaks on purpose. It shows
  greyed out with the reason, is left out of the score and of "Most common
  issues", and is counted on the fleet page. Only 8 checks allow it
  (see `docs/checks.md`); a reason is required.
- New status `ack` in the API; check results gain `ack_reason` and `ack_note`.
  `@check` gains `acknowledgeable` and `ack_hint`.
- **No `Variable.get` at parse time** also checks the body of `@dag`
  functions, which runs on every parse; `@task` functions inside stay deferred.
- New check, **No secrets in the DAG file**, in a new **Security** category:
  flags string values assigned to secret-looking names (`password`, `token`,
  `api_key`, `client_secret`, ...), known credential formats (AWS key ids,
  private keys, GitHub and Slack tokens, Slack webhooks, Google API keys) and
  passwords inside connection URIs. Only the line and the kind are shown,
  never the value. It cannot be acknowledged.

- **Score history** on the DAG tab: the score of each of the last 20 DAG
  versions, re-scored from the serialized DAG and source code Airflow keeps
  for every version, with which checks started or stopped passing at each
  step. Nothing is stored by Dagwick; each version's score is cached in
  memory since a version never changes. Only code checks count (parse time
  and other run-time facts describe the present, not past versions).
- New endpoint `GET /dagwick/api/history?dag_id=...`, behind the same DAG
  permission as `/api/score`.

### Fixed

- Fleet headline no longer contradicts the stats: it describes the average
  grade and then states how many DAGs need care.
- "need care" now counts grades C to F, so it and "healthy (A–B)" add up to
  the number of DAGs.
- Layout follows the width Dagwick actually has (container queries), so the
  DAG tab inside Airflow's split panel gets the narrow layout.
- Narrow screens: grade labels are no longer cut off, the lamp and score ring
  sit side by side, and the fleet's "Most common issues" moves below the list.
- Category cards no longer leave one card alone on the last row.
- Every failing check opens with its fix by default.
- On screens wider than 1440 px the page is centered instead of sticking to
  the left with empty space on the right.

## [0.1.0] - 2026-11-08

### Added

- **Dagwick tab** on every DAG page: a score from 0 to 100, a grade from A to F,
  a lantern mascot, the next step to the next grade, the affected tasks, and a
  fix with a copyable code example for every check that does not pass.
- **Fleet page** in the Airflow sidebar: every DAG the user can read, ranked by
  score, with grade filters, search, sort, and the most common issues.
- 14 built-in checks covering reliability, observability, scheduling,
  ownership and structure.
- `dagwick.checks` entry point so other packages can add or override checks.
- Scores reuse Airflow's own permission checks and are cached per DAG version.
