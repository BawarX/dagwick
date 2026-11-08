from __future__ import annotations

from typing import Any

from dagwick.core import Category, Finding, Status, check

DEFAULT_OWNERS = {"", "airflow"}


@check(
    id="owner",
    title="Has a real owner",
    category=Category.OWNERSHIP,
    weight=8,
    example='default_args={"owner": "data-team"}',
    fix="Set owner in default_args to the responsible team (e.g. 'data-team').",
)
def owner(dag: Any) -> Finding:
    owners = {o.strip().lower() for o in (getattr(dag, "owner", "") or "").split(",")}
    if owners - DEFAULT_OWNERS:
        return Finding(Status.PASS, "An owner is set.")
    return Finding(Status.FAIL, "Owner is the default 'airflow'; nobody is accountable.")


@check(
    id="tags",
    title="Tagged",
    category=Category.OWNERSHIP,
    weight=5,
    example='DAG(..., tags=["sales", "ingest"])',
    fix="Add tags (domain, layer) so the DAG is easy to find and filter.",
)
def tags(dag: Any) -> Finding:
    found = sorted(getattr(dag, "tags", None) or [])
    if found:
        return Finding(Status.PASS, f"Tags: {', '.join(found)}.")
    return Finding(Status.FAIL, "No tags.")


@check(
    id="docs",
    title="Documented",
    category=Category.OWNERSHIP,
    weight=8,
    example="DAG(..., doc_md=__doc__)  # reuse the module docstring",
    fix="Add doc_md explaining what the DAG loads, from where, and who to call.",
)
def docs(dag: Any) -> Finding:
    if str(getattr(dag, "doc_md", None) or "").strip():
        return Finding(Status.PASS, "doc_md is present.")
    if str(getattr(dag, "description", None) or "").strip():
        return Finding(Status.WARN, "Only a one-line description; no doc_md.")
    return Finding(Status.FAIL, "No documentation.")
