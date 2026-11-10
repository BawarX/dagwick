"""Halloween for the whole Airflow UI, drawn with CSS only (used by the Halloween theme).

Bats glide across the top of the screen in two layers (far ones to the right, near ones to
the left) with ghosts drifting below them, glowing embers rise slowly, purple fog drifts
along the bottom with eyes peering out of it, a full moon hangs in the corner, darkness
closes in from the edges, a cobweb hangs in the bottom-right corner, and small spiders
dangle on silk from the top of some cards. Every moving part is moved with a CSS transform
(or faded), which the graphics card does without repainting the page. Viewers who prefer
reduced motion get a still scene.
"""

from __future__ import annotations

import math
import random
from typing import Any

from dagwick.snow import CAPPED, INSIDE, url

SEED = 1031

TOP = "2147483646"  # above Airflow's content, below its pop-ups' own top layer


def _move(x: float, y: float) -> dict[str, str]:
    return {"transform": f"translate3d({x:.0f}px, {y:.0f}px, 0)"}


# ---- bats ----

# One wing, from the shoulder out, as (x, y) points: shoulder, wrist, tip, then the
# scalloped trailing edge back to the body. The other wing is its mirror image.
WING = [
    (2, -3),
    (10, -9),
    (16, -11),
    (30, -5),
    (26, -2),
    (24, 3),
    (20, 0),
    (17, 5),
    (13, 2),
    (9, 6),
    (6, 3),
    (2, 4),
]
WRIST, SCALLOPS = 2, (4, 6, 8, 10)  # finger bones run from the wrist to these points
POSES = {"up": -38, "glide": 0, "down": 26}  # wing turn (degrees) at the shoulder


def _turn(pts, deg: float, about=(2, -3)):
    rad = math.radians(deg)
    cx, cy = about
    return [
        (
            cx + (x - cx) * math.cos(rad) - (y - cy) * math.sin(rad),
            cy + (x - cx) * math.sin(rad) + (y - cy) * math.cos(rad),
        )
        for x, y in pts
    ]


def bat_svg(pose: str, eyes: bool) -> str:
    """A bat with scalloped wings, finger bones, ears and (for near bats) glowing eyes."""
    right = _turn(WING, POSES[pose])
    left = [(-x, y) for x, y in right]

    def wing(pts) -> str:
        sh, wr, j, tip = pts[0], pts[1], pts[2], pts[3]
        d = f"M{sh[0]:.1f} {sh[1]:.1f} Q{wr[0]:.1f} {wr[1]:.1f} {j[0]:.1f} {j[1]:.1f} "
        d += f"L{tip[0]:.1f} {tip[1]:.1f} "
        rest = pts[4:]
        for c, e in zip(rest[0::2], rest[1::2], strict=False):  # scallops curve inwards
            d += f"Q{c[0]:.1f} {c[1]:.1f} {e[0]:.1f} {e[1]:.1f} "
        return d + "Z"

    def bones(pts) -> str:
        wr = pts[WRIST]
        return " ".join(
            f"M{wr[0]:.1f} {wr[1]:.1f} L{pts[i][0]:.1f} {pts[i][1]:.1f}" for i in SCALLOPS
        )

    rim = "stroke='#c4b5fd' stroke-opacity='.6' stroke-width='.7' stroke-linejoin='round'"
    eye = (
        "<circle cx='-1.2' cy='-6.6' r='.75' fill='#ff5a36'/>"
        "<circle cx='1.2' cy='-6.6' r='.75' fill='#ff5a36'/>"
        if eyes
        else ""
    )
    return (
        f"<g><path d='{wing(left)} {wing(right)}' fill='#1d0f2e' {rim}/>"
        f"<path d='{bones(left)} {bones(right)}' stroke='#8b5cf6' stroke-opacity='.45' "
        "stroke-width='.6' fill='none'/>"
        f"<ellipse cx='0' cy='0' rx='3.3' ry='5.6' fill='#140a20' {rim}/>"
        f"<path d='M-2.6 -6 L-2.2 -11 L-0.6 -7.6 Z M2.6 -6 L2.2 -11 L0.6 -7.6 Z' "
        f"fill='#140a20' {rim}/>"
        f"<circle cy='-6' r='2.9' fill='#140a20'/>{eye}</g>"
    )


