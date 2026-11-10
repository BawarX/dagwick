#!/usr/bin/env python3
"""Regenerate the theme files in this folder:

    python3 themes/make_themes.py

Every theme is an Airflow ``[api] theme`` JSON: Chakra ``globalCss`` and, for
the themes that recolour Airflow, a ``tokens.colors.brand`` ramp. The scenery
is CSS only, drawn on ``html::before``, ``html::after``, ``body::before`` and
``body::after``. Those layers are pinned to the viewport *behind* the page
(``z-index: -1``) and ignore the mouse, so nothing ever moves over text or
blocks a click. ``prefers-reduced-motion`` stops every animation.

The JSON files are committed; ``tests/test_themes.py`` checks they match this
script, so run it after changing anything here.
"""

from __future__ import annotations

import json
import random
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).parent
TILE = 300  # px: the repeating pattern of snow and embers
REDUCED = "@media (prefers-reduced-motion: reduce)"
URL_SAFE = "=:/,.-_()'"  # characters that may stay unescaped inside a data: URL


def svg(width: int, height: int, body: str) -> str:
    """A CSS ``url()`` holding an inline SVG, so a theme needs no image files."""
    doc = (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}' "
        f"viewBox='0 0 {width} {height}'>{body}</svg>"
    )
    return f'url("data:image/svg+xml,{quote(doc, safe=URL_SAFE)}")'


def behind(**style: str) -> dict[str, str]:
    """A click-through layer pinned to the viewport and painted behind the page."""
    return {"content": '""', "position": "fixed", "pointerEvents": "none", "zIndex": "-1", **style}


def still(theme: dict, *selectors: str) -> None:
    """Stop the animation of these selectors for viewers who prefer reduced motion."""
    theme["globalCss"][REDUCED] = {s: {"animation": "none"} for s in selectors}


def ramp(**steps: str) -> dict:
    """A ``brand`` colour ramp in the shape Airflow expects (OKLCH, 50 to 950)."""
    return {"colors": {"brand": {k.lstrip("_"): {"value": v} for k, v in steps.items()}}}


def dots(seed: int, n: int, size: tuple[float, float], alpha: tuple[float, float], rgb: str) -> str:
    """``n`` soft dots scattered over one tile, as a list of radial gradients."""
    rng = random.Random(seed)
    out = []
    for _ in range(n):
        x, y = rng.randrange(TILE), rng.randrange(TILE)
        s = round(rng.uniform(*size), 1)
        a = round(rng.uniform(*alpha), 2)
        dot = f"radial-gradient({s}px {s}px at {x}px {y}px, "
        out.append(dot + f"rgba({rgb},{a}) 40%, transparent 100%)")
    return ", ".join(out)


def drift(dy: int, sway: int) -> dict:
    """Keyframes that move a tiled layer by one tile (``dy``) with a sideways sway."""
    q = abs(dy) // 4
    sign = 1 if dy > 0 else -1
    return {
        "0%": {"transform": "translate3d(0,0,0)"},
        "25%": {"transform": f"translate3d({sway}px,{sign * q}px,0)"},
        "50%": {"transform": f"translate3d(0,{sign * 2 * q}px,0)"},
        "75%": {"transform": f"translate3d({-sway}px,{sign * 3 * q}px,0)"},
        "100%": {"transform": f"translate3d(0,{dy}px,0)"},
    }


# Tailwind's OKLCH palettes, in the format Airflow's ``[api] theme`` documents.
ORANGE = ramp(
    _50="oklch(0.98 0.016 73.684)",
    _100="oklch(0.954 0.038 75.164)",
    _200="oklch(0.901 0.076 70.697)",
    _300="oklch(0.837 0.128 66.29)",
    _400="oklch(0.75 0.183 55.934)",
    _500="oklch(0.705 0.213 47.604)",
    _600="oklch(0.646 0.222 41.116)",
    _700="oklch(0.553 0.195 38.402)",
    _800="oklch(0.47 0.157 37.304)",
    _900="oklch(0.408 0.123 38.172)",
    _950="oklch(0.266 0.079 36.259)",
)
GREEN = ramp(
    _50="oklch(0.982 0.018 155.826)",
    _100="oklch(0.962 0.044 156.743)",
    _200="oklch(0.925 0.084 155.995)",
    _300="oklch(0.871 0.15 154.449)",
    _400="oklch(0.792 0.209 151.711)",
    _500="oklch(0.723 0.219 149.579)",
    _600="oklch(0.627 0.194 149.214)",
    _700="oklch(0.527 0.154 150.069)",
    _800="oklch(0.448 0.119 151.328)",
    _900="oklch(0.393 0.095 152.535)",
    _950="oklch(0.266 0.065 152.934)",
)


