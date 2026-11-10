"""Optional, non-secret settings read from Airflow's own configuration.

    [dagwick]
    seasonal_moods = auto        # auto (default) | off | comma-separated mood ids
    disabled_checks = file_name, naming       # check ids left out of every score
    weights = retries:20, tags:2              # check id:points (positive whole numbers)
    grades = A:90, B:75, C:60, D:40           # lowest score for each grade

Each value can also be set with an env var, for example AIRFLOW__DAGWICK__WEIGHTS.
Every setting is optional. An invalid value is logged and ignored: it never
breaks the plugin.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

log = logging.getLogger(__name__)

# Must match SEASON_ORDER in ui/src/season.ts.
SEASONAL_MOODS = (
    "newroz",
    "eid",
    "language-day",
    "carsema-sor",
    "lantern-festival",
    "christmas",
    "new-year",
    "birthday",
    "diwali",
    "halloween",
    "ramadan",
)


def parse_seasonal_moods(raw: str | None) -> str | list[str]:
    """Return "auto", "off", or the list of known mood ids (unknown ids are ignored).

    Moods are on by default, so anything unset or empty means "auto".
    """
    value = (raw or "").strip().lower() or "auto"
    if value in ("auto", "on", "true"):
        return "auto"
    if value in ("off", "none", "false"):
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

        raw = conf.get("dagwick", "seasonal_moods", fallback="auto")
    except Exception:  # never let a config problem break the page
        log.exception("dagwick: could not read [dagwick] seasonal_moods; using off")
        raw = "off"
    return parse_seasonal_moods(raw)


DEFAULT_GRADES: tuple[tuple[str, float], ...] = (("A", 90), ("B", 75), ("C", 60), ("D", 40))
GRADE_LETTERS = tuple(letter for letter, _ in DEFAULT_GRADES)


@dataclass(frozen=True)
class Scoring:
    """How DAGs are scored: which checks count, their weights, and the grade thresholds."""

    disabled: frozenset[str] = frozenset()
    weights: dict[str, int] = field(default_factory=dict)
    grades: tuple[tuple[str, float], ...] = DEFAULT_GRADES

    @property
    def key(self) -> str:
        """Stable fingerprint, for caches of scores computed with these settings."""
        return "|".join(
            (
                ",".join(sorted(self.disabled)),
                ",".join(f"{k}:{v}" for k, v in sorted(self.weights.items())),
                ",".join(f"{g}:{t:g}" for g, t in self.grades),
            )
        )


def _pairs(raw: str | None, name: str) -> list[tuple[str, str]]:
    """Split "a:1, b:2" into [("a", "1"), ("b", "2")]; malformed entries are logged."""
    pairs = []
    for part in (raw or "").split(","):
        part = part.strip()
        if not part:
            continue
        key, sep, value = part.partition(":")
        if not sep or not key.strip() or not value.strip():
            log.warning("dagwick: ignoring %s entry %r (expected name:number)", name, part)
            continue
        pairs.append((key.strip(), value.strip()))
    return pairs


def parse_disabled_checks(raw: str | None) -> frozenset[str]:
    return frozenset(part.strip() for part in (raw or "").split(",") if part.strip())


def parse_weights(raw: str | None) -> dict[str, int]:
    weights: dict[str, int] = {}
    for check_id, value in _pairs(raw, "weights"):
        try:
            weight = int(value)
        except ValueError:
            weight = 0
        if weight <= 0:
            log.warning(
                "dagwick: ignoring weight %r for %s (use a positive whole number, "
                "or disabled_checks to turn a check off)",
                value,
                check_id,
            )
            continue
        weights[check_id] = weight
    return weights


def parse_grades(raw: str | None) -> tuple[tuple[str, float], ...]:
    """Grade thresholds; letters not given keep their default.

    The result must go A > B > C > D within 0..100, otherwise every threshold
    falls back to the default.
    """
    thresholds = dict(DEFAULT_GRADES)
    for letter, value in _pairs(raw, "grades"):
        letter = letter.upper()
        if letter not in thresholds:
            log.warning("dagwick: ignoring grade %r (grades are A, B, C and D)", letter)
            continue
        try:
            thresholds[letter] = float(value)
        except ValueError:
            log.warning("dagwick: ignoring grade %s:%r (not a number)", letter, value)
    values = [thresholds[letter] for letter in GRADE_LETTERS]
    in_range = all(0 <= v <= 100 for v in values)
    descending = all(a > b for a, b in zip(values, values[1:], strict=False))
    if not (in_range and descending):
        log.warning(
            "dagwick: ignoring grades %r (need A > B > C > D, each from 0 to 100); "
            "using the defaults",
            raw,
        )
        return DEFAULT_GRADES
    return tuple((letter, thresholds[letter]) for letter in GRADE_LETTERS)


def _read(option: str) -> str | None:
    try:
        from airflow.configuration import conf

        return conf.get("dagwick", option, fallback=None)
    except Exception:  # never let a config problem break scoring
        log.exception("dagwick: could not read [dagwick] %s; using the default", option)
        return None


def scoring() -> Scoring:
    """The scoring settings from Airflow's configuration (defaults when unset)."""
    return Scoring(
        disabled=parse_disabled_checks(_read("disabled_checks")),
        weights=parse_weights(_read("weights")),
        grades=parse_grades(_read("grades")),
    )
