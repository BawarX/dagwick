"""Print the release notes for one version, taken from CHANGELOG.md.

Usage: python scripts/release_notes.py 0.2.0 > notes.md

Exits with an error if the version has no section, or if the section is still
marked "unreleased" (date it before releasing). Standard library only.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

CHANGELOG = Path(__file__).resolve().parents[1] / "CHANGELOG.md"
HEADING = re.compile(r"^## \[(?P<version>[^\]]+)\](?: - (?P<date>.+))?\s*$")


def notes_for(version: str, changelog: str) -> str:
    lines = changelog.splitlines()
    start = date = None
    for i, line in enumerate(lines):
        m = HEADING.match(line)
        if m and m["version"] == version:
            start, date = i + 1, (m["date"] or "").strip()
            break
    if start is None:
        raise SystemExit(f"CHANGELOG.md has no section for {version}")
    if not date or date.lower() == "unreleased":
        raise SystemExit(f"CHANGELOG.md section {version} is not dated yet (still 'unreleased')")
    end = next((j for j in range(start, len(lines)) if HEADING.match(lines[j])), len(lines))
    body = "\n".join(lines[start:end]).strip()
    if not body:
        raise SystemExit(f"CHANGELOG.md section {version} is empty")
    return f"Install: `pip install dagwick=={version}`\n\n{body}\n"


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__.strip().splitlines()[2], file=sys.stderr)
        return 2
    print(notes_for(argv[1].removeprefix("v"), CHANGELOG.read_text()), end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