# ---------------------------------------------------------------------------
# Christmas: realistic snow
# ---------------------------------------------------------------------------


def snow() -> dict:
    """Three layers of snow at different depths: far flakes are small, dim, blurred
    and slow; near flakes are big, bright and fast, and sway more on the way down."""
    layers = [
        # selector, seed, count, size, alpha, seconds per tile, sway, blur, opacity
        ("html::before", 1, 26, (1.2, 2.0), (0.5, 0.8), 30, 6, "0.7px", "0.6"),
        ("html::after", 2, 18, (2.0, 3.0), (0.6, 0.9), 19, 12, None, "0.8"),
        ("body::before", 3, 10, (3.2, 5.0), (0.7, 1.0), 12, 20, "0.4px", "0.9"),
    ]
    css: dict = {}
    for i, (sel, seed, n, size, alpha, secs, sway, blur, opacity) in enumerate(layers):
        name = f"dagwickSnow{i}"
        css[sel] = behind(
            left="-40px",
            top=f"-{TILE}px",
            width="calc(100% + 80px)",
            height=f"calc(100% + {TILE}px)",
            backgroundRepeat="repeat",
            backgroundSize=f"{TILE}px {TILE}px",
            backgroundImage=dots(seed, n, size, alpha, "255,255,255"),
            opacity=opacity,
            willChange="transform",
            animation=f"{name} {secs}s linear infinite",
        )
        if blur:
            css[sel]["filter"] = f"blur({blur})"
        # Light mode: pale blue flakes, or they would vanish on the white page.
        light = sel.replace("html", "html.light").replace("body", "html.light body")
        css[light] = {"backgroundImage": dots(seed, n, size, alpha, "70,110,170")}
        css[f"@keyframes {name}"] = drift(TILE, sway)
    theme = {"globalCss": css}
    still(theme, *(sel for sel, *_ in layers))
    return theme


# ---------------------------------------------------------------------------
# Halloween
# ---------------------------------------------------------------------------

BAT = (
    "M30 21 C28 17 25 16 22 18 C21 13 14 10 4 12 C9 9 15 7 20 8 C23 5 27 5 29 9 "
    "L29 4 L31 4 L31 9 C33 5 37 5 40 8 C45 7 51 9 56 12 C46 10 39 13 38 18 C35 16 32 17 30 21 Z"
)


def halloween() -> dict:
    """Pumpkin-orange Airflow, a purple dusk, a full moon, bats crossing the top of
    the page behind the content, and a cobweb in the bottom-right corner."""
    bats = svg(
        480,
        150,
        f"<defs><path id='b' d='{BAT}' fill='#1a1024' "
        "stroke='rgba(190,160,255,0.5)' stroke-width='1'/></defs>"
        "<use href='#b' transform='translate(40 30) scale(1.1)'/>"
        "<use href='#b' transform='translate(250 86) scale(0.8)'/>"
        "<use href='#b' transform='translate(380 18) scale(0.95)'/>",
    )
    ends = [(180, 0), (140, 0), (95, 0), (50, 0), (5, 0)]
    ends += [(0, 5), (0, 50), (0, 95), (0, 140), (0, 180)]
    spokes = "".join(f"<path d='M180 180 L{x} {y}'/>" for x, y in ends)
    rings = "".join(
        f"<path d='M180 {180 - r} A{r} {r} 0 0 0 {180 - r} 180'/>" for r in (38, 74, 110, 146)
    )
    stroke = "stroke='rgba(165,165,185,0.6)' stroke-width='1'"
    web = svg(180, 180, f"<g fill='none' {stroke}>{spokes}{rings}</g>")
    dusk = "linear-gradient(180deg, rgba(88,28,135,0.35) 0, transparent 380px)"
    css = {
        "html.dark": {"backgroundImage": dusk},
        "html.light": {"backgroundImage": "linear-gradient(180deg, #f6ecff 0, transparent 320px)"},
        # the moon
        "html::before": behind(
            top="36px",
            right="110px",
            width="84px",
            height="84px",
            borderRadius="50%",
            backgroundImage=(
                "radial-gradient(8px 8px at 60% 62%, rgba(0,0,0,0.08), transparent), "
                "radial-gradient(5px 5px at 36% 70%, rgba(0,0,0,0.08), transparent), "
                "radial-gradient(circle at 38% 36%, #fff8dc, #f1e3a6 55%, #d9c27a)"
            ),
            boxShadow="0 0 48px 14px rgba(255,236,170,0.28)",
        ),
        "html.light::before": {"opacity": "0.55"},
        # bats, flying left across the top of the page
        "html::after": behind(
            top="0",
            left="-480px",
            width="calc(100% + 960px)",
            height="150px",
            backgroundImage=bats,
            backgroundRepeat="repeat-x",
            backgroundSize="480px 150px",
            opacity="0.85",
            willChange="transform",
            animation="dagwickBats 28s linear infinite",
        ),
        "@keyframes dagwickBats": {
            "0%": {"transform": "translate3d(0,0,0)"},
            "100%": {"transform": "translate3d(-480px,0,0)"},
        },
        # a cobweb in the corner
        "body::before": behind(
            right="0",
            bottom="0",
            width="180px",
            height="180px",
            backgroundImage=web,
            opacity="0.5",
        ),
    }
    theme = {"tokens": ORANGE, "globalCss": css}
    still(theme, "html::after")
    return theme


