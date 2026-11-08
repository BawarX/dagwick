# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - unreleased

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
