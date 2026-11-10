"""Seasonal themes for the whole Airflow UI, switched on by date from inside Dagwick.

Airflow's UI reads its theme from ``GET /ui/config``. During a theme's dates, a small
middleware adds the theme's CSS to that reply (merged into any theme the admin already
has), so it shows on every Airflow page and stops by itself afterwards. Nothing is set in
Airflow's configuration and nothing is written anywhere.

Each viewer chooses for themselves on Dagwick's Themes page. The choice lives in cookies
in their browser (Dagwick never writes to Airflow's database):

- ``dagwick_themes_off``: comma-separated theme ids this viewer removed while in season;
  ``*`` in the list turns off "show themes on their dates" altogether.
- ``dagwick_theme``: one theme id this viewer applied; it shows whatever the date.
"""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from dataclasses import dataclass
from datetime import date
from functools import cache
from http.cookies import CookieError, SimpleCookie
from typing import Any

from dagwick import snow

log = logging.getLogger(__name__)

OFF_COOKIE = "dagwick_themes_off"
ALL = "*"  # in OFF_COOKIE: no theme appears by date
APPLIED_COOKIE = "dagwick_theme"


@dataclass(frozen=True)
class Theme:
    id: str
    name: str
    description: str
    start: tuple[int, int]  # (month, day), inclusive
    end: tuple[int, int]  # (month, day), inclusive; may wrap into the next year
    css: Callable[[], dict[str, Any]]

    def active_on(self, day: date) -> bool:
        v = day.month * 100 + day.day
        a = self.start[0] * 100 + self.start[1]
        b = self.end[0] * 100 + self.end[1]
        return a <= v <= b if a <= b else v >= a or v <= b

    def info(self, today: date) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "start": list(self.start),
            "end": list(self.end),
            "active": self.active_on(today),
        }


THEMES: tuple[Theme, ...] = (
    Theme(
        id="christmas",
        name="Christmas snow",
        description="Snowflakes drift over Airflow, some carried sideways by the wind, "
        "with a snow drift along the bottom of the window.",
        start=(12, 18),
        end=(1, 2),
        css=snow.global_css,
    ),
)
BY_ID = {t.id: t for t in THEMES}


@cache
def theme_css(theme_id: str) -> dict[str, Any]:
    """A theme's CSS, built once per process."""
    return BY_ID[theme_id].css()


def _cookies(header: str) -> dict[str, str]:
    jar = SimpleCookie()
    try:
        jar.load(header)
    except CookieError:
        return {}
    return {k: m.value for k, m in jar.items()}


def pick_theme(cookies: dict[str, str], today: date) -> Theme | None:
    """The theme this viewer sees today: the one they applied, else the first in season.

    Must match pickTheme in ui/src/themes.ts.
    """
    applied = BY_ID.get(cookies.get(APPLIED_COOKIE, "").strip())
    if applied:
        return applied
    off = {part.strip() for part in cookies.get(OFF_COOKIE, "").split(",")}
    if ALL in off:
        return None
    return next((t for t in THEMES if t.id not in off and t.active_on(today)), None)


def _decls(style: dict[str, Any], important: bool = False) -> str:
    bang = " !important" if important else ""
    return "".join(
        f"{''.join('-' + c.lower() if c.isupper() else c for c in prop)}:{value}{bang};"
        for prop, value in style.items()
    )


def css_text(rules: dict[str, Any]) -> str:
    """Theme ``globalCss`` as a plain stylesheet, for applying a theme without a reload."""
    out = []
    for selector, body in rules.items():
        if selector.startswith("@media"):
            out.append(f"{selector}{{{css_text(body)}}}")
        elif selector.startswith("@keyframes"):
            steps = "".join(f"{step}{{{_decls(style)}}}" for step, style in body.items())
            out.append(f"{selector}{{{steps}}}")
        else:
            out.append(f"{selector}{{{_decls(body)}}}")
    return "".join(out)


def hide_text(rules: dict[str, Any]) -> str:
    """A stylesheet that hides a theme Airflow already drew, for removing it without a reload."""
    hidden = [s for s in rules if "::" in s and not s.startswith("@")]
    out = [f"{', '.join(hidden)}{{display:none !important;}}"] if hidden else []
    for selector, body in rules.items():
        if not selector.startswith("@") and "::" not in selector and "paddingTop" in body:
            out.append(f"{selector}{{padding-top:0 !important;}}")
    return "".join(out)


@cache
def theme_sheets(theme_id: str) -> dict[str, str]:
    """A theme as stylesheets: ``css`` draws it, ``hide`` removes it when Airflow drew it."""
    rules = theme_css(theme_id)
    return {"css": css_text(rules), "hide": hide_text(rules)}


def apply_theme(config: dict[str, Any], css: dict[str, Any]) -> dict[str, Any]:
    """Merge a theme's CSS into Airflow's UI config, keeping the admin's own theme."""
    theme = dict(config.get("theme") or {})
    theme["globalCss"] = {**(theme.get("globalCss") or {}), **css}
    return {**config, "theme": theme}


class ThemeMiddleware:
    """Adds the viewer's seasonal theme to Airflow's ``GET /ui/config`` reply.

    Every other request passes straight through. Airflow still checks the login for
    /ui/config itself; only a successful, uncompressed JSON reply is changed, and any
    problem leaves the reply exactly as Airflow sent it.
    """

    def __init__(self, app: Any, today: Callable[[], date] = date.today) -> None:
        self.app = app
        self.today = today

    async def __call__(self, scope: dict, receive: Callable, send: Callable) -> None:
        if (
            scope.get("type") != "http"
            or scope.get("method") != "GET"
            or not scope.get("path", "").endswith("/ui/config")
        ):
            await self.app(scope, receive, send)
            return
        headers = dict(scope.get("headers") or [])
        theme = pick_theme(_cookies(headers.get(b"cookie", b"").decode("latin-1")), self.today())
        if theme is None:
            await self.app(scope, receive, send)
            return

        start: dict[str, Any] = {}
        chunks: list[bytes] = []

        async def capture(message: dict) -> None:
            if message["type"] == "http.response.start":
                start.update(message)
            elif message["type"] == "http.response.body":
                chunks.append(message.get("body", b""))
                if not message.get("more_body"):
                    await finish()
            else:
                await send(message)

        async def finish() -> None:
            body = b"".join(chunks)
            out_headers = list(start.get("headers") or [])
            names = {k.lower(): v for k, v in out_headers}
            if (
                start.get("status") == 200
                and b"content-encoding" not in names
                and names.get(b"content-type", b"").startswith(b"application/json")
            ):
                try:
                    config = json.loads(body)
                    body = json.dumps(apply_theme(config, theme_css(theme.id))).encode()
                    out_headers = [(k, v) for k, v in out_headers if k.lower() != b"content-length"]
                    out_headers.append((b"content-length", str(len(body)).encode()))
                except Exception:  # never break Airflow's UI over a theme
                    log.exception("dagwick: could not add the %s theme", theme.id)
                    body = b"".join(chunks)
                    out_headers = list(start.get("headers") or [])
            await send({**start, "headers": out_headers})
            await send({"type": "http.response.body", "body": body})

        await self.app(scope, receive, capture)
