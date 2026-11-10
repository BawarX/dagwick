"""Halloween for the whole Airflow UI, drawn with CSS only (used by the Halloween theme).

Dark bats flit about on their own random paths, beating their wings, ghosts drift
through the screen, glowing embers rise slowly, purple fog drifts along the bottom with
eyes peering out of it, a full moon hangs in the corner, darkness closes in from the
edges, a cobweb hangs in the bottom-right corner, black gnarled branches lie on top of
the cards, and small spiders dangle on silk from them. Everything moves with CSS
transforms (or fades), which the graphics card does without repainting the page.
Viewers who prefer reduced motion get a still scene.
"""

from __future__ import annotations

import math
import random
from typing import Any

from dagwick.snow import CAPPED, url

SEED = 1031

# Above Airflow's content but below its menus and dialogs (Chakra puts those at 1400+);
# Airflow's sidebar is lifted just above the decorations so they never cover it.
TOP = "1000"
SIDEBAR = "1001"


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


# ---- small bats ----

BAT = (
    "M0 -2 C2 -6 6 -6 8 -3 C10 -6 14 -7 18 -4 C15 -3 14 0 15 3 C12 1 9 2 8 4 "
    "C6 2 3 2 0 5 C-3 2 -6 2 -8 4 C-9 2 -12 1 -15 3 C-14 0 -15 -3 -18 -4 "
    "C-14 -7 -10 -6 -8 -3 C-6 -6 -2 -6 0 -2Z M-2.2 -2.5 L-1.6 -6 L-0.4 -3.2Z "
    "M2.2 -2.5 L1.6 -6 L0.4 -3.2Z"
)


# Each bat is drawn in four wing positions, one above the other, and flips through them
# like a flip-book: wings up, half, down, half.
FRAME_W, FRAME_H = 64, 40
WING_POSES = (-46, -14, 22, -14)  # wing turn (degrees) at the shoulder, per frame

# One wing from the shoulder out: shoulder, wrist, tip, then the scalloped trailing edge.
WING = [
    (3, -2),
    (12, -9),
    (19, -11),
    (31, -4),
    (27, -1),
    (25, 4),
    (21, 1),
    (18, 6),
    (14, 3),
    (10, 7),
    (7, 4),
    (3, 5),
]


def _turn(pts, deg: float, about=(3, -2)):
    rad = math.radians(deg)
    cx, cy = about
    return [
        (
            cx + (x - cx) * math.cos(rad) - (y - cy) * math.sin(rad),
            cy + (x - cx) * math.sin(rad) + (y - cy) * math.cos(rad),
        )
        for x, y in pts
    ]


def _bat_frame(deg: float, dy: float) -> str:
    """One frame: a bat with both wings turned to the same pose."""
    right = _turn(WING, deg)
    left = [(-x, y) for x, y in right]

    def wing(pts) -> str:
        sh, wr, j, tip = pts[0], pts[1], pts[2], pts[3]
        d = f"M{sh[0]:.1f} {sh[1]:.1f} Q{wr[0]:.1f} {wr[1]:.1f} {j[0]:.1f} {j[1]:.1f} "
        d += f"L{tip[0]:.1f} {tip[1]:.1f} "
        rest = pts[4:]
        for c, e in zip(rest[0::2], rest[1::2], strict=False):
            d += f"Q{c[0]:.1f} {c[1]:.1f} {e[0]:.1f} {e[1]:.1f} "
        return d + "Z"

    rim = "stroke='#ffffff' stroke-opacity='.16' stroke-width='.8' stroke-linejoin='round'"
    return (
        f"<g transform='translate({FRAME_W / 2} {FRAME_H / 2 + dy:.1f})' fill='#07040b' {rim}>"
        f"<path d='{wing(left)} {wing(right)}'/>"
        "<ellipse rx='3.4' ry='5.8'/>"
        "<path d='M-2.6 -5.5 L-2.1 -10 L-0.5 -7.2 Z M2.6 -5.5 L2.1 -10 L0.5 -7.2 Z'/>"
        "<circle cy='-5.6' r='2.9'/>"
        "<circle cx='-1.1' cy='-6' r='.6' fill='#ff5a36' stroke='none'/>"
        "<circle cx='1.1' cy='-6' r='.6' fill='#ff5a36' stroke='none'/></g>"
    )


