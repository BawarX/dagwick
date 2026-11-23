from __future__ import annotations

import argparse
import contextlib
import difflib
import importlib.util
import json
import os
import sys
from collections import Counter
from collections.abc import Sequence
from pathlib import Path
from typing import Any, TextIO

from dagwick import __version__
from dagwick.core import Context, score_dag

GRADES = ("A", "B", "C", "D", "F")
ICON = {"fail": "x", "warn": "!"}

OK, BELOW_GRADE, LOAD_ERROR = 0, 1, 2
USAGE_ERROR = 2  # same code argparse uses for a bad command line

DISPUTE_URL = "https://github.com/dagwick/dagwick/issues/new?template=dispute.yml"
DISPUTE_HINT = f"Disagree with a check or hit a false positive? Tell us: {DISPUTE_URL}"


def _dagbag(path: Path) -> Any:
    try:
        from airflow.dag_processing.dagbag import DagBag
    except ImportError:
        from airflow.models.dagbag import DagBag
    try:
        return DagBag(dag_folder=str(path), include_examples=False)
    except TypeError:
        return DagBag(dag_folder=str(path))


def _serialization() -> Any:
    try:
        from airflow.serialization.serialized_objects import DagSerialization
    except ImportError:
        from airflow.serialization.serialized_objects import SerializedDAG as DagSerialization
    return DagSerialization


def _stat_path(root: Path, stat_file: str) -> str:
    if root.is_file():
        return str(root.resolve())
    file = Path(stat_file)
    return str((file if file.is_absolute() else root / file).resolve())


def load(paths: Sequence[Path]) -> tuple[list[tuple[Any, dict[str, Any]]], dict[str, str]]:
    from dagwick.checks._sensors import sensor_task_ids

    serialization = _serialization()
    found: list[tuple[Any, str, float | None]] = []
    errors: dict[str, str] = {}
    for path in paths:
        bag = _dagbag(path)
        errors.update(bag.import_errors)
        seconds = {
            _stat_path(path, stat.file): stat.duration.total_seconds() for stat in bag.dagbag_stats
        }
        for dag in bag.dags.values():
            fileloc = str(dag.fileloc)
            found.append((dag, fileloc, seconds.get(str(Path(fileloc).resolve()))))
    per_file = Counter(fileloc for _, fileloc, _ in found)
    sources: dict[str, str | None] = {}
    scored = []
    for dag, fileloc, parse in found:
        if fileloc not in sources:
            try:
                sources[fileloc] = Path(fileloc).read_text(encoding="utf-8")
            except OSError:
                sources[fileloc] = None
        data = serialization.to_dict(dag)
        context = Context(
            dags_in_file=per_file[fileloc],
            source=sources[fileloc],
            parse_seconds=parse,
            sensor_tasks=sensor_task_ids(data),
        )
        report = score_dag(serialization.from_dict(data), context)
        scored.append((dag, {**report, "file": fileloc}))
    return scored, errors


def below(grade: str, minimum: str | None) -> bool:
    return minimum is not None and GRADES.index(grade) > GRADES.index(minimum)


def render(
    reports: list[dict[str, Any]], errors: dict[str, str], minimum: str | None, out: TextIO
) -> None:
    for file, error in sorted(errors.items()):
        last = error.strip().splitlines()[-1] if error.strip() else "import error"
        print(f"ERROR  {file}\n       {last}", file=out)
    for r in sorted(reports, key=lambda r: (r["score"], r["dag_id"])):
        flag = "  <- below " + minimum if below(r["grade"], minimum) else ""
        print(f"{r['grade']}  {r['score']:5.1f}  {r['dag_id']}  ({r['file']}){flag}", file=out)
        for c in r["checks"]:
            if c["status"] in ICON:
                hint = fixable_hint(c["id"])
                print(f"       {ICON[c['status']]} {c['title']}: {c['fix']}{hint}", file=out)
                for item in c["items"][:5]:
                    print(f"           {item}", file=out)
    failing = sum(below(r["grade"], minimum) for r in reports)
    summary = f"{len(reports)} DAG{'s' if len(reports) != 1 else ''} checked"
    if minimum:
        summary += f", {failing} below grade {minimum}"
    if errors:
        summary += f", {len(errors)} file{'s' if len(errors) != 1 else ''} failed to load"
    print(summary, file=out)


def fixable_hint(check_id: str) -> str:
    """Tell the reader when `dagwick fix` can fix a check."""
    from dagwick.fix import FIXERS

    fixer = FIXERS.get(check_id)
    if fixer is None:
        return ""
    return " [dagwick fix]" if fixer.safe else " [dagwick fix --unsafe-fixes]"


def python_files(paths: Sequence[Path]) -> list[Path]:
    """The .py files in ``paths``, skipping hidden folders and __pycache__."""
    found: list[Path] = []
    for path in paths:
        if path.is_file():
            found.append(path)
            continue
        for file in sorted(path.rglob("*.py")):
            parts = file.relative_to(path).parts
            if not any(p.startswith(".") or p == "__pycache__" for p in parts):
                found.append(file)
    return found


def _plural(n: int, word: str) -> str:
    return f"{n} {word}{'' if n == 1 else 's'}"


