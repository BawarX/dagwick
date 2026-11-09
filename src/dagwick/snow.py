"""Falling snow for the whole Airflow UI, drawn with CSS only (used by the Christmas theme).

Each flake falls on its own path, with its own size, speed, sway and start time, so the
snow looks random; about half of them also drift sideways in the wind. Three layers
(far, middle, near) use different tile sizes, so the pattern never visibly repeats.
Flakes are SVG images animated with SMIL, so no JavaScript runs on Airflow's pages.
Viewers who prefer reduced motion get still snow. A snow drift sits along the bottom.
"""

from __future__ import annotations

import random
from typing import Any
from urllib.parse import quote

SEED = 1225  # fixed, so the file is reproducible

# (tile size px, flakes per tile, kind, size range px, fall time range s, opacity range, sway px)
LAYERS = [
    (431, 6, "dot", (1.0, 1.8), (18, 28), (0.3, 0.5), 10),  # far: a few faint soft flakes
    (557, 4, "crystal", (5, 8), (13, 19), (0.35, 0.6), 22),  # middle: snowflakes
    (743, 2, "crystal", (10, 14), (9, 13), (0.35, 0.6), 34),  # near: big snowflakes
]
WIND = 0.45  # share of flakes that the wind also carries sideways

FLAKE = {
    # dark Airflow: white flakes
    "dark": ("#ffffff", "#ffffff"),
    # light Airflow: white flakes need a pale blue edge to show on a white page
    "light": ("#ffffff", "#9fb8d6"),
}
CRYSTAL = {"dark": "#ffffff", "light": "#8fb0d4"}


def crystal(size: float, color: str) -> str:
    """A six-armed snowflake: each arm has two pairs of side branches."""
    branches = "".join(
        f"M0 {-size * at:.1f} l{side * size * w:.1f} {-size * h:.1f} "
        for at, w, h in ((0.45, 0.22, 0.2), (0.72, 0.15, 0.14))
        for side in (-1, 1)
    )
    arm = f"M0 0 V{-size:.1f} {branches}"
    arms = "".join(f"<path transform='rotate({a})' d='{arm}'/>" for a in range(0, 360, 60))
    width = max(0.8, size / 9)
    return (
        f"<g fill='none' stroke='{color}' stroke-width='{width:.2f}' stroke-linecap='round'>{arms}"
        f"<circle r='{size * 0.14:.1f}' fill='{color}' stroke='none'/></g>"
    )


def layer_svg(rng: random.Random, layer: tuple, theme: str, animate: bool) -> str:
    tile, count, kind, radius, fall, opacity, sway = layer
    centre, edge = FLAKE[theme]
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{tile}' height='{tile}'>",
        "<defs><radialGradient id='f'>"
        f"<stop offset='0' stop-color='{centre}'/>"
        f"<stop offset='.55' stop-color='{centre}' stop-opacity='.9'/>"
        f"<stop offset='1' stop-color='{edge}' stop-opacity='0'/>"
        "</radialGradient></defs>",
    ]
    for _ in range(count):
        size = rng.uniform(*radius)
        # Some flakes drift sideways in the wind as they fall, to the left or the right.
        dx = rng.uniform(0.15, 0.35) * tile * rng.choice((-1, 1)) if rng.random() < WIND else 0
        x = rng.uniform(sway + max(0, -dx), tile - sway - max(0, dx))
        y = rng.uniform(0, tile)
        dur = rng.uniform(*fall)
        op = rng.uniform(*opacity)
        a = rng.uniform(0.4, 1) * sway * rng.choice((-1, 1))
        if kind == "dot":
            shape = f"<circle r='{size * 1.6:.1f}' fill='url(#f)'/>"
        else:
            spin = rng.uniform(10, 24)
            start = rng.uniform(0, 60)
            end = start + rng.choice((-360, 360))
            shape = crystal(size, CRYSTAL[theme])
            if animate:
                shape = (
                    f"<g>{shape}<animateTransform attributeName='transform' type='rotate' "
                    f"from='{start:.0f}' to='{end:.0f}' dur='{spin:.1f}s' "
                    "repeatCount='indefinite'/></g>"
                )
            else:
                shape = f"<g transform='rotate({start:.0f})'>{shape}</g>"
        # Two copies one fall apart: when the lower one leaves the tile, the upper one has
        # just entered it where the lower one started, so the loop has no visible jump.
        copy = f"<g transform='translate({-dx:.0f} {-tile})'>{shape}</g>"
        flake = f"<g opacity='{op:.2f}'>{shape}{copy}</g>"
        if animate:
            q = tile / 4
            h = dx / 2  # sideways distance per half of the fall
            path = f"M{x:.0f},{y:.0f} q{a + h / 2:.0f},{q:.0f} {h:.0f},{2 * q:.0f} "
            path += f"q{-a + h / 2:.0f},{q:.0f} {h:.0f},{2 * q:.0f}"
            out.append(
                f"<g>{flake}<animateMotion dur='{dur:.1f}s' begin='-{rng.uniform(0, dur):.1f}s' "
                f"repeatCount='indefinite' path='{path}'/></g>"
            )
        else:
            out.append(f"<g transform='translate({x:.0f} {y:.0f})'>{flake}</g>")
    out.append("</svg>")
    return "".join(out)