def bat_sprite_svg() -> str:
    """The four wing positions stacked from top to bottom. The body rises a little as the
    wings push down, as a real bat's does."""
    frames = "".join(
        f"<g transform='translate(0 {i * FRAME_H})'>{_bat_frame(deg, dy)}</g>"
        for i, (deg, dy) in enumerate(zip(WING_POSES, (2, 0, -2, 0), strict=True))
    )
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{FRAME_W}' "
        f"height='{FRAME_H * len(WING_POSES)}'>{frames}</svg>"
    )


def bat_flight(name: str, seed: int) -> dict[str, Any]:
    """A bat's own random, jittery flight: it fades in out of the dark somewhere on the
    page, flits between random points with sudden turns, and fades out again.

    It stays to the right of Airflow's sidebar and in the upper part of the screen.
    """
    rng = random.Random(seed)
    stops = rng.randint(9, 13)
    x, y = rng.uniform(15, 85), rng.uniform(8, 50)
    steps: dict[str, Any] = {}
    for i in range(stops + 1):
        t = i / stops
        # Short, sudden darts in a new direction each time.
        x = max(6.0, min(94.0, x + rng.uniform(-18, 18)))
        y = max(6.0, min(55.0, y + rng.uniform(-12, 12)))
        tilt = rng.uniform(-28, 28)
        fade = 0 if i in (0, stops) else 1
        steps[f"{t * 100:.1f}%"] = {
            "translate": f"calc(64px + {x:.1f} * (100vw - 64px) / 100 - 50%) {y:.1f}vh",
            "rotate": f"{tilt:.0f}deg",
            "opacity": str(fade),
            "animationTimingFunction": "ease-in-out",
        }
    return {f"@keyframes {name}": steps}


# Elements whose free ::before/::after carry one bat each; they exist on every Airflow page.
BAT_HOSTS = (
    "html::after",
    "body::after",
    '[data-testid="nav-sidebar"]::before',
    '[data-testid="nav-sidebar"]::after',
    '[data-testid="nav-home-link"]::before',
    '[data-testid="nav-dags-link"]::before',
)


def bats() -> dict[str, Any]:
    """Six bats, each with its own size, path, speed and wing beat."""
    sprite = url(bat_sprite_svg())
    frames = len(WING_POSES)
    # What all six bats share, once: the flip-book drawing and how they are placed.
    css: dict[str, Any] = {
        ", ".join(BAT_HOSTS): {
            "content": '""',
            "position": "fixed",
            "top": "0",
            "left": "0",
            "pointerEvents": "none",
            "zIndex": TOP,
            "opacity": "0",
            "backgroundImage": sprite,
            "backgroundRepeat": "no-repeat",
            "willChange": "translate, rotate, opacity",
        }
    }
    for i, host in enumerate(BAT_HOSTS):
        rng = random.Random(SEED + 50 + i)
        w = rng.uniform(30, 46)  # wingspan in px
        h = w * FRAME_H / FRAME_W
        flight, flap = f"dagwickBat{i}", rng.uniform(0.22, 0.34)
        css[host] = {
            "width": f"{w:.0f}px",
            "height": f"{h:.0f}px",
            "backgroundSize": f"{w:.0f}px {h * frames:.0f}px",
            "animation": f"{flight} {rng.uniform(16, 28):.1f}s linear "
            f"-{rng.uniform(0, 28):.1f}s infinite, "
            f"dagwickFlap {flap:.2f}s steps({frames}) infinite",
        }
        css.update(bat_flight(flight, SEED + 60 + i))
    # A percentage offset is measured against (box - image) = -(frames - 1) box heights,
    # so frames / (frames - 1) * 100% moves the strip up by all four frames; steps() then
    # shows each frame in turn and loops back to the first.
    css["@keyframes dagwickFlap"] = {
        "from": {"backgroundPosition": "0 0"},
        "to": {"backgroundPosition": f"0 {frames / (frames - 1) * 100:.3f}%"},
    }
    return css


# ---- moon, eyes and vignette ----