def _fix(paths: Sequence[Path], write: bool, unsafe: bool, out: TextIO, err: TextIO) -> int:
    from dagwick.fix import fix_source

    if importlib.util.find_spec("airflow") is None:
        print(
            "dagwick: Airflow is not installed here, so deprecated imports can't be fixed "
            "(Dagwick reads the new paths from Airflow itself).",
            file=err,
        )
    fixed = files = skipped = 0
    failed = False
    for path in python_files(paths):
        try:
            with path.open(encoding="utf-8", newline="") as f:
                text = f.read()
            result = fix_source(text, unsafe=unsafe)
        except (OSError, UnicodeDecodeError, SyntaxError, ValueError) as exc:
            print(f"dagwick: can't fix {path}: {type(exc).__name__}: {exc}", file=err)
            failed = True
            continue
        for f in result.applied:
            print(f"{path}:{f.line}: {f.check_id}: {f.message}", file=out)
        for f in result.unsafe_skipped:
            print(f"{path}:{f.line}: {f.check_id}: {f.message} [--unsafe-fixes]", file=out)
        skipped += len(result.unsafe_skipped)
        if not result.applied:
            continue
        fixed += len(result.applied)
        files += 1
        if write:
            with path.open("w", encoding="utf-8", newline="") as f:
                f.write(result.text)
        else:
            diff = difflib.unified_diff(
                text.splitlines(keepends=True),
                result.text.splitlines(keepends=True),
                f"a/{path}",
                f"b/{path}",
            )
            out.writelines(diff)
    problems = _plural(fixed, "problem")
    if write:
        print(f"Fixed {problems} in {_plural(files, 'file')}.", file=out)
    elif fixed:
        print(
            f"Would fix {problems} in {_plural(files, 'file')}. "
            "Run with --write to apply the changes.",
            file=out,
        )
    else:
        print("Nothing to fix.", file=out)
    if skipped:
        more = "1 more fix" if skipped == 1 else f"{skipped} more fixes"
        print(
            f"{more} with --unsafe-fixes. They change what the DAG does, so review each one.",
            file=out,
        )
    if failed:
        return LOAD_ERROR
    return BELOW_GRADE if fixed and not write else OK


def flagged(reports: list[dict[str, Any]]) -> bool:
    """Whether any built-in check failed or warned, so a dispute could make sense."""
    return any(
        c["status"] in ICON and c.get("pack", "dagwick") == "dagwick"
        for r in reports
        for c in r["checks"]
    )


def _explain(check_id: str | None, out: TextIO, err: TextIO) -> int:
    from dagwick.core import registered_checks
    from dagwick.explain import explain_text, list_text

    specs = {s.id: s for s in registered_checks()}
    if check_id is None:
        out.write(list_text(specs.values()))
        return OK
    spec = specs.get(check_id.strip().lower())
    if spec is None:
        close = difflib.get_close_matches(check_id, specs, n=3)
        hint = f" Did you mean: {', '.join(close)}?" if close else ""
        print(f"dagwick: unknown check {check_id!r}.{hint}", file=err)
        print("Run `dagwick explain` to list every check.", file=err)
        return USAGE_ERROR
    out.write(explain_text(spec))
    return OK


def main(
    argv: Sequence[str] | None = None, out: TextIO = sys.stdout, err: TextIO = sys.stderr
) -> int:
    parser = argparse.ArgumentParser(
        prog="dagwick", description="Grade Airflow DAGs and explain the checks."
    )
    parser.add_argument("--version", action="version", version=f"dagwick {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)
    check = sub.add_parser(
        "check",
        help="score the DAGs in files or folders",
        description=(
            "Score the DAGs in the given files or folders with the same checks as the "
            "Airflow UI. The DAG files are imported, so their top-level code runs."
        ),
    )
    check.add_argument("paths", nargs="+", type=Path, help="DAG files or folders")
    check.add_argument(
        "--min-grade",
        choices=GRADES,
        type=str.upper,
        help="exit with status 1 if any DAG scores below this grade",
    )
    check.add_argument("--json", action="store_true", help="print the reports as JSON")
    explain = sub.add_parser(
        "explain",
        help="explain why a check exists and how to fix it",
        description=(
            "Explain a check: why it matters, bad and good code, how to fix it and when "
            "it is fine to acknowledge. Without a check id, list every check. "
            "Does not need Airflow."
        ),
    )
    explain.add_argument("check_id", nargs="?", help="the check to explain, e.g. retries")
    fix = sub.add_parser(
        "fix",
        help="fix what can be fixed automatically",
        description=(
            "Fix problems in DAG files automatically. Shows a diff and exits with status 1 "
            "if there is something to fix; --write changes the files. The DAG files are "
            "only read, never imported or run."
        ),
    )
    fix.add_argument("paths", nargs="+", type=Path, help="DAG files or folders")
    fix.add_argument("--write", action="store_true", help="change the files")
    fix.add_argument(
        "--unsafe-fixes",
        action="store_true",
        help="also apply fixes that change what the DAG does (for example adding retries)",
    )
    args = parser.parse_args(argv)

    if args.command == "explain":
        return _explain(args.check_id, out, err)

    missing = [str(p) for p in args.paths if not p.exists()]
    if missing:
        parser.error(f"no such file or folder: {', '.join(missing)}")

    if args.command == "fix":
        return _fix(args.paths, args.write, args.unsafe_fixes, out, err)

    os.environ.setdefault("AIRFLOW__CORE__LOAD_EXAMPLES", "False")
    with contextlib.redirect_stdout(sys.stderr):
        scored, errors = load(args.paths)
    reports = [report for _, report in scored]
    if args.json:
        json.dump({"dags": reports, "import_errors": errors}, out, indent=2, default=str)
        out.write("\n")
    else:
        render(reports, errors, args.min_grade, out)
        if flagged(reports):
            print(DISPUTE_HINT, file=err)
    if errors:
        return LOAD_ERROR
    if any(below(r["grade"], args.min_grade) for r in reports):
        return BELOW_GRADE
    return OK


if __name__ == "__main__":
    sys.exit(main())
