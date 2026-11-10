"""Halloween for the whole Airflow UI, drawn with CSS only (used by the Halloween theme).

Bats glide across the top of the screen in two layers (far ones to the right, near ones to
the left), glowing embers rise slowly from below, purple fog drifts along the bottom, a
cobweb hangs in the bottom-right corner, and small spiders dangle on silk from the top of
some cards. Every moving part is moved with a CSS transform, which the graphics card does
without repainting the page. Viewers who prefer reduced motion get a still scene.
"""

from __future__ import annotations

import math
import random
from typing import Any

from dagwick.snow import CAPPED, url

SEED = 1031

TOP = "2147483646"  # above Airflow's content, below its pop-ups' own top layer


def _move(x: float, y: float) -> dict[str, str]:
    return {"transform": f"translate3d({x:.0f}px, {y:.0f}px, 0)"}


# ---- bats ----

BAT = (
    "M0 -2 C2 -6 6 -6 8 -3 C10 -6 14 -7 18 -4 C15 -3 14 0 15 3 C12 1 9 2 8 4 "
    "C6 2 3 2 0 5 C-3 2 -6 2 -8 4 C-9 2 -12 1 -15 3 C-14 0 -15 -3 -18 -4 "
    "C-14 -7 -10 -6 -8 -3 C-6 -6 -2 -6 0 -2Z M-2.2 -2.5 L-1.6 -6 L-0.4 -3.2Z "
    "M2.2 -2.5 L1.6 -6 L0.4 -3.2Z"
)


def bats_svg(rng: random.Random, width: int, height: int, count: int, size: tuple) -> str:
    """Bats spread over the top part of one repeat, each at its own size, tilt and shade."""
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>",
        f"<defs><path id='b' d='{BAT}'/></defs>",
    ]
    for _ in range(count):
        s = rng.uniform(*size) / 18
        x, y = rng.uniform(0, width), rng.uniform(height * 0.04, height * 0.42)
        tilt, op = rng.uniform(-14, 14), rng.uniform(0.75, 0.95)
        for dx in (-width, 0, width):
            if abs(x + dx - width / 2) < width / 2 + 30:
                out.append(
                    f"<use href='#b' transform='translate({x + dx:.0f} {y:.0f}) "
                    f"rotate({tilt:.0f}) scale({s:.2f})' fill='#2b1745' "
                    f"stroke='#c4b5fd' stroke-opacity='.7' stroke-width='{1.1 / s:.2f}' "
                    f"opacity='{op:.2f}'/>"
                )
    out.append("</svg>")
    return "".join(out)


# ---- embers ----


def embers_svg(rng: random.Random, width: int, height: int, count: int) -> str:
    """Small glowing sparks, wrapped at the edges so the repeats join seamlessly."""
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>",
        "<defs><radialGradient id='e'><stop offset='0' stop-color='#fff3c4'/>"
        "<stop offset='.35' stop-color='#fb923c'/>"
        "<stop offset='1' stop-color='#f97316' stop-opacity='0'/></radialGradient></defs>",
    ]
    for _ in range(count):
        r = rng.uniform(1.6, 3.4)
        x, y, op = rng.uniform(0, width), rng.uniform(0, height), rng.uniform(0.35, 0.8)
        for dy in (-height, 0, height):
            if abs(y + dy - height / 2) < height / 2 + 10:
                out.append(
                    f"<circle cx='{x:.0f}' cy='{y + dy:.0f}' r='{r * 2.4:.1f}' "
                    f"fill='url(#e)' opacity='{op:.2f}'/>"
                )
    out.append("</svg>")
    return "".join(out)


# ---- fog ----


def fog_svg(width: int, height: int) -> str:
    """Soft blurred clouds of purple and green mist, one repeat wide."""
    rng = random.Random(SEED + 7)
    blobs = []
    for _ in range(9):
        cx, rx = rng.uniform(0, width), rng.uniform(90, 220)
        cy, ry = rng.uniform(height * 0.45, height * 0.9), rng.uniform(26, 52)
        color = rng.choice(("#7c3aed", "#6d28d9", "#8b5cf6"))
        op = rng.uniform(0.07, 0.14)
        for dx in (-width, 0, width):
            if abs(cx + dx - width / 2) < width / 2 + rx:
                blobs.append(
                    f"<ellipse cx='{cx + dx:.0f}' cy='{cy:.0f}' rx='{rx:.0f}' ry='{ry:.0f}' "
                    f"fill='{color}' opacity='{op:.2f}'/>"
                )
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>"
        "<defs><filter id='m' x='-20%' y='-60%' width='140%' height='220%'>"
        "<feGaussianBlur stdDeviation='18'/></filter></defs>"
        f"<g filter='url(#m)'>{''.join(blobs)}</g></svg>"
    )