def ghost_svg() -> str:
    """A small see-through ghost with a wavy hem and dark eyes."""
    return (
        "<g><path d='M0 -14 C8 -14 12 -8 12 0 V12 Q9 9 6 12 Q3 15 0 12 Q-3 15 -6 12 "
        "Q-9 9 -12 12 V0 C-12 -8 -8 -14 0 -14Z' fill='#ede9fe' filter='url(#g)'/>"
        "<ellipse cx='-4' cy='-4' rx='1.8' ry='2.6' fill='#1d0f2e'/>"
        "<ellipse cx='4' cy='-4' rx='1.8' ry='2.6' fill='#1d0f2e'/>"
        "<ellipse cx='0' cy='3' rx='1.6' ry='2.2' fill='#1d0f2e' opacity='.7'/></g>"
    )


def bats_svg(
    rng: random.Random,
    width: int,
    height: int,
    count: int,
    size: tuple,
    eyes: bool = False,
    ghosts: int = 0,
) -> str:
    """Bats over the top part of one repeat, each in its own pose, size and tilt.

    Bats caught at different points of their wing beat make the flock look like it is
    flapping, without animating each bat. Optional ghosts drift lower down.
    """
    out = [
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>",
        "<defs><filter id='g' x='-30%' y='-30%' width='160%' height='160%'>"
        "<feGaussianBlur stdDeviation='.8'/></filter>",
        *(f"<g id='{p}'>{bat_svg(p, eyes)}</g>" for p in POSES),
        f"<g id='ghost'>{ghost_svg()}</g></defs>",
    ]

    def place(ref: str, x: float, y: float, scale: float, tilt: float, op: float) -> None:
        for dx in (-width, 0, width):
            if abs(x + dx - width / 2) < width / 2 + 60:
                out.append(
                    f"<use href='#{ref}' transform='translate({x + dx:.0f} {y:.0f}) "
                    f"rotate({tilt:.0f}) scale({scale:.2f})' opacity='{op:.2f}'/>"
                )

    for _ in range(count):
        place(
            rng.choice(list(POSES)),
            rng.uniform(0, width),
            rng.uniform(height * 0.04, height * 0.42),
            rng.uniform(*size) / 30,
            rng.uniform(-12, 12),
            rng.uniform(0.8, 0.98),
        )
    for _ in range(ghosts):
        place(
            "ghost",
            rng.uniform(0, width),
            rng.uniform(height * 0.5, height * 0.85),
            rng.uniform(0.9, 1.4),
            rng.uniform(-8, 8),
            rng.uniform(0.16, 0.3),
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


# ---- dead branches on cards ----

BRANCH_H = 42  # px; the card's top edge is BRANCH_EDGE px down from the top of the branch
BRANCH_EDGE = 24
BARK, RIM = "#24160f", "rgba(214, 196, 255, 0.4)"
LEAVES = ("#9a3412", "#7c2d12", "#b45309", "#78350f")


def _stroke(d: str, width: float) -> str:
    """A branch line with a faint moonlit rim under it, so it shows on dark cards."""
    return (
        f"<path d='{d}' fill='none' stroke='{RIM}' stroke-width='{width + 1.6:.1f}' "
        "stroke-linecap='round' stroke-linejoin='round'/>"
        f"<path d='{d}' fill='none' stroke='{BARK}' stroke-width='{width:.1f}' "
        "stroke-linecap='round' stroke-linejoin='round'/>"
    )


def _twig(rng: random.Random, x: float, y: float, angle: float, length: float, width: float):
    """A crooked twig from (x, y), with a smaller fork, thorns and maybe a dead leaf."""
    parts, leaves = [], []
    rad = math.radians(angle)
    bend = rng.uniform(-0.35, 0.35)
    mx, my = x + math.cos(rad) * length * 0.5, y + math.sin(rad) * length * 0.5
    ex = x + math.cos(rad + bend) * length
    ey = y + math.sin(rad + bend) * length
    parts.append(_stroke(f"M{x:.1f} {y:.1f} Q{mx:.1f} {my:.1f} {ex:.1f} {ey:.1f}", width))
    side = rng.choice((-1, 1))
    frad = rad + side * rng.uniform(0.6, 1.0)
    fl = length * rng.uniform(0.35, 0.55)
    parts.append(
        _stroke(
            f"M{mx:.1f} {my:.1f} L{mx + math.cos(frad) * fl:.1f} {my + math.sin(frad) * fl:.1f}",
            max(1.2, width * 0.6),
        )
    )
    for _ in range(2):  # thorns
        t = rng.uniform(0.2, 0.8)
        tx, ty = x + (ex - x) * t, y + (ey - y) * t
        trad = rad + rng.choice((-1, 1)) * 1.2
        parts.append(
            f"<path d='M{tx:.1f} {ty:.1f} l{math.cos(trad) * 3:.1f} {math.sin(trad) * 3:.1f}' "
            f"stroke='{BARK}' stroke-width='.8' stroke-linecap='round'/>"
        )
    if rng.random() < 0.45:
        leaves.append(
            f"<ellipse cx='{ex:.1f}' cy='{ey:.1f}' rx='3.2' ry='1.6' "
            f"transform='rotate({rng.uniform(0, 180):.0f} {ex:.1f} {ey:.1f})' "
            f"fill='{rng.choice(LEAVES)}' opacity='.9'/>"
        )
    return parts, leaves, (ex, ey)


def branch_svg(seed: int, width: int) -> str:
    """One repeat of a gnarled branch lying along a card's top edge, with twigs.

    The branch wobbles with waves that fit the repeat exactly, and twigs near an edge are
    drawn on both sides, so the repeats join without a seam.
    """
    rng = random.Random(seed)
    waves = [(rng.randint(1, 3), rng.uniform(0.8, 2.2), rng.uniform(0, math.tau)) for _ in range(3)]

    def y_at(x: float) -> float:
        return (
            BRANCH_EDGE
            - 1.5
            + sum(a * math.sin(k * math.tau * x / width + ph) for k, a, ph in waves)
        )

    knots = [(rng.uniform(0, width), rng.uniform(1.5, 3), rng.uniform(5, 12)) for _ in range(3)]

    def thick(x: float) -> float:
        swell = 1.2 * math.sin(2 * math.tau * x / width + waves[0][2])
        knot = sum(
            h * math.exp(-(((x - c - shift) / w) ** 2))
            for c, h, w in knots
            for shift in (-width, 0, width)
        )
        return 5.2 + swell + knot

    xs = [i * width / 60 for i in range(61)]
    top = " L".join(f"{x:.1f} {y_at(x) - thick(x) / 2:.1f}" for x in xs)
    bottom = " L".join(f"{x:.1f} {y_at(x) + thick(x) / 2:.1f}" for x in reversed(xs))
    grain = " ".join(
        f"M{x:.1f} {y_at(x) - 0.6:.1f} l{rng.uniform(5, 11):.1f} {rng.uniform(-0.6, 0.6):.1f}"
        for x in (rng.uniform(0, width - 12) for _ in range(6))
    )
    parts = [
        f"<path d='M{top} L{bottom} Z' fill='{BARK}' stroke='{RIM}' stroke-width='.9' "
        "stroke-linejoin='round'/>",
        f"<path d='{grain}' stroke='#4a3226' stroke-width='.8' stroke-linecap='round'/>",
    ]
    leaves, tips = [], []
    for _ in range(rng.randint(3, 4)):
        x = rng.uniform(0, width)
        up = rng.random() < 0.75  # most twigs reach up, a few droop
        angle = rng.uniform(-150, -30) if up else rng.uniform(30, 150)
        length = rng.uniform(13, 22) if up else rng.uniform(8, 12)
        for dx in (-width, 0, width):
            if abs(x + dx - width / 2) < width / 2 + 24:
                p, lv, tip = _twig(random.Random(int(x * 100)), x + dx, y_at(x), angle, length, 3)
                parts += p
                leaves += lv
                if dx == 0 and up:
                    tips.append(tip)
    if len(tips) >= 2 and rng.random() < 0.6:  # a strand of cobweb between two twigs
        (x0, y0), (x1, y1) = sorted(tips)[:2]
        parts.append(
            f"<path d='M{x0:.1f} {y0:.1f} Q{(x0 + x1) / 2:.1f} {max(y0, y1) + 6:.1f} "
            f"{x1:.1f} {y1:.1f}' fill='none' stroke='#e9e3ff' stroke-opacity='.45' "
            "stroke-width='.6'/>"
        )
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{BRANCH_H}' "
        f"viewBox='0 0 {width} {BRANCH_H}'>{''.join(parts)}{''.join(leaves)}</svg>"
    )