def moon_svg(size: int) -> str:
    """A full moon: shaded like a sphere, with dark seas, small craters, a soft halo and
    thin clouds drifting across it."""
    rng = random.Random(SEED + 11)
    c, r = size / 2, size * 0.3

    def blob(cx: float, cy: float, rad: float, points: int = 9) -> str:
        pts = []
        for i in range(points):
            a = math.tau * i / points
            d = rad * rng.uniform(0.7, 1.15)
            pts.append((cx + d * math.cos(a), cy + d * math.sin(a)))
        out = f"M{(pts[0][0] + pts[-1][0]) / 2:.1f} {(pts[0][1] + pts[-1][1]) / 2:.1f}"
        for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1], strict=True):
            out += f" Q{x0:.1f} {y0:.1f} {(x0 + x1) / 2:.1f} {(y0 + y1) / 2:.1f}"
        return out + "Z"

    seas = "".join(
        f"<path d='{blob(c + dx * r, c + dy * r, rad * r)}'/>"
        for dx, dy, rad in (
            (-0.3, -0.25, 0.3),
            (0.15, -0.35, 0.22),
            (0.3, 0.1, 0.26),
            (-0.1, 0.3, 0.2),
            (-0.45, 0.15, 0.16),
        )
    )
    craters = []
    for _ in range(9):
        a, d = rng.uniform(0, math.tau), rng.uniform(0, 0.82) * r
        x, y, cr = c + d * math.cos(a), c + d * math.sin(a), rng.uniform(0.03, 0.07) * r
        craters.append(
            f"<circle cx='{x:.1f}' cy='{y:.1f}' r='{cr:.1f}' fill='#b3a57c' opacity='.55'/>"
            f"<path d='M{x - cr:.1f} {y:.1f} A{cr:.1f} {cr:.1f} 0 0 0 {x + cr:.1f} {y:.1f}' "
            "fill='none' stroke='#fffaf0' stroke-opacity='.55' stroke-width='.8'/>"
        )
    clouds = "".join(
        f"<ellipse cx='{c + dx * r:.1f}' cy='{c + dy * r:.1f}' rx='{w * r:.1f}' ry='{h * r:.1f}'/>"
        for dx, dy, w, h in (
            (-0.2, 0.55, 1.1, 0.09),
            (0.35, 0.72, 0.9, 0.07),
            (-0.5, 0.82, 0.7, 0.06),
        )
    )
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{size}' height='{size}'>"
        "<defs>"
        "<radialGradient id='h'><stop offset='.35' stop-color='#fef3c7' stop-opacity='.22'/>"
        "<stop offset='.6' stop-color='#c4b5fd' stop-opacity='.07'/>"
        "<stop offset='1' stop-color='#c4b5fd' stop-opacity='0'/></radialGradient>"
        "<radialGradient id='m' cx='42%' cy='38%' r='62%'>"
        "<stop offset='0' stop-color='#fffbeb'/><stop offset='.65' stop-color='#ece2c0'/>"
        "<stop offset='1' stop-color='#bfae84'/></radialGradient>"
        f"<clipPath id='d'><circle cx='{c}' cy='{c}' r='{r:.1f}'/></clipPath>"
        "<filter id='s'><feGaussianBlur stdDeviation='1.6'/></filter>"
        "<filter id='w'><feGaussianBlur stdDeviation='2.4'/></filter>"
        "</defs>"
        f"<circle cx='{c}' cy='{c}' r='{c}' fill='url(#h)'/>"
        f"<g opacity='.85'><circle cx='{c}' cy='{c}' r='{r:.1f}' fill='url(#m)'/>"
        f"<g clip-path='url(#d)'><g fill='#a8996f' opacity='.38' filter='url(#s)'>{seas}</g>"
        f"{''.join(craters)}</g></g>"
        f"<g fill='#1c1428' opacity='.7' filter='url(#w)'>{clouds}</g>"
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


# ---- Airflow's sidebar ----

# Free pseudo-elements on the sidebar's first links. They are positioned against the
# window (the sidebar is fixed at the left, SIDEBAR_W wide) and drawn inside the
# sidebar's own layer, so they stay with it and never cover the main page.
SIDEBAR_W = 64
SIDEBAR_GLOW = '[data-testid="nav-home-link"]::after'
SIDEBAR_WEB = '[data-testid="nav-dags-link"]::after'
SIDEBAR_SPIDER = '[data-testid="nav-assets-link"]::before'
SPIDER_THREAD = 120