# ---------------------------------------------------------------------------
# Newroz
# ---------------------------------------------------------------------------

PEAKS = ((320, 70), (540, 88))  # where the bonfires burn, within one 800px tile


def newroz() -> dict:
    """Spring-green Airflow, the Kurdish sun in the top-right corner, mountains
    along the bottom with bonfires on the peaks, and embers rising behind the page."""
    far = "M0 160 V95 L80 60 L160 92 L250 40 L340 88 L430 48 L540 100 L630 42 L720 86 L800 60 V160Z"
    near = "M0 160 V120 L110 84 L210 116 L320 70 L430 118 L540 88 L660 122 L800 92 V160Z"
    fires = "".join(
        f"<path d='M{x} {y + 1} l-6 0 q6 -16 6 -24 q0 8 6 24z' fill='#ffb347'/>"
        f"<path d='M{x} {y} l-3 0 q3 -9 3 -14 q0 5 3 14z' fill='#fff1a8'/>"
        for x, y in PEAKS
    )

    def mountains(far_fill: str, near_fill: str) -> str:
        layers = f"<path d='{far}' fill='{far_fill}'/><path d='{near}' fill='{near_fill}'/>"
        return svg(800, 160, layers + fires)

    glow = ", ".join(
        f"radial-gradient(70px 50px at {x}px {y - 6}px, rgba(255,170,60,0.45), transparent 70%)"
        for x, y in PEAKS
    )
    sun = (
        "radial-gradient(circle, #f6c90e 0 30%, transparent 31%), "
        "repeating-conic-gradient(from -4deg, #f6c90e 0 8deg, transparent 8deg 17.142857deg)"
    )
    dusk = "linear-gradient(180deg, rgba(20,83,45,0.30) 0, transparent 360px)"
    css = {
        "html.dark": {"backgroundImage": dusk},
        "html.light": {"backgroundImage": "linear-gradient(180deg, #effbf3 0, transparent 300px)"},
        # the sun
        "html::before": behind(
            top="18px",
            right="72px",
            width="96px",
            height="96px",
            borderRadius="50%",
            backgroundImage=sun,
            boxShadow="0 0 60px 20px rgba(246,201,14,0.18)",
            opacity="0.85",
        ),
        "html.light::before": {"opacity": "0.95"},
        # mountains with bonfires on the peaks
        "html::after": behind(
            left="0",
            right="0",
            bottom="0",
            height="160px",
            backgroundImage=mountains("rgba(45,105,90,0.6)", "rgba(22,66,54,0.75)"),
            backgroundRepeat="repeat-x",
            backgroundSize="800px 160px",
            backgroundPosition="center bottom",
        ),
        "html.light::after": {"backgroundImage": mountains("#cfe9d8", "#9fcdb4")},
        # the glow of the fires, breathing
        "body::after": behind(
            left="0",
            right="0",
            bottom="0",
            height="160px",
            backgroundImage=glow,
            backgroundRepeat="repeat-x",
            backgroundSize="800px 160px",
            backgroundPosition="center bottom",
            animation="dagwickFire 1.6s ease-in-out infinite alternate",
        ),
        "@keyframes dagwickFire": {"0%": {"opacity": "0.7"}, "100%": {"opacity": "1"}},
        # embers rising from the fires
        "body::before": behind(
            left="-20px",
            bottom=f"-{TILE}px",
            width="calc(100% + 40px)",
            height=f"calc(55vh + {TILE}px)",
            backgroundRepeat="repeat",
            backgroundSize=f"{TILE}px {TILE}px",
            backgroundImage=dots(7, 9, (1.6, 2.6), (0.6, 0.9), "255,150,60"),
            maskImage="linear-gradient(to top, #000 55%, transparent)",
            WebkitMaskImage="linear-gradient(to top, #000 55%, transparent)",
            willChange="transform",
            animation="dagwickEmbers 16s linear infinite",
        ),
        "@keyframes dagwickEmbers": drift(-TILE, 8),
    }
    theme = {"tokens": GREEN, "globalCss": css}
    still(theme, "body::before", "body::after")
    return theme


