from __future__ import annotations

import pytest

from dagwick import settings
from dagwick.settings import SEASONAL_MOODS, parse_seasonal_moods


@pytest.mark.parametrize("raw", [None, "", "  ", "auto", "AUTO", " on ", "true"])
def test_auto(raw):
    assert parse_seasonal_moods(raw) == "auto"


@pytest.mark.parametrize("raw", ["off", "OFF", "none", "false"])
def test_off(raw):
    assert parse_seasonal_moods(raw) == "off"


def test_list_keeps_known_ids_in_given_order():
    assert parse_seasonal_moods("newroz, christmas ,halloween") == [
        "newroz",
        "christmas",
        "halloween",
    ]


def test_unknown_ids_are_ignored(caplog):
    assert parse_seasonal_moods("newroz,valentines") == ["newroz"]
    assert "valentines" in caplog.text


def test_only_unknown_ids_means_off():
    assert parse_seasonal_moods("valentines") == "off"


def test_ids_match_the_ui():
    import re
    from pathlib import Path

    ts = (Path(__file__).parents[1] / "ui" / "src" / "season.ts").read_text()
    block = ts.split("export const SEASON_ORDER")[1].split("= [", 1)[1].split("];")[0]
    assert re.findall(r'"([^"]+)"', block) == list(SEASONAL_MOODS)


def test_reads_airflow_config(monkeypatch):
    monkeypatch.setenv("AIRFLOW__DAGWICK__SEASONAL_MOODS", "christmas,newroz")
    assert settings.seasonal_moods() == ["christmas", "newroz"]


def test_config_endpoint_shape(monkeypatch):
    from dagwick import api

    monkeypatch.setenv("AIRFLOW__DAGWICK__SEASONAL_MOODS", "off")
    monkeypatch.delenv("AIRFLOW__DAGWICK__GRADES", raising=False)
    assert api.config() == {
        "seasonal_moods": "off",
        "grades": {"A": 90, "B": 75, "C": 60, "D": 40},
    }


def test_config_endpoint_follows_configured_grades(monkeypatch):
    from dagwick import api

    monkeypatch.setenv("AIRFLOW__DAGWICK__GRADES", "A:95, D:30")
    assert api.config()["grades"] == {"A": 95, "B": 75, "C": 60, "D": 30}


def test_on_by_default_when_not_configured(monkeypatch):
    monkeypatch.delenv("AIRFLOW__DAGWICK__SEASONAL_MOODS", raising=False)
    assert settings.seasonal_moods() == "auto"
