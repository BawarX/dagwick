"""Falling snow for the whole Airflow UI, drawn with CSS only (used by the Christmas theme).

The snow falls in four layers at different depths, speeds and wind directions: two fall
straight down with a gentle sway, one is blown to the right and one to the left. Each
layer is a still pattern of randomly placed flakes that the browser slides with a CSS
transform, which the graphics card does without repainting the page, so Airflow stays
smooth. Snow also settles on top of cards, and a drift lies along the bottom of the
window. Viewers who prefer reduced motion get still snow.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import Any
from urllib.parse import quote

SEED = 1225  # fixed, so the snow is the same on every start


@dataclass(frozen=True)
class Layer:
    host: str  # the pseudo-element that carries this layer
    width: int  # one repeat of the pattern, in px
    height: int
    count: int  # flakes per repeat
    kind: str  # "dot" (soft, far away) or "crystal" (a six-armed snowflake)
    size: tuple[float, float]
    opacity: tuple[float, float]
    seconds: float  # time to fall one repeat
    wind: int  # -1 blown left, 0 straight down with a sway, 1 blown right


LAYERS = (
    Layer("html::before", 1093, 431, 22, "dot", (1.0, 1.8), (0.3, 0.5), 26, 0),
    Layer("html::after", 1187, 557, 10, "crystal", (5, 8), (0.35, 0.6), 19, 0),
    Layer("body::after", 547, 1291, 11, "crystal", (6, 10), (0.35, 0.6), 30, 1),
    Layer("#root::after", 619, 1543, 10, "crystal", (10, 14), (0.35, 0.6), 22, -1),
)
SWAY = 16  # px, side to side, for the layers that fall straight down

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


def layer_svg(rng: random.Random, layer: Layer, theme: str) -> str:
    """One repeat of a layer: flakes at random places, sizes, turns and opacities.

    A flake near an edge is also drawn on the other side, so the repeats join seamlessly.
    """
    w, h = layer.width, layer.height
    centre, edge = FLAKE[theme]
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}'>",
        "<defs><radialGradient id='f'>"
        f"<stop offset='0' stop-color='{centre}'/>"
        f"<stop offset='.55' stop-color='{centre}' stop-opacity='.9'/>"
        f"<stop offset='1' stop-color='{edge}' stop-opacity='0'/>"
        "</radialGradient></defs>",
    ]
    defs, uses = [], []
    for i in range(layer.count):
        size = rng.uniform(*layer.size)
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        op = rng.uniform(*layer.opacity)
        if layer.kind == "dot":
            shape = f"<circle r='{size * 1.6:.1f}' fill='url(#f)'/>"
        else:
            turn = rng.uniform(0, 60)
            shape = f"<g transform='rotate({turn:.0f})'>{crystal(size, CRYSTAL[theme])}</g>"
        defs.append(f"<g id='s{i}' opacity='{op:.2f}'>{shape}</g>")
        reach = size * 1.7  # how far the flake spreads from its centre
        xs = [x] + [x + d for d in (-w, w) if abs(x + d - w / 2) < w / 2 + reach]
        ys = [y] + [y + d for d in (-h, h) if abs(y + d - h / 2) < h / 2 + reach]
        uses += [f"<use href='#s{i}' x='{px:.0f}' y='{py:.0f}'/>" for px in xs for py in ys]
    out[-1] = out[-1].replace("</defs>", "".join(defs) + "</defs>")
    out += uses
    out.append("</svg>")
    return "".join(out)


def _move(x: float, y: float) -> dict[str, str]:
    return {"transform": f"translate3d({x:.0f}px, {y:.0f}px, 0)"}


def falling(theme: str) -> dict[str, Any]:
    """The four falling layers, with their motion (dark theme) or just their flakes (light)."""
    rng = random.Random(SEED)  # same flakes in both themes
    css: dict[str, Any] = {}
    for i, layer in enumerate(LAYERS):
        image = {"backgroundImage": url(layer_svg(rng, layer, theme))}
        if theme == "light":
            host = layer.host.replace("html::", "html.light::")
            css[host if host.startswith("html.light") else f"html.light {host}"] = image
            continue
        name = f"dagwickSnow{i}"
        side = f"-{max(layer.width, SWAY * 2)}px"
        css[layer.host] = {
            "content": '""',
            "position": "fixed",
            "top": f"-{layer.height}px",
            "bottom": "0",
            "left": side,
            "right": side,
            "pointerEvents": "none",
            "zIndex": "2147483646",
            "backgroundSize": f"{layer.width}px {layer.height}px",
            "willChange": "transform",
            "animation": f"{name} {layer.seconds}s linear infinite",
            **image,
        }
        h = layer.height
        if layer.wind:
            steps = {"from": _move(0, 0), "to": _move(layer.wind * layer.width, h)}
        else:
            steps = {
                "0%": _move(0, 0),
                "25%": _move(SWAY, h / 4),
                "50%": _move(0, h / 2),
                "75%": _move(-SWAY, h * 3 / 4),
                "100%": _move(0, h),
            }
        css[f"@keyframes {name}"] = steps
    return css


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


# Cards that collect snow on their top edge: Airflow's DAG cards and Dagwick's own cards.
# For each card, the selector that picks every fifth card starting at k, so neighbouring
# cards get different snow. A DAG card hides anything outside its rounded edge, so its
# snow goes on the plain wrapper around it, which has the same top edge.
CAPPED: dict[str, Any] = {
    '[data-testid="card-list"] > *': lambda k: f'[data-testid="card-list"] > :nth-child(5n+{k})',
    ".dagwick-gcard": lambda k: f".dagwick-gcard:nth-child(5n+{k})",
    ".dagwick-cat": lambda k: f".dagwick-cat:nth-child(5n+{k})",
    ".dagwick-list": lambda k: f".dagwick-list:nth-child(5n+{k})",
    ".dagwick-theme": lambda k: f".dagwick-theme:nth-child(5n+{k})",
}
# Cards that hide anything outside their edges: their snow sits just inside the top.
INSIDE = {".dagwick-gcard"}
VARIANTS = 5
CAP_H = 22  # px; the card's top edge is EDGE px down from the top of the snow
EDGE = 10


def cap_svg(seed: int, width: int, big: bool, theme: str) -> str:
    """One repeat of snow lying on a card edge: soft heaps, a few drips, a blue shadow.

    Heaps are bell-shaped bumps placed at random; each one is also drawn one repeat to the
    left and right, so the ends of the pattern meet without a seam.
    """
    rng = random.Random(seed)
    heaps = [
        (
            rng.uniform(0, width),  # centre
            rng.uniform(4, 9) if big else rng.uniform(1.5, 4),  # height
            rng.uniform(18, 46) if big else rng.uniform(8, 20),  # spread
        )
        for _ in range(rng.randint(3, 5) if big else rng.randint(5, 8))
    ]
    drips = [(rng.uniform(0, width), rng.uniform(3, 6.5), rng.uniform(3, 6)) for _ in range(2)]

    def bump(x: float, items) -> float:
        return sum(
            h * math.exp(-(((x - c - shift) / w) ** 2))
            for c, h, w in items
            for shift in (-width, 0, width)
        )

    xs = [i * width / 32 for i in range(33)]
    base = EDGE - 2.5
    top = [max(1.0, base - bump(x, heaps)) for x in xs]
    bottom = [EDGE + 1.8 + bump(x, drips) for x in xs]

    def path(dy: float) -> str:
        up = " ".join(f"{x:.0f} {y + dy:.1f}" for x, y in zip(xs, top, strict=True))
        down = " ".join(
            f"{x:.0f} {y + dy:.1f}" for x, y in reversed(list(zip(xs, bottom, strict=True)))
        )
        return f"M{up} L{down}Z"

    shadow = "#b9cbe0" if theme == "light" else "#9fb3cc"
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{CAP_H}' "
        f"viewBox='0 0 {width} {CAP_H}'>"
        "<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'>"
        "<stop offset='0' stop-color='#ffffff'/><stop offset='.7' stop-color='#f6f9fc'/>"
        "<stop offset='1' stop-color='#dde8f3'/></linearGradient></defs>"
        f"<path d='{path(1.3)}' fill='{shadow}' opacity='.7'/>"
        f"<path d='{path(0)}' fill='url(#s)'/>"
        "</svg>"
    )


def caps(theme: str) -> dict[str, Any]:
    """Snow on each card's top edge, in five random variants spread over the cards."""
    # Airflow's DAG list clips its top edge: leave room for the first card's snow.
    css: dict[str, Any] = (
        {'[data-testid="card-list"]': {"paddingTop": f"{EDGE}px"}} if (theme == "dark") else {}
    )
    if theme == "dark":
        for sel in CAPPED:
            inside = sel in INSIDE
            css[sel] = {"position": "relative"}
            css[f"{sel}::after"] = {
                "content": '""',
                "position": "absolute",
                "top": "-1px" if inside else f"-{EDGE}px",
                "left": "4px",
                "right": "4px",
                "height": f"{CAP_H}px",
                "backgroundRepeat": "repeat-x",
                "pointerEvents": "none",
                "zIndex": "1",
            }
    for k in range(VARIANTS):
        rng = random.Random(1000 + k)
        big_w, small_w = rng.randint(380, 520), rng.randint(230, 310)
        prefix = "html.light " if theme == "light" else ""
        key = ", ".join(f"{prefix}{pick(k + 1)}::after" for pick in CAPPED.values())
        css[key] = {
            "backgroundImage": ", ".join(
                url(cap_svg(seed, w, big, theme))
                for seed, w, big in ((2000 + k, big_w, True), (3000 + k, small_w, False))
            ),
            "backgroundSize": f"{big_w}px {CAP_H}px, {small_w}px {CAP_H}px",
            "backgroundPosition": f"{rng.randint(0, big_w)}px 0, {rng.randint(0, small_w)}px 0",
        }
    return css


def url(svg: str) -> str:
    return f'url("data:image/svg+xml,{quote(svg, safe="")}")'


def global_css() -> dict[str, Any]:
    """The snow as Airflow theme ``globalCss`` (selector -> style)."""
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
        **caps("dark"),
        **caps("light"),
        **falling("dark"),
        **falling("light"),
        "body::before": {**drift, "backgroundImage": url(drift_svg("dark"))},
        "html.light body::before": {"backgroundImage": url(drift_svg("light"))},
        "@media (prefers-reduced-motion: reduce)": {
            layer.host: {"animation": "none"} for layer in LAYERS
        },
    }
