# Dagwick

![Dagwick: grade your Airflow DAGs from A to F, right inside the Airflow UI](https://raw.githubusercontent.com/ardalan-jalal/dagwick/main/docs/banner.png)

## Setup

**1. Install** it where Airflow runs:

```bash
pip install dagwick
```

Using Docker? Add `dagwick` to your Airflow image's `requirements.txt`.

**2. Restart** the Airflow api-server.

**3. Open Airflow.** You now have:

- a **Dagwick** tab on every DAG page, and
- a **Dagwick** page in the sidebar that grades all your DAGs.

That's it. There is nothing to configure.

Experimental and off by default: Wick, the little flame, dresses up for holidays
like Newroz, Eid, Christmas and Halloween ([seasonal moods](https://github.com/ardalan-jalal/dagwick/blob/main/docs/moods.md)).

![The Dagwick tab on a DAG](https://raw.githubusercontent.com/ardalan-jalal/dagwick/main/docs/screenshots/dag-tab.png)

![The Dagwick fleet page](https://raw.githubusercontent.com/ardalan-jalal/dagwick/main/docs/screenshots/fleet.png)

## Requirements

- Apache Airflow 3.1 or newer
- Python 3.10 – 3.15

Dagwick has no dependencies of its own, so installing it never changes your
other packages. It is read-only and only shows each user the DAGs they can
already see.

## Remove

```bash
pip uninstall dagwick
```

Then restart the api-server.

## More

- [Seasonal moods, and how to turn them off](https://github.com/ardalan-jalal/dagwick/blob/main/docs/moods.md)
- [What it checks, and how to add your own checks](https://github.com/ardalan-jalal/dagwick/blob/main/docs/checks.md)
- [Roadmap](https://github.com/ardalan-jalal/dagwick/blob/main/ROADMAP.md)
- [Security](https://github.com/ardalan-jalal/dagwick/blob/main/SECURITY.md) · [Contributing](https://github.com/ardalan-jalal/dagwick/blob/main/CONTRIBUTING.md) · [Changelog](https://github.com/ardalan-jalal/dagwick/blob/main/CHANGELOG.md) · [Releasing](https://github.com/ardalan-jalal/dagwick/blob/main/RELEASING.md)
- License: [MIT](https://github.com/ardalan-jalal/dagwick/blob/main/LICENSE)
