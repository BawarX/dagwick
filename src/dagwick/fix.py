"""Automatic fixes for DAG files: ``dagwick fix``.

A fixer reads a DAG file's source with ``ast`` and returns text edits. It never
imports or runs the DAG file. Fixes keep the rest of the file as it was:
formatting, comments and line endings.

- **Safe** fixes have one right answer and don't change what the DAG does (for
  example a deprecated import moved to its new path). ``dagwick fix --write``
  applies them.
- **Unsafe** fixes change behaviour (for example adding retries). They are only
  applied with ``--unsafe-fixes``.

A fixer skips a check the file acknowledges with ``# dagwick: ack``, and every
fixer is idempotent: running ``dagwick fix`` twice changes nothing the second time.
"""

from __future__ import annotations

import ast
import io
from collections.abc import Callable
from dataclasses import dataclass, field

from dagwick.acknowledge import acknowledgements
from dagwick.checks._source import airflow_redirects


@dataclass(frozen=True)
class Edit:
    """Replace ``text[start:end]`` with ``new`` (character offsets)."""

    start: int
    end: int
    new: str


@dataclass(frozen=True)
class Fix:
    check_id: str
    line: int
    message: str
    edits: tuple[Edit, ...]
    safe: bool = True


@dataclass(frozen=True)
class Fixer:
    check_id: str
    safe: bool
    find: Callable[[Source], list[Fix]] = field(repr=False)


class Source:
    """A DAG file's text and syntax tree, with ast positions mapped to offsets."""

    def __init__(self, text: str) -> None:
        self.text = text
        self.tree = ast.parse(text)
        # Split like the tokenizer does (\n, \r\n and \r), keeping the endings.
        self.lines = io.StringIO(text, newline="").readlines()
        self.starts = [0]
        for line in self.lines:
            self.starts.append(self.starts[-1] + len(line))
        first = self.lines[0] if self.lines else "\n"
        self.newline = "\r\n" if first.endswith("\r\n") else "\r" if first.endswith("\r") else "\n"

    def line(self, lineno: int) -> str:
        return self.lines[lineno - 1] if 0 < lineno <= len(self.lines) else ""

    def offset(self, lineno: int, col_bytes: int) -> int:
        """Character offset of an ast position (ast columns count UTF-8 bytes)."""
        line = self.line(lineno)
        col = len(line.encode("utf-8")[:col_bytes].decode("utf-8", errors="ignore"))
        return self.starts[lineno - 1] + col

    def start(self, node: ast.AST) -> int:
        return self.offset(node.lineno, node.col_offset)

    def end(self, node: ast.AST) -> int:
        return self.offset(node.end_lineno, node.end_col_offset)

    def line_end(self, lineno: int) -> int:
        """Offset just after the line's ending (the start of the next line)."""
        return self.starts[lineno] if lineno < len(self.starts) else len(self.text)


# --- current_imports (safe): deprecated Airflow import paths -------------------


def _alias(new_name: str, old: ast.alias) -> str:
    if old.asname:
        return f"{new_name} as {old.asname}"
    return new_name if new_name == old.name else f"{new_name} as {old.name}"


def _starts_line(src: Source, node: ast.AST) -> bool:
    """Only whitespace comes before ``node`` on its first line."""
    return not src.text[src.starts[node.lineno - 1] : src.start(node)].strip()


def _indent(src: Source, lineno: int) -> str:
    line = src.line(lineno)
    return line[: len(line) - len(line.lstrip())]


MAX_LINE = 100


def _import(module: str, names: list[str], indent: str, newline: str, multiline: bool) -> str:
    """``from module import ...``, one name per line if the original was, or it's too long."""
    one_line = f"from {module} import {', '.join(names)}"
    if not multiline and len(indent) + len(one_line) <= MAX_LINE:
        return one_line
    body = "".join(f"{newline}{indent}    {name}," for name in names)
    return f"from {module} import ({body}{newline}{indent})"


def _alone_on_its_lines(src: Source, node: ast.stmt) -> bool:
    """The statement starts its line, and only a comment may follow it."""
    after = src.text[src.end(node) : src.line_end(node.end_lineno)].strip()
    return _starts_line(src, node) and (not after or after.startswith("#"))


def _fix_imports(src: Source) -> list[Fix]:
    fixes = []
    for node in ast.walk(src.tree):
        if not isinstance(node, ast.ImportFrom) or node.level or not node.module:
            continue
        redirects = airflow_redirects(node.module)
        if not any(a.name in redirects for a in node.names):
            continue
        span = src.text[src.start(node) : src.end(node)]
        if "#" in span or not _alone_on_its_lines(src, node):
            continue  # a comment inside the import, or other code on its lines: leave it
        groups: dict[str, list[str]] = {}
        moved = []
        for alias in node.names:
            target = redirects.get(alias.name)
            if target:
                module, _, name = target.rpartition(".")
                groups.setdefault(module, []).append(_alias(name, alias))
                moved.append(f"{alias.name} → {module}")
            else:
                groups.setdefault(node.module, []).append(_alias(alias.name, alias))
        indent = _indent(src, node.lineno)
        multiline = node.end_lineno > node.lineno
        statements = [
            _import(module, names, indent, src.newline, multiline)
            for module, names in groups.items()
        ]
        new = (src.newline + indent).join(statements)
        fixes.append(
            Fix(
                "current_imports",
                node.lineno,
                f"import from the current path: {', '.join(moved)}",
                (Edit(src.start(node), src.end(node), new),),
            )
        )
    return fixes


