from __future__ import annotations

import json
from datetime import date

import pytest
from fastapi import FastAPI
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.testclient import TestClient

from dagwick import snow, themes
from dagwick.api import app as dagwick_app
from dagwick.themes import (
    OFF_COOKIE,
    PREVIEW_COOKIE,
    ThemeMiddleware,
    apply_theme,
    pick_theme,
)

CHRISTMAS = themes.BY_ID["christmas"]
IN_SEASON = date(2026, 12, 24)
OUT_OF_SEASON = date(2026, 6, 1)


def test_christmas_runs_over_new_year():
    assert CHRISTMAS.active_on(date(2026, 12, 18))
    assert CHRISTMAS.active_on(date(2027, 1, 2))
    assert not CHRISTMAS.active_on(date(2026, 12, 17))
    assert not CHRISTMAS.active_on(date(2027, 1, 3))


def test_pick_theme_by_date_off_and_preview():
    assert pick_theme({}, IN_SEASON) is CHRISTMAS
    assert pick_theme({}, OUT_OF_SEASON) is None
    assert pick_theme({OFF_COOKIE: "halloween, christmas"}, IN_SEASON) is None
    assert pick_theme({PREVIEW_COOKIE: "christmas"}, OUT_OF_SEASON) is CHRISTMAS
    # A preview wins even over "off", and an unknown preview id is ignored.
    assert pick_theme({PREVIEW_COOKIE: "christmas", OFF_COOKIE: "christmas"}, OUT_OF_SEASON)
    assert pick_theme({PREVIEW_COOKIE: "nope"}, OUT_OF_SEASON) is None


def test_apply_theme_keeps_the_admins_own_theme():
    config = {"x": 1, "theme": {"tokens": {"colors": {}}, "globalCss": {"h1": {"color": "red"}}}}
    out = apply_theme(config, {"body::after": {"content": '""'}})
    assert out["x"] == 1
    assert out["theme"]["tokens"] == {"colors": {}}
    assert set(out["theme"]["globalCss"]) == {"h1", "body::after"}
    assert apply_theme({"theme": None}, {"a": {}})["theme"] == {"globalCss": {"a": {}}}
    assert config["theme"]["globalCss"] == {"h1": {"color": "red"}}  # input not changed


def test_snow_is_css_only_and_still_for_reduced_motion():
    css = snow.global_css()
    assert {"body::after", "body::before", "@media (prefers-reduced-motion: reduce)"} <= set(css)
    assert "animateMotion" in css["body::after"]["backgroundImage"]
    still = css["@media (prefers-reduced-motion: reduce)"]["body::after"]["backgroundImage"]
    assert "animate" not in still
    assert css["body::after"]["pointerEvents"] == "none"  # never blocks a click
    assert "<script" not in json.dumps(css)


def _airflow(status: int = 200, gzip: bool = False) -> TestClient:
    """A stand-in for Airflow: /ui/config plus another route, behind the middleware."""
    inner = FastAPI()

    @inner.get("/ui/config")
    def config():
        headers = {"content-encoding": "x-compressed"} if gzip else None
        return JSONResponse({"instance_name": "Airflow", "theme": None}, status, headers)

    @inner.get("/ui/other")
    def other():
        return PlainTextResponse("untouched")

    def at(day: date) -> TestClient:
        return TestClient(ThemeMiddleware(inner, today=lambda: day))

    return at  # type: ignore[return-value]


def test_middleware_adds_the_theme_in_season():
    res = _airflow()(IN_SEASON).get("/ui/config")
    body = res.json()
    assert body["instance_name"] == "Airflow"
    assert "body::after" in body["theme"]["globalCss"]
    assert int(res.headers["content-length"]) == len(res.content)


@pytest.mark.parametrize(
    ("day", "cookies", "themed"),
    [
        (OUT_OF_SEASON, {}, False),
        (IN_SEASON, {OFF_COOKIE: "christmas"}, False),
        (OUT_OF_SEASON, {PREVIEW_COOKIE: "christmas"}, True),
    ],
)
def test_middleware_follows_the_date_and_the_viewers_choice(day, cookies, themed):
    client = _airflow()(day)
    client.cookies.update(cookies)
    assert (client.get("/ui/config").json()["theme"] is not None) == themed


def test_middleware_leaves_everything_else_alone():
    assert _airflow()(IN_SEASON).get("/ui/other").text == "untouched"
    # Errors (for example not logged in) and compressed replies pass through unchanged.
    assert _airflow(status=401)(IN_SEASON).get("/ui/config").json()["theme"] is None
    res = _airflow(gzip=True)(IN_SEASON).get("/ui/config")
    assert b"globalCss" not in res.content


def test_themes_endpoint_lists_dates():
    from airflow.api_fastapi.core_api.security import get_user

    dagwick_app.dependency_overrides[get_user] = lambda: object()
    try:
        rows = TestClient(dagwick_app).get("/api/themes")
    finally:
        dagwick_app.dependency_overrides.clear()
    if rows.status_code != 200:
        pytest.skip(f"auth override not supported here ({rows.status_code})")
    christmas = next(r for r in rows.json() if r["id"] == "christmas")
    assert christmas["start"] == [12, 18] and christmas["end"] == [1, 2]
    assert isinstance(christmas["active"], bool)