def corner_svg(seed: int) -> str:
    """A branch curling over the card's top-left corner and down its side."""
    rng = random.Random(seed)
    h = 74
    d = (
        f"M2 {BRANCH_EDGE + 2} C{rng.uniform(4, 9):.1f} {BRANCH_EDGE + 14} "
        f"{rng.uniform(1, 5):.1f} {BRANCH_EDGE + 30} {rng.uniform(5, 9):.1f} {h - 6}"
    )
    parts = [_stroke(d, 4.2)]
    for t, ang in ((0.35, rng.uniform(150, 175)), (0.7, rng.uniform(165, 200))):
        y = BRANCH_EDGE + 2 + (h - BRANCH_EDGE - 8) * t
        p, lv, _ = _twig(rng, 5, y, ang, rng.uniform(7, 11), 2.2)
        parts += p + lv
    return f"<svg xmlns='http://www.w3.org/2000/svg' width='30' height='{h}'>{''.join(parts)}</svg>"


def branches() -> dict[str, Any]:
    """Dead branches along the top of every card, in five random variants."""
    # Airflow's DAG list clips its top edge: leave room for the first card's branch.
    css: dict[str, Any] = {'[data-testid="card-list"]': {"paddingTop": f"{BRANCH_EDGE}px"}}
    # The small grade cards keep only their spiders: a branch would cross their numbers.
    targets = {sel: pick for sel, pick in CAPPED.items() if sel != ".dagwick-gcard"}
    for sel in targets:
        inside = sel in INSIDE
        css[sel] = {"position": "relative"}
        css[f"{sel}::before"] = {
            "content": '""',
            "position": "absolute",
            "top": "-1px" if inside else f"-{BRANCH_EDGE}px",
            "left": "-12px",
            "right": "4px",
            "height": "74px",
            "backgroundRepeat": "repeat-x, no-repeat",
            "pointerEvents": "none",
            "zIndex": "1",
        }
    for k in range(5):
        rng = random.Random(SEED + 200 + k)
        w = rng.randint(300, 420)
        key = ", ".join(f"{pick(k + 1)}::before" for pick in targets.values())
        css[key] = {
            "backgroundImage": f"{url(branch_svg(SEED + 300 + k, w))}, "
            f"{url(corner_svg(SEED + 400 + k))}",
            "backgroundSize": f"{w}px {BRANCH_H}px, 30px 74px",
            "backgroundPosition": f"{rng.randint(0, w)}px 0, 0 0",
        }
    return css


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
        # Far bats, small and slow, flying right.
        "html::after": {
            **layer,
            "top": "0",
            "height": f"{far_h}px",
            "left": f"-{far_w}px",
            "right": "0",
            "backgroundImage": url(bats_svg(rng, far_w, far_h, 5, (26, 36), ghosts=3)),
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
            "backgroundImage": url(bats_svg(rng, near_w, near_h, 3, (36, 48), eyes=True)),
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
        "body::after",
        "#root::after",
        '[data-testid="main-content"]::after',
    ]
    spider_keys = [k for k in css if k.endswith("::after") and "nth-child" in k]
    css["@media (prefers-reduced-motion: reduce)"] = {
        sel: {"animation": "none"} for sel in moving + spider_keys
    }
    return css
