"""Halloween for the whole Airflow UI, drawn with CSS only (used by the Halloween theme).

Ghosts drift through the screen, glowing embers rise slowly, purple fog drifts along the
bottom with eyes peering out of it, a full moon hangs in the corner, darkness closes in
from the edges, a cobweb hangs in the bottom-right corner, black gnarled branches lie on
top of the cards, and small spiders dangle on silk from them. Every moving part is moved
with a CSS transform (or faded), which the graphics card does without repainting the
page. Viewers who prefer reduced motion get a still scene.
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


# ---- ghosts ----


def ghost_svg() -> str:
    """A small see-through ghost with a wavy hem and dark eyes."""
    return (
        "<g><path d='M0 -14 C8 -14 12 -8 12 0 V12 Q9 9 6 12 Q3 15 0 12 Q-3 15 -6 12 "
        "Q-9 9 -12 12 V0 C-12 -8 -8 -14 0 -14Z' fill='#ede9fe' filter='url(#g)'/>"
        "<ellipse cx='-4' cy='-4' rx='1.8' ry='2.6' fill='#1d0f2e'/>"
        "<ellipse cx='4' cy='-4' rx='1.8' ry='2.6' fill='#1d0f2e'/>"
        "<ellipse cx='0' cy='3' rx='1.6' ry='2.2' fill='#1d0f2e' opacity='.7'/></g>"
    )


def ghosts_svg(rng: random.Random, width: int, height: int, count: int) -> str:
    """Ghosts drifting through the lower part of one repeat, each its own size and tilt."""
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>",
        "<defs><filter id='g' x='-30%' y='-30%' width='160%' height='160%'>"
        "<feGaussianBlur stdDeviation='.8'/></filter>",
        f"<g id='ghost'>{ghost_svg()}</g></defs>",
    ]
    for _ in range(count):
        x, y = rng.uniform(0, width), rng.uniform(height * 0.5, height * 0.85)
        scale, tilt, op = rng.uniform(0.9, 1.4), rng.uniform(-8, 8), rng.uniform(0.16, 0.3)
        for dx in (-width, 0, width):
            if abs(x + dx - width / 2) < width / 2 + 30:
                out.append(
                    f"<use href='#ghost' transform='translate({x + dx:.0f} {y:.0f}) "
                    f"rotate({tilt:.0f}) scale({scale:.2f})' opacity='{op:.2f}'/>"
                )
    out.append("</svg>")
    return "".join(out)


# ---- moon, eyes and vignette ----


def moon_svg(size: int) -> str:
    """A pale full moon with a soft glow and a few darker seas."""
    c = size / 2
    r = size * 0.26
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{size}' height='{size}'>"
        "<defs><radialGradient id='h'><stop offset='.3' stop-color='#fef3c7' stop-opacity='.16'/>"
        "<stop offset='1' stop-color='#fde68a' stop-opacity='0'/></radialGradient>"
        "<radialGradient id='m' cx='40%' cy='38%'><stop offset='0' stop-color='#fffbeb'/>"
        "<stop offset='1' stop-color='#e9dcb0'/></radialGradient></defs>"
        f"<circle cx='{c}' cy='{c}' r='{c}' fill='url(#h)'/>"
        f"<circle cx='{c}' cy='{c}' r='{r:.0f}' fill='url(#m)' opacity='.62'/>"
        f"<circle cx='{c - r * 0.3:.0f}' cy='{c - r * 0.2:.0f}' r='{r * 0.22:.0f}' "
        "fill='#d6a43a' opacity='.35'/>"
        f"<circle cx='{c + r * 0.35:.0f}' cy='{c + r * 0.25:.0f}' r='{r * 0.15:.0f}' "
        "fill='#d6a43a' opacity='.3'/>"
        f"<circle cx='{c + r * 0.1:.0f}' cy='{c - r * 0.45:.0f}' r='{r * 0.1:.0f}' "
        "fill='#d6a43a' opacity='.3'/>"
        "</svg>"
    )


def eyes_svg(width: int, height: int) -> str:
    """Pairs of glowing eyes peering out of the dark fog."""
    pairs = [(0.05, 0.62, 1.0), (0.12, 0.8, 0.8), (0.9, 0.7, 1.1), (0.97, 0.45, 0.7)]
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>",
        "<defs><radialGradient id='y'><stop offset='0' stop-color='#fef08a'/>"
        "<stop offset='.5' stop-color='#facc15'/>"
        "<stop offset='1' stop-color='#facc15' stop-opacity='0'/></radialGradient></defs>",
    ]
    for fx, fy, s in pairs:
        x, y = fx * width, fy * height
        for dx in (-5 * s, 5 * s):
            out.append(
                f"<ellipse cx='{x + dx:.0f}' cy='{y:.0f}' rx='{4 * s:.1f}' ry='{2.4 * s:.1f}' "
                "fill='url(#y)'/>"
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


# ---- spooky branches on top of cards ----

BRANCH_H = 40  # px tall; the card's top edge is BRANCH_EDGE px down from the top
BRANCH_EDGE = 26
BARK, RIM = "#0c0610", "rgba(196, 181, 253, 0.34)"


def branch_svg(seed: int, width: int) -> str:
    """One repeat of a black, gnarled branch lying on a card's top edge, with twigs.

    The limb is a filled shape that swells at knots; twigs are crooked and fork as they
    reach up. Everything near an end is also drawn one repeat over, so repeats join
    without a seam.
    """
    rng = random.Random(seed)
    waves = [(k, rng.uniform(0.6, 1.6), rng.uniform(0, math.tau)) for k in (1, 2, 3)]
    knots = [(rng.uniform(0, width), rng.uniform(1.5, 3), rng.uniform(5, 11)) for _ in range(3)]

    def y_at(x: float) -> float:
        return (
            BRANCH_EDGE - 1 + sum(a * math.sin(k * math.tau * x / width + ph) for k, a, ph in waves)
        )

    def thick(x: float) -> float:
        knot = sum(
            h * math.exp(-(((x - c - shift) / w) ** 2))
            for c, h, w in knots
            for shift in (-width, 0, width)
        )
        return 6.2 + 1.4 * math.sin(2 * math.tau * x / width + waves[0][2]) + knot

    xs = [i * width / 60 for i in range(61)]
    top = " L".join(f"{x:.1f} {y_at(x) - thick(x) / 2:.1f}" for x in xs)
    bottom = " L".join(f"{x:.1f} {y_at(x) + thick(x) / 2:.1f}" for x in reversed(xs))
    limb = f"M{top} L{bottom} Z"

    # Twigs: crooked, forking, reaching up (never down into the card).
    segments: list[tuple[float, float, float, float, float]] = []

    def twig(x: float, y: float, angle: float, length: float, width_: float, depth: int) -> None:
        for _ in range(2):  # kinks make it look gnarled
            angle = max(-170.0, min(-10.0, angle + rng.uniform(-22, 22)))
            rad = math.radians(angle)
            x1, y1 = x + math.cos(rad) * length / 2, y + math.sin(rad) * length / 2
            segments.append((x, y, x1, y1, width_))
            x, y, width_ = x1, y1, width_ * 0.85
        if depth:
            for turn in (rng.uniform(-45, -15), rng.uniform(15, 45)):
                if rng.random() < 0.8:
                    twig(
                        x,
                        y,
                        angle + turn,
                        length * rng.uniform(0.55, 0.75),
                        width_ * 0.7,
                        depth - 1,
                    )

    for _ in range(rng.randint(3, 5)):
        x = rng.uniform(0, width)
        before = len(segments)
        long = rng.random() < 0.45  # some twigs reach far, most stay short
        twig(
            x,
            y_at(x) - 1,
            rng.uniform(-160, -110) if rng.random() < 0.5 else rng.uniform(-70, -20),
            rng.uniform(20, 28) if long else rng.uniform(9, 14),
            3.2 if long else 2.4,
            2 if long else 1,
        )
        # Wrap twigs that cross an end of the repeat.
        for x0, y0, x1, y1, w in segments[before:]:
            for dx in (-width, width):
                if min(x0, x1) + dx < width and max(x0, x1) + dx > 0:
                    segments.append((x0 + dx, y0, x1 + dx, y1, w))

    by_width: dict[float, list[str]] = {}
    for x0, y0, x1, y1, w in segments:
        by_width.setdefault(round(w * 2) / 2, []).append(f"M{x0:.0f} {y0:.0f}L{x1:.0f} {y1:.0f}")

    def twigs(extra: float, color: str, dx: float = 0) -> str:
        return "".join(
            f"<path d='{''.join(d)}' stroke='{color}' stroke-width='{w + extra:.1f}' "
            f"stroke-linecap='round' fill='none' transform='translate({dx} 0)'/>"
            for w, d in by_width.items()
        )

    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{BRANCH_H}' "
        f"viewBox='0 0 {width} {BRANCH_H}'>"
        f"{twigs(1.2, RIM, 1)}<path d='{limb}' fill='{BARK}' stroke='{RIM}' stroke-width='1'/>"
        f"{twigs(0, BARK)}</svg>"
    )


def branches() -> dict[str, Any]:
    """A spooky branch lying on top of every card, like snow, in five random variants."""
    # Airflow's DAG list clips its top edge: leave room for the first card's branch.
    css: dict[str, Any] = {'[data-testid="card-list"]': {"paddingTop": f"{BRANCH_EDGE}px"}}
    # The small grade cards keep only their spiders: a branch would cover their numbers.
    targets = {sel: pick for sel, pick in CAPPED.items() if sel != ".dagwick-gcard"}
    for sel in targets:
        css[f"{sel}::before"] = {
            "content": '""',
            "position": "absolute",
            "top": f"-{BRANCH_EDGE}px",
            "left": "2px",
            "right": "2px",
            "height": f"{BRANCH_H}px",
            "backgroundRepeat": "repeat-x",
            "pointerEvents": "none",
            "zIndex": "1",
        }
    for k in range(5):
        rng = random.Random(SEED + 800 + k)
        width = rng.randint(280, 380)
        key = ", ".join(f"{pick(k + 1)}::before" for pick in targets.values())
        css[key] = {
            "backgroundImage": url(branch_svg(SEED + 900 + k, width)),
            "backgroundSize": f"{width}px {BRANCH_H}px",
            "backgroundPosition": f"{rng.randint(0, width)}px 0",
        }
    return css


def spiders() -> dict[str, Any]:
    """Spiders dangle from the top of about three in five cards, each a little different."""
    css: dict[str, Any] = {sel: {"position": "relative"} for sel in CAPPED}
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
    ghost_w, ghost_h = 1400, 900
    ember_w, ember_h, fog_w, fog_h = 1100, 640, 1400, 130
    css: dict[str, Any] = {
        **branches(),
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
        # Ghosts drifting slowly to the right, bobbing up and down.
        "html::after": {
            **layer,
            "top": "0",
            "height": f"{ghost_h}px",
            "left": f"-{ghost_w}px",
            "right": "0",
            "backgroundImage": url(ghosts_svg(rng, ghost_w, ghost_h, 3)),
            "backgroundSize": f"{ghost_w}px {ghost_h}px",
            "backgroundRepeat": "repeat-x",
            "willChange": "transform",
            "animation": "dagwickGhosts 70s linear infinite",
        },
        "@keyframes dagwickGhosts": {
            "0%": _move(0, 0),
            "25%": _move(ghost_w / 4, -14),
            "50%": _move(ghost_w / 2, 6),
            "75%": _move(ghost_w * 3 / 4, -10),
            "100%": _move(ghost_w, 0),
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
        # Darkness closing in from the edges, a purple glow along the bottom, and the moon.
        "body::before": {
            **layer,
            "inset": "0",
            "backgroundImage": f"{url(moon_svg(260))}, "
            "linear-gradient(to top, rgba(76, 29, 149, 0.2), transparent 90px), "
            "radial-gradient(ellipse at center, transparent 55%, rgba(8, 3, 16, 0.55) 100%)",
            "backgroundRepeat": "no-repeat",
            "backgroundPosition": "right -64px top -64px, 0 0, 0 0",
            "backgroundSize": "200px 200px, 100% 100%, 100% 100%",
        },
        # Glowing eyes in the fog that fade in, blink and vanish again.
        '[data-testid="main-content"]::after': {
            **layer,
            "left": "0",
            "right": "0",
            "bottom": "0",
            "height": "220px",
            "backgroundImage": url(eyes_svg(1400, 220)),
            "backgroundSize": "100% 100%",
            "opacity": "0",
            "willChange": "opacity",
            "animation": "dagwickEyes 14s ease-in-out infinite",
        },
        "@keyframes dagwickEyes": {
            "0%": {"opacity": "0"},
            "18%": {"opacity": "0.85"},
            "40%": {"opacity": "0.85"},
            "41.5%": {"opacity": "0"},
            "43%": {"opacity": "0.85"},
            "62%": {"opacity": "0.85"},
            "78%": {"opacity": "0"},
            "100%": {"opacity": "0"},
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
            "backgroundImage": f"{url(moon_svg(260))}, "
            "linear-gradient(to top, rgba(124, 58, 237, 0.14), transparent 90px), "
            "radial-gradient(ellipse at center, transparent 60%, rgba(46, 16, 101, 0.16) 100%)",
        },
    }
    moving = [
        "html::before",
        "html::after",
        "#root::after",
        '[data-testid="main-content"]::after',
    ]
    spider_keys = [k for k in css if k.endswith("::after") and "nth-child" in k]
    css["@media (prefers-reduced-motion: reduce)"] = {
        sel: {"animation": "none"} for sel in moving + spider_keys
    }
    return css
