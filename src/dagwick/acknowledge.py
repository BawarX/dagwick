"""Acknowledgements: a DAG file marks a check it breaks on purpose.

A comment anywhere in the DAG file acknowledges one or more checks, with a reason::

    catchup=True,  # dagwick: ack catchup -- backfills daily files after outages

The comment applies to every DAG defined in that file. The source is read with
:mod:`tokenize`, never executed.
"""

from __future__ import annotations

import functools
import io
import re
import tokenize
from collections.abc import Mapping
from types import MappingProxyType

_ACK = re.compile(
    r"^#\s*dagwick:\s*ack\s+"
    r"(?P<ids>[A-Za-z0-9_]+(?:\s*,\s*[A-Za-z0-9_]+)*)"
    r"\s*(?:(?:--|—|–)\s*(?P<reason>.*))?$",
    re.IGNORECASE,
)

_NONE: Mapping[str, str] = MappingProxyType({})


@functools.lru_cache(maxsize=64)
def acknowledgements(source: str) -> Mapping[str, str]:
    """Map each acknowledged check id to its reason ("" when none was given)."""
    reasons: dict[str, list[str]] = {}
    try:
        for tok in tokenize.generate_tokens(io.StringIO(source).readline):
            if tok.type != tokenize.COMMENT:
                continue
            match = _ACK.match(tok.string.strip())
            if not match:
                continue
            reason = (match["reason"] or "").strip()
            for check_id in match["ids"].split(","):
                seen = reasons.setdefault(check_id.strip().lower(), [])
                if reason and reason not in seen:
                    seen.append(reason)
    except (tokenize.TokenError, SyntaxError):
        return _NONE
    return MappingProxyType({k: "; ".join(v) for k, v in reasons.items()})