# ---- cobweb ----


def web_svg(size: int, color: str) -> str:
    """A cobweb in a bottom-right corner: threads out from the corner, sagging rings."""
    rng = random.Random(SEED + 3)
    spokes = [180 + i * 90 / 6 + rng.uniform(-4, 4) for i in range(7)]
    rings = [size * f for f in (0.22, 0.4, 0.58, 0.76, 0.94)]

    def at(r: float, deg: float) -> tuple[float, float]:
        rad = math.radians(deg)
        return size + r * math.cos(rad), size + r * math.sin(rad)

    d = [f"M{size} {size} L{at(size * 1.05, a)[0]:.0f} {at(size * 1.05, a)[1]:.0f}" for a in spokes]
    for r in rings:
        pts = [at(r * rng.uniform(0.95, 1.05), a) for a in spokes]
        d.append(f"M{pts[0][0]:.1f} {pts[0][1]:.1f}")
        for (x0, y0), (x1, y1) in zip(pts, pts[1:], strict=False):
            mx, my = (x0 + x1) / 2, (y0 + y1) / 2
            # sag towards the corner
            cx, cy = size + (mx - size) * 0.82, size + (my - size) * 0.82
            d.append(f"Q{cx:.1f} {cy:.1f} {x1:.1f} {y1:.1f}")
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{size}' height='{size}'>"
        f"<path d='{' '.join(d)}' fill='none' stroke='{color}' stroke-width='.9' "
        "stroke-linecap='round'/></svg>"
    )


# ---- spiders on cards ----


def spider_svg(thread: int) -> str:
    """A small spider hanging on a silk thread of the given length (px)."""
    y = thread + 9
    legs = []
    for side in (-1, 1):
        for dx, dy, ex, ey in ((6, -4, 11, -9), (8, -1, 13, -3), (8, 1, 13, 5), (6, 4, 10, 10)):
            legs.append(
                f"M{11 + side * 3} {y + dy * 0.6:.1f} Q{11 + side * dx} {y + dy - 1} "
                f"{11 + side * ex} {y + ey}"
            )
    outline = "stroke='#e9e3ff' stroke-opacity='.45' stroke-width='.8'"
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='22' height='{thread + 22}'>"
        f"<path d='M11 0 V{thread + 4}' stroke='#d6d3e6' stroke-opacity='.8' stroke-width='.9'/>"
        f"<path d='{' '.join(legs)}' fill='none' stroke='#e9e3ff' stroke-opacity='.35' "
        "stroke-width='2.6' stroke-linecap='round'/>"
        f"<path d='{' '.join(legs)}' fill='none' stroke='#140b1c' stroke-width='1.5' "
        "stroke-linecap='round'/>"
        f"<ellipse cx='11' cy='{y + 1.5}' rx='5.4' ry='6' fill='#140b1c' {outline}/>"
        f"<circle cx='11' cy='{y - 5}' r='3.4' fill='#140b1c' {outline}/>"
        f"<circle cx='9.7' cy='{y - 5.4}' r='.9' fill='#fb923c'/>"
        f"<circle cx='12.3' cy='{y - 5.4}' r='.9' fill='#fb923c'/>"
        "</svg>"
    )


def spiders() -> dict[str, Any]:
    """Spiders dangle from the top of about three in five cards, each a little different."""
    css: dict[str, Any] = {}
    for sel in CAPPED:
        css[sel] = {"position": "relative"}
    for k in range(5):
        if k in (1, 4):  # these cards get no spider
            continue
        rng = random.Random(SEED + 100 + k)
        thread = rng.randint(14, 34)
        key = ", ".join(f"{pick(k + 1)}::after" for pick in CAPPED.values())
        css[key] = {
            "content": '""',
            "position": "absolute",
            "top": "0",
            "left": f"{rng.randint(42, 72)}%",
            "width": "22px",
            "height": f"{thread + 22}px",
            "backgroundImage": url(spider_svg(thread)),
            "pointerEvents": "none",
            "zIndex": "1",
            "transformOrigin": "50% 0",
            "willChange": "transform",
            "animation": f"dagwickSpider {rng.uniform(2.2, 3.6):.1f}s ease-in-out "
            f"-{rng.uniform(0, 2):.1f}s infinite alternate",
        }
    css["@keyframes dagwickSpider"] = {
        "from": {"transform": "translate3d(0, -2px, 0) rotate(-3deg)"},
        "to": {"transform": "translate3d(0, 3px, 0) rotate(3deg)"},
    }
    return css


