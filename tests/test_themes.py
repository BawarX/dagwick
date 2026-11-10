"""The files in themes/ are plain Airflow ``[api] theme`` files, not plugin code.

These tests keep them safe to apply to a whole Airflow: valid JSON with only the
documented keys, generated from themes/make_themes.py, drawn *behind* the page
so nothing moves over text, still under reduced motion, and free of network
requests.
"""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

import pytest

THEMES = Path(__file__).resolve().parents[1] / "themes"
FILES = sorted(THEMES.glob("*/*.json"))
IDS = [p.relative_to(THEMES).as_posix() for p in FILES]
REDUCED = "@media (prefers-reduced-motion: reduce)"
OKLCH = re.compile(r"^oklch\((\d*\.?\d+) (\d*\.?\d+) (\d*\.?\d+)\)$")
# html or body, optionally in one colour mode, optionally one of its pseudo-elements
SELECTOR = re.compile(r"^(html(\.(light|dark))?( body)?|body)(::(before|after))?$")


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def rules(theme: dict):
    """Every plain selector of the theme with its style (at-rules left out)."""
    return [(sel, style) for sel, style in theme["globalCss"].items() if not sel.startswith("@")]


@pytest.fixture(scope="module")
def generator():
    spec = importlib.util.spec_from_file_location("make_themes", THEMES / "make_themes.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_there_are_themes():
    assert IDS == [
        "christmas/snow.json",
        "halloween/halloween.json",
        "language-day/language-day.json",
        "newroz/newroz.json",
    ]


def test_generator_knows_every_file(generator):
    assert set(generator.THEMES) == set(IDS)


@pytest.mark.parametrize("path", FILES, ids=IDS)
def test_file_matches_the_generator(path, generator):
    name = path.relative_to(THEMES).as_posix()
    hint = "run: python3 themes/make_themes.py"
    assert path.read_text(encoding="utf-8") == generator.render(name), hint


@pytest.mark.parametrize("path", FILES, ids=IDS)
def test_only_documented_keys(path):
    theme = load(path)
    assert set(theme) <= {"globalCss", "tokens"}
    assert theme["globalCss"]
    if "tokens" in theme:
        assert set(theme["tokens"]) == {"colors"}
        assert set(theme["tokens"]["colors"]) == {"brand"}
        brand = theme["tokens"]["colors"]["brand"]
        assert set(brand) == {str(step) for step in (50, *range(100, 1000, 100), 950)}
        for step, colour in brand.items():
            match = OKLCH.match(colour["value"])
            assert match, f"brand {step}: {colour}"
            lightness, chroma, hue = map(float, match.groups())
            assert 0 <= lightness <= 1 and 0 <= chroma <= 0.5 and 0 <= hue <= 360, f"brand {step}"


@pytest.mark.parametrize("path", FILES, ids=IDS)
def test_scenery_stays_behind_the_page(path):
    """Every layer is pinned behind the content and lets clicks through; the only
    other things a theme touches are the html background in each colour mode and
    the look of its own layers."""
    for sel, style in rules(load(path)):
        assert SELECTOR.match(sel), f"{sel}: only html, body and their pseudo-elements"
        if style.get("position") == "fixed":
            assert style.get("zIndex") == "-1", f"{sel} would sit over the page"
            assert style.get("pointerEvents") == "none", f"{sel} would block clicks"
        elif "::" in sel:
            assert set(style) <= {"backgroundImage", "opacity"}, f"{sel}: {sorted(style)}"
        else:
            assert sel in {"html.dark", "html.light"}, sel
            assert set(style) == {"backgroundImage"}, f"{sel}: only the background may change"


@pytest.mark.parametrize("path", FILES, ids=IDS)
def test_animation_stops_under_reduced_motion(path):
    theme = load(path)
    animated = {sel for sel, style in rules(theme) if "animation" in style}
    assert animated, "every theme animates something"
    stopped = theme["globalCss"].get(REDUCED, {})
    for sel in animated:
        assert stopped.get(sel) == {"animation": "none"}, f"{sel} still moves under reduced motion"
    for sel, style in rules(theme):
        if "animation" in style:
            name = style["animation"].split()[0]
            assert f"@keyframes {name}" in theme["globalCss"], f"{sel}: no keyframes {name}"


@pytest.mark.parametrize("path", FILES, ids=IDS)
def test_no_network_requests(path):
    text = path.read_text(encoding="utf-8")
    assert "@import" not in text
    for url in re.findall(r'url\("([^"]*)"\)', text):
        assert url.startswith("data:image/svg+xml,"), url
    assert not re.search(r"(?<!data:image/svg\+xml,%3Csvg%20xmlns=')https?://", text)
