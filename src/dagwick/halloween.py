"""Halloween for the whole Airflow UI, drawn with CSS only (used by the Halloween theme).

Bats glide across the top of the screen in two layers (far ones to the right, near ones to
the left) with ghosts drifting below them, glowing embers rise slowly, purple fog drifts
along the bottom with eyes peering out of it, a full moon hangs in the corner, darkness
closes in from the edges, a cobweb hangs in the bottom-right corner, bare twisted trees
grow up the corners of the cards, and small spiders dangle on silk from the top of some
cards. Every moving part is moved with a CSS transform (or faded), which the graphics card
does without repainting the page. Viewers who prefer reduced motion get a still scene.
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


# ---- spooky trees on cards ----

TREE_W, TREE_H = 240, 230  # one tree's drawing; it is scaled to fit each card's height
BARK, RIM = "#0c0610", "rgba(196, 181, 253, 0.32)"

# Where the trees grow: inside each card, behind its text. A DAG card's variant is picked
# by its wrapper's place in the list.
TREED: dict[str, Any] = {
    '[data-testid="dag-card"]': (
        lambda k: f'[data-testid="card-list"] > :nth-child(5n+{k}) > [data-testid="dag-card"]'
    ),
    ".dagwick-gcard": lambda k: f".dagwick-gcard:nth-child(5n+{k})",
    ".dagwick-cat": lambda k: f".dagwick-cat:nth-child(5n+{k})",
    ".dagwick-list": lambda k: f".dagwick-list:nth-child(5n+{k})",
    ".dagwick-theme": lambda k: f".dagwick-theme:nth-child(5n+{k})",
}


class _Tree:
    """A bare, twisted tree grown from a seed, rising from the bottom-right corner."""

    def __init__(self, seed: int) -> None:
        self.rng = random.Random(seed)
        self.limbs: list[tuple[float, float, float, float, float]] = []  # x0 y0 x1 y1 width

    def segment(self, x: float, y: float, angle: float, length: float, width: float):
        rad = math.radians(angle)
        x1, y1 = x + math.cos(rad) * length, y + math.sin(rad) * length
        self.limbs.append((x, y, x1, y1, width))
        return x1, y1

    def branch(self, x: float, y: float, angle: float, length: float, width: float, depth: int):
        """A crooked branch of a few kinked segments that forks into smaller ones."""
        for _ in range(2):  # kinks make it look gnarled
            angle = max(-178.0, min(-2.0, angle + self.rng.uniform(-24, 24)))
            x, y = self.segment(x, y, angle, length / 2, width)
            width *= 0.88
        if depth == 0:
            return
        for turn in (self.rng.uniform(-46, -16), self.rng.uniform(16, 46)):
            if self.rng.random() < 0.9:
                self.branch(
                    x,
                    y,
                    angle + turn,
                    length * self.rng.uniform(0.62, 0.8),
                    width * 0.66,
                    depth - 1,
                )

    def grow(self, eyes: bool) -> str:
        rng = self.rng
        # The trunk, leaning left as it rises from the corner.
        x, y, width = TREE_W - 34.0, float(TREE_H) + 6, 15.0
        lean = rng.uniform(-104, -96)
        for _ in range(5):
            x, y = self.segment(x, y, lean + rng.uniform(-10, 8), rng.uniform(18, 24), width)
            width *= 0.9
        hole = (x + 3, y + 40)
        # The crown: big limbs reaching up and out to the left, and one to the right.
        for angle, reach in ((-160, 64), (-132, 72), (-104, 58), (-62, 46)):
            self.branch(
                x, y, angle + rng.uniform(-8, 8), reach * rng.uniform(0.85, 1.1), width * 0.75, 3
            )
        # Roots gripping the bottom edge.
        for angle in (-170, -10, 175):
            self.segment(TREE_W - 34, TREE_H + 4, angle, rng.uniform(14, 26), 6)

        by_width: dict[float, list[str]] = {}
        for x0, y0, x1, y1, w in self.limbs:
            by_width.setdefault(round(w * 2) / 2, []).append(
                f"M{x0:.0f} {y0:.0f}L{x1:.0f} {y1:.0f}"
            )

        def paths(extra: float, color: str, dx: float = 0) -> str:
            return "".join(
                f"<path d='{''.join(d)}' stroke='{color}' stroke-width='{w + extra:.1f}' "
                f"stroke-linecap='round' stroke-linejoin='round' fill='none' "
                f"transform='translate({dx} 0)'/>"
                for w, d in by_width.items()
            )

        glow = (
            f"<ellipse cx='{hole[0]:.0f}' cy='{hole[1]:.0f}' rx='5' ry='7' fill='#000'/>"
            f"<circle cx='{hole[0] - 2:.0f}' cy='{hole[1] - 1:.0f}' r='1.3' fill='#facc15'/>"
            f"<circle cx='{hole[0] + 2:.0f}' cy='{hole[1] - 1:.0f}' r='1.3' fill='#facc15'/>"
            if eyes
            else ""
        )
        # A moonlit rim on the right of every limb, then the dark silhouette over it.
        return (
            f"<svg xmlns='http://www.w3.org/2000/svg' width='{TREE_W}' height='{TREE_H}' "
            f"viewBox='0 0 {TREE_W} {TREE_H}'>{paths(1.2, RIM, 1.2)}{paths(0, BARK)}{glow}</svg>"
        )


def tree_svg(seed: int, eyes: bool = False) -> str:
    return _Tree(seed).grow(eyes)


def trees() -> dict[str, Any]:
    """A spooky bare tree in the bottom-right corner of every card, behind its text.

    Each tree stands against a soft moonlit glow, so the dark silhouette shows on dark
    cards.
    """
    glow = (
        "radial-gradient(ellipse 70% 75% at 72% 62%, rgba(251, 146, 60, 0.22), "
        "rgba(124, 58, 237, 0.14) 45%, transparent 72%)"
    )
    css: dict[str, Any] = {}
    for sel in TREED:
        # The card becomes its own layer, so the tree sits on its background but under
        # its text, and the card's rounded corners trim the tree.
        css[sel] = {"position": "relative", "isolation": "isolate"}
        css[f"{sel}::before"] = {
            "content": '""',
            "position": "absolute",
            "right": "0",
            "bottom": "0",
            "width": f"{TREE_W}px",
            "height": "100%",
            "maxHeight": f"{TREE_H}px",
            "backgroundRepeat": "no-repeat",
            "backgroundPosition": "right bottom, 0 0",
            "backgroundSize": "contain, 100% 100%",
            "pointerEvents": "none",
            "zIndex": "-1",
        }
    # Airflow's DAG card has a dark header bar: the tree grows below it.
    css['[data-testid="dag-card"]::before'].update({"top": "34px", "height": "auto"})
    for k in range(5):
        key = ", ".join(f"{pick(k + 1)}::before" for pick in TREED.values())
        css[key] = {"backgroundImage": f"{url(tree_svg(SEED + 700 + k, eyes=k == 2))}, {glow}"}
    return css


def spiders() -> dict[str, Any]:
    """Spiders dangle from the top of about three in five cards, each a little different."""
    # Cards with a tree are already positioned (and must keep the tree's settings).
    css: dict[str, Any] = {sel: {"position": "relative"} for sel in CAPPED if sel not in TREED}
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
        **trees(),
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