# --- retries (unsafe): add retries to default_args ----------------------------

RETRIES = 2


def _sets_retries(tree: ast.Module) -> bool:
    """The file already sets retries somewhere: a keyword or a dict key."""
    for node in ast.walk(tree):
        if isinstance(node, ast.keyword) and node.arg == "retries":
            return True
        if isinstance(node, ast.Dict) and any(
            isinstance(k, ast.Constant) and k.value == "retries" for k in node.keys
        ):
            return True
        if isinstance(node, ast.Call) and any(k.arg is None for k in node.keywords):
            return True  # **kwargs could set retries: don't guess
    return False


def _default_args_dicts(tree: ast.Module) -> list[ast.Dict]:
    found = []
    for node in ast.walk(tree):
        if isinstance(node, ast.keyword) and node.arg == "default_args":
            value = node.value
        elif isinstance(node, (ast.Assign, ast.AnnAssign)):
            targets = node.targets if isinstance(node, ast.Assign) else [node.target]
            if not any(isinstance(t, ast.Name) and t.id == "default_args" for t in targets):
                continue
            value = node.value
        else:
            continue
        if isinstance(value, ast.Dict) and None not in value.keys:
            found.append(value)
    return found


def _quote(src: Source, d: ast.Dict) -> str:
    """The quote character the dict's string keys use (skipping prefixes like r or u)."""
    for key in d.keys:
        if isinstance(key, ast.Constant) and isinstance(key.value, str):
            for char in src.text[src.start(key) : src.end(key)]:
                if char in "'\"":
                    return char
    return '"'


def _add_retries(src: Source, d: ast.Dict) -> tuple[Edit, ...]:
    q = _quote(src, d)
    entry = f"{q}retries{q}: {RETRIES}"
    if not d.keys:
        return (Edit(src.start(d), src.end(d), "{" + entry + "}"),)
    last_key, last = d.keys[-1], d.values[-1]
    after_last = src.end(last)
    line_end = src.line_end(last.end_lineno)
    rest = src.text[after_last:line_end].strip()  # e.g. "", ",", ",  # note", "}"
    comma = rest.startswith(",")
    tail = rest[1:].strip() if comma else rest
    one_per_line = (
        d.end_lineno > last.end_lineno  # the closing brace is on a later line
        and (not tail or tail.startswith("#"))
        and _starts_line(src, last_key)
    )
    if not one_per_line:
        return (Edit(after_last, after_last, f", {entry}"),)
    # One entry per line: add a line after the last entry, in the same style.
    indent = _indent(src, last_key.lineno)
    new_line = Edit(line_end, line_end, f"{indent}{entry}{',' if comma else ''}{src.newline}")
    if comma:
        return (new_line,)
    return (Edit(after_last, after_last, ","), new_line)


def _fix_retries(src: Source) -> list[Fix]:
    if _sets_retries(src.tree):
        return []
    return [
        Fix(
            "retries",
            d.lineno,
            f"add retries={RETRIES} to default_args (only safe if the tasks are idempotent)",
            _add_retries(src, d),
            safe=False,
        )
        for d in _default_args_dicts(src.tree)
    ]


FIXERS: dict[str, Fixer] = {
    "current_imports": Fixer("current_imports", True, _fix_imports),
    "retries": Fixer("retries", False, _fix_retries),
}


@dataclass
class Result:
    text: str  # the fixed text (unchanged if nothing applied)
    applied: list[Fix]
    unsafe_skipped: list[Fix]  # unsafe fixes left out because --unsafe-fixes was not given


def fix_source(text: str, *, unsafe: bool = False) -> Result:
    """Fix ``text``. Raises ``SyntaxError`` (or ``ValueError``) if it doesn't parse."""
    src = Source(text)
    acks = acknowledgements(text)
    found: list[Fix] = []
    for fixer in FIXERS.values():
        if acks.get(fixer.check_id):
            continue  # broken on purpose, with a reason: leave it
        found.extend(fixer.find(src))
    applied = [f for f in found if f.safe or unsafe]
    skipped = [f for f in found if not (f.safe or unsafe)]
    return Result(apply_edits(text, applied), applied, skipped)


def apply_edits(text: str, fixes: list[Fix]) -> str:
    """Apply the fixes' edits from the end of the file backwards; overlapping ones are dropped."""
    edits = sorted((e for f in fixes for e in f.edits), key=lambda e: e.start, reverse=True)
    out = text
    floor = len(text) + 1
    for edit in edits:
        if edit.end > floor:
            continue
        out = out[: edit.start] + edit.new + out[edit.end :]
        floor = edit.start
    return out
