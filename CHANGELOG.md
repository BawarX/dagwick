# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Seasonal themes for all of Airflow, built in.** A new Themes tab next to
  Fleet lists them. By default each theme appears on its dates on every Airflow
  page and goes away afterwards, with nothing to set in Airflow's
  configuration. The first theme is Christmas snow (18 December to 2 January):
  snowflakes drift over Airflow, some carried sideways by the wind, snow
  settles on top of cards, and a drift lies along the bottom. The snow is moved
  by the graphics card, so pages stay smooth; clicks go through it, and viewers
  who prefer reduced motion get still snow. Each viewer can switch off "Show
  themes on their dates", and apply or remove any theme whenever they like; the
  change shows at once, without a reload. Choices are saved in their browser,
  and Dagwick still writes nothing to Airflow's database. Any theme the admin
  already set in Airflow is kept.
- **Halloween theme** (24 October to 1 November): small dark bats flutter
  across the top, ghosts drift across Airflow,
  embers rise, a full moon with seas, craters and thin clouds peeks from the corner, darkness closes in from the
  edges, glowing eyes blink in the fog along the bottom, a small cobweb hangs in
  the corner, black gnarled branches lie on top of the cards (like the snow at
  Christmas), and spiders dangle from them. Airflow's sidebar, with the user
  menu, always stays clear of the decorations. Switching
  between themes without a reload clears the old theme first.
- **Download the fleet as CSV.** A button on the fleet page saves the DAGs
  shown (with the current search and filters) as a CSV file: dag_id, owners,
  tags, paused, score, grade, failing and warning checks, runs and success
  rate over 30 days. It is built in the browser from `/api/fleet`, so it holds
  only the DAGs the user may read. Cells that a spreadsheet would run as a
  formula are written as text.
- `/api/fleet` includes each DAG's `tags`.
- **Tune the scoring in `airflow.cfg`.** Three optional `[dagwick]` settings:
  `disabled_checks` leaves checks out of every score, `weights` changes how
  many points a check is worth, and `grades` sets the grade thresholds.
  Invalid values are logged and ignored. The DAG tab, the fleet page and
  `dagwick check` all follow them. See `docs/checks.md`.
- `/api/checks` shows each check's `default_weight` and whether it is
  `enabled`; `/api/config` includes the grade thresholds.
- **Check packs.** A guide, "Write a check pack", in `docs/checks.md`, and an
  example pack in `examples/dagwick-pack-example` with one check and its
  tests. The guide says which parts of the check interface are stable.
- Each check now records which pack it came from: `pack` in `/api/checks` and
  in score reports, and a tag on pack checks in the DAG tab.

## [0.2.0] - 2026-11-09

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
- New check, **Sensors free their worker slot**: warns when a sensor that
  runs in poke mode typically waits a minute or more per run, holding a
  worker slot the whole time. Which tasks are sensors comes from the
  serialized DAG, how each one waits from the DAG source (`mode`,
  `deferrable`, `*Async` classes, `default_args`, `@task.sensor`), and how
  long it waits from the last 30 days of runs. Rescheduled sensors are proven
  by their `task_reschedule` rows. When the evidence is unclear the check
  skips instead of guessing. It can be acknowledged with a reason.
- `Context` gains `sensor_tasks`, `sensor_runs` and `default_deferrable`.
- **Run health** on the DAG tab, next to the score but not part of it: share
  of runs that succeeded, share of tasks that needed a retry, the typical
  run time with its trend (last 7 days against the rest of the window) and
  the last run, all over the last 30 days. The fleet page shows each DAG's
  success rate. Read from the runs Airflow already records; nothing is stored.
- New endpoint `GET /dagwick/api/health?dag_id=...`, behind the same DAG
  permission as `/api/score`.
- **Score history** on the DAG tab: the score of each of the last 20 DAG
  versions, re-scored from the serialized DAG and source code Airflow keeps
  for every version, with which checks started or stopped passing at each
  step. Nothing is stored by Dagwick; each version's score is cached in
  memory until that version's DAG or source changes (Airflow updates the
  newest version in place until the DAG runs again). Only code checks
  count (parse time and other run-time facts describe the present, not past
  versions).
- New endpoint `GET /dagwick/api/history?dag_id=...`, behind the same DAG
  permission as `/api/score`.
- **`dagwick check` command** and a **pre-commit hook**: grade DAG files
  before they are merged, with the same checks as the UI (acknowledgements,
  source checks and parse time included), and exit with status 1 below
  `--min-grade`, or 2 when a file fails to load. `--json` prints the reports.
  It imports the DAG files, so it is meant for developer machines and CI; the
  plugin itself still never runs DAG code.

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
