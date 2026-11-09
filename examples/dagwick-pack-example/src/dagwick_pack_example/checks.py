"""Checks in this pack. Dagwick imports this module through the entry point."""

from __future__ import annotations

from dagwick import Category, Finding, Status, check

TEAM_PREFIX = "team:"


@check(
    id="example_team_tag",
    title="Has a team tag",
    category=Category.OWNERSHIP,
    weight=5,
    fix=f"Add a tag that names the owning team, like '{TEAM_PREFIX}data'.",
    example=f'DAG(..., tags=["{TEAM_PREFIX}data", "finance"])',
    ack_hint="which team owns the DAG instead",
)
def team_tag(dag):
    tags = sorted(dag.tags or ())
    teams = [t for t in tags if t.startswith(TEAM_PREFIX) and len(t) > len(TEAM_PREFIX)]
    if len(teams) == 1:
        return Finding(Status.PASS, f"Owned by {teams[0][len(TEAM_PREFIX) :]}.")
    if teams:
        return Finding(Status.WARN, "More than one team tag.", tuple(teams))
    return Finding(Status.FAIL, "No team tag.")
