from __future__ import annotations

from typing import Any, ClassVar

from airflow.plugins_manager import AirflowPlugin

from dagwick.api import app
from dagwick.themes import ThemeMiddleware

BRAND = "Dagwick"
PREFIX = "/dagwick"
BUNDLE = f"{PREFIX}/static/dagwick.js"


class DagwickPlugin(AirflowPlugin):
    name = "dagwick"

    fastapi_apps: ClassVar[list[dict[str, Any]]] = [
        {"app": app, "url_prefix": PREFIX, "name": BRAND},
    ]

    # Adds the seasonal theme (for example Christmas snow) to Airflow's UI config reply.
    fastapi_root_middlewares: ClassVar[list[dict[str, Any]]] = [
        {"middleware": ThemeMiddleware, "name": "dagwick-themes"},
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
            # Outline icons in Airflow's own sidebar style and colours, one per mode.
            "icon": f"{PREFIX}/static/icon.svg",
            "icon_dark_mode": f"{PREFIX}/static/icon-dark.svg",
        },
    ]
