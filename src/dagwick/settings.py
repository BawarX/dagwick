"""Optional, non-secret settings read from Airflow's own configuration.

    [dagwick]
    seasonal_moods = off         # off (default, experimental) | auto | comma-separated mood ids

The same value can be set with the env var AIRFLOW__DAGWICK__SEASONAL_MOODS.
"""

from __future__ import annotations

import logging

log = logging.getLogger(__name__)

# Must match SEASON_ORDER in ui/src/season.ts.
SEASONAL_MOODS = (
    "newroz",
    "eid",
    "language-day",
    "christmas",
    "new-year",
    "halloween",
    "ramadan",
    "birthday",
)


def parse_seasonal_moods(raw: str | None) -> str | list[str]:
    """Return "auto", "off", or the list of known mood ids (unknown ids are ignored).

    Seasonal moods are experimental, so anything unset or empty means "off".
    """
    value = (raw or "off").strip().lower()
    if value in ("auto", "on", "true"):
        return "auto"
    if value in ("", "off", "none", "false"):
        return "off"
    wanted = [part.strip() for part in value.split(",") if part.strip()]
    unknown = [m for m in wanted if m not in SEASONAL_MOODS]
    if unknown:
        log.warning("dagwick: ignoring unknown seasonal_moods %s", unknown)
    known = [m for m in wanted if m in SEASONAL_MOODS]
    return known or "off"


def seasonal_moods() -> str | list[str]:
    try:
        from airflow.configuration import conf

        raw = conf.get("dagwick", "seasonal_moods", fallback="off")
    except Exception:  # never let a config problem break the page
        log.exception("dagwick: could not read [dagwick] seasonal_moods; using off")
        raw = "off"
    return parse_seasonal_moods(raw)
