# Seasonal themes for all of Airflow (config only)

> **Experimental.** Nothing here is applied unless an admin sets it, and it is
> decoration only: Airflow's behaviour and Dagwick's scores do not change.

These are plain Airflow theme files. They decorate **every page of Airflow**
through Airflow's own `[api] theme` setting (Airflow 3.2 or newer). There is no
plugin, no package and nothing to install: the JSON file *is* the theme.

| Theme | When | What you see |
| --- | --- | --- |
| [`christmas/snow.json`](christmas/snow.json) | Christmas | Snow falling at three depths behind the page, swaying on the way down; pale blue flakes in light mode. [Preview](christmas/snow.png) |
| [`halloween/halloween.json`](halloween/halloween.json) | Halloween | Airflow turns pumpkin orange. A purple dusk, a full moon, bats crossing the top of the page and a cobweb in the corner. [Preview](halloween/halloween.png) |
| [`newroz/newroz.json`](newroz/newroz.json) | Newroz, 21 March | Airflow turns spring green. The Kurdish sun, mountains along the bottom with bonfires on the peaks, and embers rising. [Preview](newroz/newroz.png) |
| [`language-day/language-day.json`](language-day/language-day.json) | Kurdish Language Day, 15 May | Letters of the Kurdish alphabet drifting up behind the page in gold and red. Airflow keeps its own colours. [Preview](language-day/language-day.png) |

Every theme keeps Airflow readable:

- The scenery is drawn **behind** the page and ignores the mouse, so nothing
  ever moves over text or blocks a click.
- All movement stops for viewers who prefer reduced motion.
- Light and dark mode are both covered.
- Nothing is loaded from the network: the drawings are inline CSS and SVG.

The Dagwick plugin has its own, smaller [seasonal moods](../docs/moods.md) for
its pages. The two are independent and look good together.

## Install a theme

A theme is the value of Airflow's `[api] theme` setting on the **api-server**.
Pick a file, set it in one of these ways, then restart the api-server.

**Environment variable** (Docker, Kubernetes, systemd):

```bash
export AIRFLOW__API__THEME="$(cat themes/christmas/snow.json)"
```

In Kubernetes, put the file's content in the api-server's `AIRFLOW__API__THEME`
variable, for example from a ConfigMap:

```bash
kubectl create configmap airflow-theme --from-file=theme=themes/christmas/snow.json
```

```yaml
env:
  - name: AIRFLOW__API__THEME
    valueFrom:
      configMapKeyRef: { name: airflow-theme, key: theme }
```

**`airflow.cfg`**: paste the JSON under `[api]`, with every line of it indented
so that configparser reads it as one value:

```ini
[api]
theme =
    {
      "globalCss": {
        ...
      }
    }
```

Check what Airflow sees with `airflow config get-value api theme`.

Already using a theme (brand colours or a logo)? Copy the `globalCss` block,
and the `tokens` block if the theme has one, into your existing JSON.

## Remove a theme

Unset the variable, or delete the `theme` line from `airflow.cfg`, and restart
the api-server. The theme changed nothing else, so there is nothing to clean up.

```bash
unset AIRFLOW__API__THEME
```

## Try one locally

```bash
AIRFLOW__API__THEME="$(cat themes/newroz/newroz.json)" ./dev/run.sh
```

## Notes

- Airflow 3.2 or newer. Older versions have no `[api] theme` setting and
  ignore it.
- CSS cannot read the date, so an admin switches themes by hand each season.
  (Dagwick's own moods follow the calendar on their own.)
- The themes change Airflow's `brand` colours (Halloween, Newroz) or leave them
  alone (snow, Language Day). Text contrast comes from Airflow's own palette
  logic either way.

## Add or change a theme

The JSON files are generated: edit [`make_themes.py`](make_themes.py), run
`python3 themes/make_themes.py`, add a row to the table above and a preview
screenshot. `tests/test_themes.py` checks that the files match the script and
that every theme follows the rules above (scenery only on `html`/`body`
pseudo-elements, `z-index: -1`, `pointer-events: none`, a
`prefers-reduced-motion` block, no network requests).