# ---- the whole scene ----


def global_css() -> dict[str, Any]:
    """Halloween as Airflow theme ``globalCss`` (selector -> style)."""
    rng = random.Random(SEED)
    layer = {"content": '""', "position": "fixed", "pointerEvents": "none", "zIndex": TOP}
    far_w, far_h, near_w, near_h = 1400, 900, 1700, 1000
    ember_w, ember_h, fog_w, fog_h = 1100, 640, 1400, 130
    css: dict[str, Any] = {
        **spiders(),
        # Embers rising from below, with a gentle sway.
        "html::before": {
            **layer,
            "top": "0",
            "bottom": f"-{ember_h}px",
            "left": "-40px",
            "right": "-40px",
            "backgroundImage": url(embers_svg(rng, ember_w, ember_h, 16)),
            "backgroundSize": f"{ember_w}px {ember_h}px",
            "willChange": "transform",
            "animation": "dagwickEmbers 34s linear infinite",
        },
        "@keyframes dagwickEmbers": {
            "0%": _move(0, 0),
            "25%": _move(18, -ember_h / 4),
            "50%": _move(0, -ember_h / 2),
            "75%": _move(-18, -ember_h * 3 / 4),
            "100%": _move(0, -ember_h),
        },
        # Far bats, small and slow, flying right.
        "html::after": {
            **layer,
            "top": "0",
            "height": f"{far_h}px",
            "left": f"-{far_w}px",
            "right": "0",
            "backgroundImage": url(bats_svg(rng, far_w, far_h, 5, (15, 22))),
            "backgroundSize": f"{far_w}px {far_h}px",
            "backgroundRepeat": "repeat-x",
            "willChange": "transform",
            "animation": "dagwickBatsFar 70s linear infinite",
        },
        "@keyframes dagwickBatsFar": {
            "0%": _move(0, 0),
            "25%": _move(far_w / 4, -14),
            "50%": _move(far_w / 2, 6),
            "75%": _move(far_w * 3 / 4, -10),
            "100%": _move(far_w, 0),
        },
        # Near bats, bigger and quicker, flying left.
        "body::after": {
            **layer,
            "top": "0",
            "height": f"{near_h}px",
            "left": "0",
            "right": f"-{near_w}px",
            "backgroundImage": url(bats_svg(rng, near_w, near_h, 3, (28, 40))),
            "backgroundSize": f"{near_w}px {near_h}px",
            "backgroundRepeat": "repeat-x",
            "willChange": "transform",
            "animation": "dagwickBatsNear 42s linear infinite",
        },
        "@keyframes dagwickBatsNear": {
            "0%": _move(0, 0),
            "25%": _move(-near_w / 4, 18),
            "50%": _move(-near_w / 2, -8),
            "75%": _move(-near_w * 3 / 4, 12),
            "100%": _move(-near_w, 0),
        },
        # Fog drifting along the bottom.
        "#root::after": {
            **layer,
            "bottom": "0",
            "height": f"{fog_h}px",
            "left": f"-{fog_w}px",
            "right": "0",
            "backgroundImage": url(fog_svg(fog_w, fog_h)),
            "backgroundSize": f"{fog_w}px {fog_h}px",
            "backgroundRepeat": "repeat-x",
            "willChange": "transform",
            "animation": "dagwickFog 80s linear infinite",
        },
        "@keyframes dagwickFog": {"from": _move(0, 0), "to": _move(fog_w, 0)},
        # A soft purple glow at the very bottom, and a cobweb in the corner.
        "body::before": {
            **layer,
            "left": "0",
            "right": "0",
            "bottom": "0",
            "height": "80px",
            "background": "linear-gradient(to top, rgba(76, 29, 149, 0.16), transparent)",
        },
        "#root::before": {
            **layer,
            "right": "0",
            "bottom": "0",
            "width": "96px",
            "height": "96px",
            "backgroundImage": url(web_svg(96, "rgba(225, 222, 240, 0.38)")),
        },
        "html.light #root::before": {
            "backgroundImage": url(web_svg(96, "rgba(90, 86, 110, 0.4)")),
        },
        "html.light body::before": {
            "background": "linear-gradient(to top, rgba(124, 58, 237, 0.16), transparent)",
        },
    }
    moving = ["html::before", "html::after", "body::after", "#root::after"]
    spider_keys = [k for k in css if k.endswith("::after") and "nth-child" in k]
    css["@media (prefers-reduced-motion: reduce)"] = {
        sel: {"animation": "none"} for sel in moving + spider_keys
    }
    return css
