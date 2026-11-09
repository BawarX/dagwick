from __future__ import annotations

import ast
from typing import Any

POKE = "poke"
RESCHEDULE = "reschedule"
DEFERRABLE = "deferrable"
UNKNOWN = object()


def sensor_task_ids(data: Any) -> tuple[str, ...] | None:
    try:
        tasks = data["dag"]["tasks"]
    except (KeyError, TypeError):
        return None
    found = []
    for task in tasks:
        body = task.get("__var", task) if isinstance(task, dict) else None
        if isinstance(body, dict) and body.get("_is_sensor") and body.get("task_id"):
            found.append(str(body["task_id"]))
    return tuple(sorted(found))


def _const(node: ast.AST | None) -> Any:
    return node.value if isinstance(node, ast.Constant) else UNKNOWN


def _kwargs(call: ast.Call) -> dict[str, Any]:
    return {k.arg: _const(k.value) for k in call.keywords if k.arg}


def _callee(func: ast.expr) -> str:
    if isinstance(func, ast.Name):
        return func.id
    if isinstance(func, ast.Attribute):
        return func.attr
    return ""


def _is_task_sensor(expr: ast.expr) -> bool:
    target = expr.func if isinstance(expr, ast.Call) else expr
    return (
        isinstance(target, ast.Attribute)
        and target.attr == "sensor"
        and isinstance(target.value, ast.Name)
        and target.value.id == "task"
    )


def _default_args(tree: ast.Module) -> dict[str, Any]:
    found: dict[str, Any] = {}
    for node in ast.walk(tree):
        value = None
        if (
            isinstance(node, ast.Assign)
            and any(isinstance(t, ast.Name) and t.id == "default_args" for t in node.targets)
            or isinstance(node, ast.keyword)
            and node.arg == "default_args"
        ):
            value = node.value
        if isinstance(value, ast.Dict):
            for key, item in zip(value.keys, value.values, strict=True):
                if _const(key) in ("mode", "deferrable"):
                    found[_const(key)] = _const(item)
    return found


def _mode(
    name: str, kwargs: dict[str, Any], defaults: dict[str, Any], default_deferrable: bool
) -> str | None:
    fallback = UNKNOWN if default_deferrable else False
    deferrable = kwargs.get("deferrable", defaults.get("deferrable", fallback))
    mode = kwargs.get("mode", defaults.get("mode", POKE))
    if name.endswith("Async") or deferrable is True:
        return DEFERRABLE
    if mode == RESCHEDULE:
        return RESCHEDULE
    if deferrable is UNKNOWN or mode is UNKNOWN:
        return None
    return POKE if mode == POKE else None


def sensor_modes(tree: ast.Module, default_deferrable: bool = False) -> dict[str, str | None]:
    defaults = _default_args(tree)
    modes: dict[str, str | None] = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            name = _callee(node.func)
            if name.endswith(("Sensor", "SensorAsync")):
                kwargs = _kwargs(node)
                task_id = kwargs.get("task_id")
                if isinstance(task_id, str):
                    modes[task_id] = _mode(name, kwargs, defaults, default_deferrable)
        elif isinstance(node, ast.FunctionDef | ast.AsyncFunctionDef):
            for deco in node.decorator_list:
                if _is_task_sensor(deco):
                    kwargs = _kwargs(deco) if isinstance(deco, ast.Call) else {}
                    task_id = kwargs.get("task_id") or node.name
                    if isinstance(task_id, str):
                        modes[task_id] = _mode("", kwargs, defaults, default_deferrable)
    return modes