# ---------------------------------------------------------------------------
# Kurdish Language Day
# ---------------------------------------------------------------------------

LETTERS = ["ڕ", "ڵ", "ڤ", "ێ", "ۆ", "ژ", "چ", "گ", "پ"]
LETTERS += ["ê", "î", "û", "ş", "ç", "x", "Kurdî", "کوردی"]


def letters(seed: int, n: int, size: tuple[int, int], fills: list[str]) -> str:
    rng = random.Random(seed)
    glyphs = []
    for _ in range(n):
        x, y, px = rng.randrange(20, 700), rng.randrange(30, 590), rng.randrange(*size)
        fill, glyph = rng.choice(fills), rng.choice(LETTERS)
        glyphs.append(
            f"<text x='{x}' y='{y}' font-size='{px}' font-family='system-ui,sans-serif' "
            f"fill='{fill}'>{glyph}</text>"
        )
    return svg(720, 600, "".join(glyphs))


def language_day() -> dict:
    """Letters of the Kurdish alphabet drifting up behind the page, in gold and
    red, under a warm glow at the top. Airflow's own colours stay."""
    dark = ["rgba(250,204,21,0.7)", "rgba(255,255,255,0.45)", "rgba(248,113,113,0.6)"]
    light = ["rgba(202,138,4,0.45)", "rgba(220,38,38,0.35)", "rgba(60,60,80,0.3)"]
    layers = [
        # selector, seed, count, font size, seconds per tile, opacity
        ("html::before", 11, 12, (18, 28), 70, "0.35"),
        ("html::after", 12, 7, (30, 46), 45, "0.4"),
    ]
    glow = "linear-gradient(180deg, rgba(234,179,8,0.10) 0, transparent 360px)"
    css: dict = {
        "html.dark": {"backgroundImage": glow},
        "html.light": {"backgroundImage": "linear-gradient(180deg, #fff8e6 0, transparent 300px)"},
    }
    for i, (sel, seed, n, size, secs, opacity) in enumerate(layers):
        name = f"dagwickLetters{i}"
        css[sel] = behind(
            left="0",
            right="0",
            top="0",
            bottom="-600px",
            backgroundRepeat="repeat",
            backgroundSize="720px 600px",
            backgroundImage=letters(seed, n, size, dark),
            opacity=opacity,
            willChange="transform",
            animation=f"{name} {secs}s linear infinite",
        )
        css[sel.replace("html", "html.light")] = {"backgroundImage": letters(seed, n, size, light)}
        css[f"@keyframes {name}"] = {
            "0%": {"transform": "translate3d(0,0,0)"},
            "100%": {"transform": "translate3d(0,-600px,0)"},
        }
    theme = {"globalCss": css}
    still(theme, *(sel for sel, *_ in layers))
    return theme


THEMES = {
    "christmas/snow.json": snow,
    "halloween/halloween.json": halloween,
    "newroz/newroz.json": newroz,
    "language-day/language-day.json": language_day,
}


def render(name: str) -> str:
    return json.dumps(THEMES[name](), indent=2, ensure_ascii=False) + "\n"


if __name__ == "__main__":
    for name in THEMES:
        path = HERE / name
        path.parent.mkdir(exist_ok=True)
        path.write_text(render(name), encoding="utf-8")
        print(f"wrote {path.relative_to(HERE.parent)} ({path.stat().st_size} bytes)")
