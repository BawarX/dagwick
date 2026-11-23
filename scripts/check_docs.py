"""Regenerate the "Check reference" in docs/checks.md from the built-in checks.

    uv run python scripts/check_docs.py          # rewrite the section
    uv run python scripts/check_docs.py --check  # exit 1 if it is out of date

The explanations live on each @check (why, bad, example, ack_when), so
`dagwick explain` and the docs always say the same thing. tests/test_explain.py
fails when this section is stale.

The section sits inside `<!-- fmt:off -->` / `<!-- fmt:on -->`: the snippets are
keyword-argument fragments (`default_args={...}`), which `ruff format` would
otherwise rewrite as assignments.
"""

from __future__ import annotations

import sys
from pathlib import Path

from dagwick.core import registered_checks
from dagwick.explain import markdown_reference, replace_reference

DOCS = Path(__file__).resolve().parent.parent / "docs" / "checks.md"


def main(argv: list[str]) -> int:
    current = DOCS.read_text(encoding="utf-8")
    updated = replace_reference(current, markdown_reference(registered_checks()))
    if "--check" in argv:
        if updated != current:
            print("docs/checks.md is out of date: run `uv run python scripts/check_docs.py`.")
            return 1
        return 0
    DOCS.write_text(updated, encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
