from __future__ import annotations

from typing import Any

from dagwick.checks._secrets import find_secrets
from dagwick.checks._source import parse
from dagwick.core import Category, Context, Finding, Status, check


@check(
    id="hardcoded_secrets",
    title="No secrets in the DAG file",
    category=Category.SECURITY,
    weight=10,
    example=(
        'conn = BaseHook.get_connection("warehouse")  # inside the task\n'
        'bash_command="load.sh {{ conn.warehouse.password }}"'
    ),
    fix=(
        "Move the credential into an Airflow Connection or a secrets backend and read it "
        "when the task runs. Treat the value as leaked: it is in the DAG file, its history "
        "and Airflow's database, so rotate it."
    ),
)
def hardcoded_secrets(dag: Any, context: Context) -> Finding:
    tree = parse(context.source) if context.source else None
    if tree is None:
        return Finding(Status.SKIP, "The DAG's source code is not available.")
    found = find_secrets(tree)
    if not found:
        return Finding(Status.PASS, "No credentials found in the DAG file.")
    noun = "credential" if len(found) == 1 else "credentials"
    return Finding(
        Status.FAIL,
        f"{len(found)} likely {noun} written into the DAG file. The values are not shown here.",
        tuple(f"line {line}: {kind}" for line, kind in found),
    )
