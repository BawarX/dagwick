"""Every `dagwick` command and pre-commit hook shown in the docs must be valid."""

from __future__ import annotations

import re
import shlex
from pathlib import Path

import pytest

from dagwick.cli import build_parser

ROOT = Path(__file__).resolve().parent.parent
DOCS = [ROOT / "README.md", ROOT / "docs" / "linting.md", ROOT / "docs" / "checks.md"]
HOOKS = ROOT / ".pre-commit-hooks.yaml"


def _shell_blocks(text: str) -> list[str]:
    return re.findall(r"```(?:bash|sh|yaml)\n(.*?)```", text, flags=re.DOTALL)


def documented_commands() -> list[tuple[str, str]]:
    found = []
    for doc in DOCS:
        for block in _shell_blocks(doc.read_text(encoding="utf-8")):
            for line in block.splitlines():
                line = line.strip()
                if line.startswith("run: dagwick "):
                    line = line.removeprefix("run: ")
                if line.startswith("dagwick "):
                    found.append((doc.name, line))
    return found


def hooks() -> dict[str, list[str]]:
    """id -> the command line pre-commit runs (entry + args), read without a YAML parser."""
    found: dict[str, list[str]] = {}
    for entry in HOOKS.read_text(encoding="utf-8").split("- id: ")[1:]:
        hook_id, _, body = entry.partition("\n")
        command = shlex.split(re.search(r"^\s*entry: (.+)$", body, re.MULTILINE).group(1))
        args = re.search(r"^\s*args: \[(.*)\]$", body, re.MULTILINE)
        if args:
            command += [a.strip() for a in args.group(1).split(",")]
        found[hook_id.strip()] = command
    return found


def test_the_docs_show_commands():
    names = {doc for doc, _ in documented_commands()}
    assert {"README.md", "linting.md"} <= names


@pytest.mark.parametrize(("doc", "line"), documented_commands())
def test_documented_command_is_valid(doc, line):
    argv = shlex.split(line, comments=True)
    build_parser().parse_args(argv[1:])  # argparse exits on an invalid command line


@pytest.mark.parametrize(("hook_id", "command"), hooks().items())
def test_pre_commit_hook_is_valid(hook_id, command):
    assert command[0] == "dagwick"
    build_parser().parse_args([*command[1:], "dag.py"])  # pre-commit appends the files


def test_documented_hooks_exist():
    ids = set(hooks())
    for doc in DOCS:
        for block in _shell_blocks(doc.read_text(encoding="utf-8")):
            for hook_id in re.findall(r"- id: ([\w-]+)", block):
                assert hook_id in ids, f"{doc.name} shows a hook that doesn't exist: {hook_id}"
