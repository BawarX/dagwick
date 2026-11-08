# Seasonal themes for all of Airflow (no plugin)

> **Experimental, not production-ready.** Nothing here is applied unless you
> set it yourself. Do not use these in production yet.

These are plain Airflow theme files. They decorate the **whole** Airflow UI
using Airflow's built-in `[api] theme` setting (`globalCss`). Nothing is
installed and no plugin is needed.

| Theme | Status | Preview |
| --- | --- | --- |
| [`christmas/snow-v1.json`](christmas/snow-v1.json) | v1: simple drifting snow, a first draft to build on | [screenshot](christmas/snow-v1.png) |

## Apply a theme

Set the file's content as Airflow's theme, then restart the api-server:

```bash
export AIRFLOW__API__THEME="$(cat themes/christmas/snow-v1.json)"
```

In Kubernetes, put the same JSON in the api-server's `AIRFLOW__API__THEME`
environment variable. Remove it after the holiday.

## Notes

- Requires Airflow 3 (the `[api] theme` setting with `globalCss`).
- CSS cannot read the date, so someone switches themes per season.
- If you already set a theme (for example brand colors), merge `globalCss` into
  your existing JSON instead of replacing it.
- Animation stops for viewers who prefer reduced motion.
