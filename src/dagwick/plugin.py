from __future__ import annotations

from typing import Any, ClassVar

from airflow.plugins_manager import AirflowPlugin

from dagwick.api import app

BRAND = "Dagwick"
PREFIX = "/dagwick"
BUNDLE = f"{PREFIX}/static/dagwick.js"


class DagwickPlugin(AirflowPlugin):
    name = "dagwick"

    fastapi_apps: ClassVar[list[dict[str, Any]]] = [
        {"app": app, "url_prefix": PREFIX, "name": BRAND},
    ]

    react_apps: ClassVar[list[dict[str, Any]]] = [
        # Tab on every DAG page.
        {"name": BRAND, "bundle_url": BUNDLE, "destination": "dag", "url_route": "dagwick"},
        # Fleet overview in the left sidebar.
        {
            "name": BRAND,  # short: the sidebar truncates long labels
            "bundle_url": BUNDLE,
            "destination": "nav",
            "url_route": "dagwick-fleet",
            "nav_top_level": True,
            "icon": f"{PREFIX}/static/icon.svg",
        },
    ]