def sidebar() -> dict[str, Any]:
    """Halloween on Airflow's sidebar: a dusk glow, a cobweb and a spider on its thread.

    The glow and the web sit behind the sidebar's icons; the spider hangs at the edge.
    None of them takes a click.
    """
    fixed = {"content": '""', "position": "fixed", "pointerEvents": "none"}
    web = 40
    return {
        # Behind the icons: night purple fading down to an ember glow along the bottom.
        SIDEBAR_GLOW: {
            **fixed,
            "top": "0",
            "left": "0",
            "width": f"{SIDEBAR_W}px",
            "height": "100vh",
            "zIndex": "-1",
            "backgroundImage": "radial-gradient(90px 160px at 50% 100%, "
            "rgba(234, 88, 12, 0.22), transparent 70%), "
            "linear-gradient(to bottom, rgba(46, 16, 101, 0.5), rgba(12, 6, 20, 0.35) 55%, "
            "rgba(46, 16, 101, 0.35))",
        },
        "html.light " + SIDEBAR_GLOW: {
            "backgroundImage": "radial-gradient(90px 160px at 50% 100%, "
            "rgba(234, 88, 12, 0.16), transparent 70%), "
            "linear-gradient(to bottom, rgba(124, 58, 237, 0.16), transparent 60%, "
            "rgba(124, 58, 237, 0.12))",
        },
        # A cobweb strung across the top-right corner, behind Airflow's logo.
        SIDEBAR_WEB: {
            **fixed,
            "top": "0",
            "left": f"{SIDEBAR_W - web}px",
            "width": f"{web}px",
            "height": f"{web}px",
            "zIndex": "-1",
            "transform": "scaleY(-1)",
            "backgroundImage": url(web_svg(web, "rgba(225, 222, 240, 0.4)")),
        },
        "html.light " + SIDEBAR_WEB: {
            "backgroundImage": url(web_svg(web, "rgba(90, 86, 110, 0.4)")),
        },
        # A spider letting itself down from the top along the edge, and climbing back.
        SIDEBAR_SPIDER: {
            **fixed,
            "top": f"-{SPIDER_THREAD // 2}px",
            "left": f"{SIDEBAR_W - 15}px",
            "width": "22px",
            "height": f"{SPIDER_THREAD + 22}px",
            "zIndex": "1",
            "backgroundImage": url(spider_svg(SPIDER_THREAD)),
            "transformOrigin": "50% 0",
            "willChange": "translate, rotate",
            "animation": "dagwickSidebarSpider 19s ease-in-out infinite",
        },
        "@keyframes dagwickSidebarSpider": {
            "0%": {"translate": "0 -60px", "rotate": "0deg"},
            "30%": {"translate": "0 110px", "rotate": "2deg"},
            "42%": {"translate": "0 96px", "rotate": "-2deg"},
            "55%": {"translate": "0 120px", "rotate": "1deg"},
            "80%": {"translate": "0 -10px", "rotate": "-1deg"},
            "100%": {"translate": "0 -60px", "rotate": "0deg"},
        },
    }


def global_css() -> dict[str, Any]:
    """Halloween as Airflow theme ``globalCss`` (selector -> style)."""
    rng = random.Random(SEED)
    layer = {"content": '""', "position": "fixed", "pointerEvents": "none", "zIndex": TOP}
    ghost_w, ghost_h = 1400, 900
    ember_w, ember_h, fog_w, fog_h = 1100, 640, 1400, 130
    css: dict[str, Any] = {
        **branches(),
        **bats(),
        **spiders(),
        **sidebar(),
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
        '[data-testid="main-content"]::before': {
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
        # Keep Airflow's sidebar (and its user menu) above the page's decorations; it has
        # its own (see sidebar()).
        # Airflow's own style for the sidebar outranks theme styles, hence !important.
        '[data-testid="nav-sidebar"]': {"zIndex": f"{SIDEBAR} !important"},
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
            "backgroundPosition": "right -62px top -74px, 0 0, 0 0",
            "backgroundSize": "230px 230px, 100% 100%, 100% 100%",
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
        *BAT_HOSTS,
        '[data-testid="main-content"]::before',
        "#root::after",
        '[data-testid="main-content"]::after',
        SIDEBAR_SPIDER,
    ]
    spider_keys = [k for k in css if k.endswith("::after") and "nth-child" in k]
    css["@media (prefers-reduced-motion: reduce)"] = {
        sel: {"animation": "none"} for sel in moving + spider_keys
    }
    return css