def drift_svg(theme: str) -> str:
    """The snow drift along the bottom of the window."""
    if theme == "light":
        top, bottom, line = "#ffffff", "#dfe9f5", "#b9cbe0"
    else:
        top, bottom, line = "#f4f8fc", "#c9d7e8", "#ffffff"
    edge = "M0 22 C80 8 160 10 240 18 S400 30 480 16 S640 4 720 14 S880 28 960 15 S1120 6 1200 16"
    return (
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 40' preserveAspectRatio='none'>"
        "<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>"
        f"<stop offset='0' stop-color='{top}'/><stop offset='1' stop-color='{bottom}'/>"
        "</linearGradient></defs>"
        f"<path d='{edge} V40 H0Z' fill='url(#g)'/>"
        f"<path d='{edge}' fill='none' stroke='{line}' stroke-opacity='.6' stroke-width='1.5'/>"
        "</svg>"
    )


def url(svg: str) -> str:
    return f'url("data:image/svg+xml,{quote(svg, safe="")}")'


def snow(theme: str, animate: bool) -> dict[str, str]:
    rng = random.Random(SEED)  # same flake positions in both themes and in the still version
    layers = [layer_svg(rng, layer, theme, animate) for layer in LAYERS]
    return {
        "backgroundImage": ", ".join(url(s) for s in reversed(layers)),
        "backgroundSize": ", ".join(f"{t}px {t}px" for t, *_ in reversed(LAYERS)),
    }


def global_css() -> dict[str, Any]:
    """The snow as Airflow theme ``globalCss`` (selector -> style)."""
    flakes = {
        "content": '""',
        "position": "fixed",
        "inset": "0",
        "pointerEvents": "none",
        "zIndex": "2147483646",
    }
    drift = {
        "content": '""',
        "position": "fixed",
        "left": "0",
        "right": "0",
        "bottom": "0",
        "height": "26px",
        "pointerEvents": "none",
        "zIndex": "2147483647",
        "backgroundSize": "100% 100%",
        "filter": "drop-shadow(0 -2px 4px rgba(15, 30, 60, 0.12))",
    }
    return {
        "body::after": {**flakes, **snow("dark", True)},
        "body::before": {**drift, "backgroundImage": url(drift_svg("dark"))},
        "html.light body::after": snow("light", True),
        "html.light body::before": {"backgroundImage": url(drift_svg("light"))},
        "@media (prefers-reduced-motion: reduce)": {
            "body::after": snow("dark", False),
            "html.light body::after": snow("light", False),
        },
    }
