"""Fuzz target: `dagwick fix` on any text.

For any input that parses as Python, the fixed text must still parse, and
fixing it again must change nothing (every fixer is idempotent). Input that
doesn't parse must be refused with SyntaxError or ValueError, never another
exception.

Run with Atheris (Linux), or through ClusterFuzzLite (.clusterfuzzlite/):

    python fuzz/fuzz_fix.py -atheris_runs=100000
"""

from __future__ import annotations

import ast
import logging
import sys

from dagwick.fix import fix_source


def TestOneInput(data: bytes) -> None:
    source = data.decode("utf-8", errors="replace")
    try:
        first = fix_source(source, unsafe=True)
    except (SyntaxError, ValueError, RecursionError, MemoryError):
        return  # not Python (or too deeply nested to parse): dagwick fix reports it
    ast.parse(first.text)  # the fix must leave valid Python
    second = fix_source(first.text, unsafe=True)
    assert not second.applied, [f.message for f in second.applied]
    assert second.text == first.text


def main() -> None:
    import atheris

    logging.disable(logging.CRITICAL)
    atheris.instrument_all()
    atheris.Setup(sys.argv, TestOneInput)
    atheris.Fuzz()


if __name__ == "__main__":
    main()
