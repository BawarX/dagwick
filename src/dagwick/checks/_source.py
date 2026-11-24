from __future__ import annotations

import ast
import functools
import importlib
import importlib.util
import sys


@functools.lru_cache(maxsize=64)
def parse(source: str) -> ast.Module | None:
    try:
        return ast.parse(source)
    except (SyntaxError, ValueError):
        return None


DAG_MODULES = ("airflow.sdk", "airflow.decorators")


def _dag_decorator(tree: ast.Module):
    names: set[str] = set()
    modules: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module in DAG_MODULES:
            names.update(a.asname or a.name for a in node.names if a.name == "dag")
        elif isinstance(node, ast.ImportFrom) and node.module == "airflow":
            modules.update(
                a.asname or a.name for a in node.names if f"airflow.{a.name}" in DAG_MODULES
            )
        elif isinstance(node, ast.Import):
            modules.update(a.asname or a.name for a in node.names if a.name in DAG_MODULES)

    def is_dag(expr: ast.expr) -> bool:
        target = expr.func if isinstance(expr, ast.Call) else expr
        if isinstance(target, ast.Name):
            return target.id in names
        return (
            isinstance(target, ast.Attribute)
            and target.attr == "dag"
            and ast.unparse(target.value) in modules
        )

    return is_dag


class _ParseTimeCalls(ast.NodeVisitor):
    def __init__(self, match, runs_at_parse) -> None:
        self.match = match
        self.runs_at_parse = runs_at_parse
        self.depth = 0
        self.lines: list[int] = []

    def _deferred(self, body) -> None:
        self.depth += 1
        for stmt in body if isinstance(body, list) else [body]:
            self.visit(stmt)
        self.depth -= 1

    def _function(self, node: ast.FunctionDef | ast.AsyncFunctionDef) -> None:
        for expr in node.decorator_list:
            self.visit(expr)
        for expr in [*node.args.defaults, *node.args.kw_defaults]:
            if expr is not None:
                self.visit(expr)
        if any(self.runs_at_parse(expr) for expr in node.decorator_list):
            for stmt in node.body:
                self.visit(stmt)
        else:
            self._deferred(node.body)

    visit_FunctionDef = _function
    visit_AsyncFunctionDef = _function

    def visit_Lambda(self, node: ast.Lambda) -> None:
        for expr in [*node.args.defaults, *node.args.kw_defaults]:
            if expr is not None:
                self.visit(expr)
        self._deferred(node.body)

    def visit_Call(self, node: ast.Call) -> None:
        if self.depth == 0 and self.match(node.func):
            self.lines.append(node.lineno)
        self.generic_visit(node)


def _variable_names(tree: ast.Module) -> set[str]:
    names = {"Variable"}
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and (node.module or "").startswith("airflow"):
            names.update(a.asname for a in node.names if a.name == "Variable" and a.asname)
    return names


def variable_get_lines(tree: ast.Module) -> list[int]:
    names = _variable_names(tree)

    def is_variable_get(func: ast.expr) -> bool:
        if not (isinstance(func, ast.Attribute) and func.attr == "get"):
            return False
        owner = func.value
        return (isinstance(owner, ast.Name) and owner.id in names) or (
            isinstance(owner, ast.Attribute) and owner.attr == "Variable"
        )

    visitor = _ParseTimeCalls(is_variable_get, _dag_decorator(tree))
    visitor.visit(tree)
    return sorted(set(visitor.lines))


def lines_set_true(tree: ast.Module, names: frozenset[str]) -> list[tuple[int, str]]:
    """Where an argument or dict key in ``names`` is set to True: ``(line, name)``.

    Finds ``depends_on_past=True`` on a call and ``"depends_on_past": True`` in a dict,
    such as default_args.
    """
    found: set[tuple[int, str]] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.keyword):
            pairs = [(node.arg, node.value)]
        elif isinstance(node, ast.Dict):
            pairs = [
                (key.value, value)
                for key, value in zip(node.keys, node.values, strict=True)
                if isinstance(key, ast.Constant)
            ]
        else:
            continue
        for name, value in pairs:
            if name in names and isinstance(value, ast.Constant) and value.value is True:
                found.add((value.lineno, name))
    return sorted(found)


NEVER_IMPORT = ("airflow.providers.", "airflow.example_dags")


def _import_package(name: str) -> bool:
    parts = name.split(".")
    for i in range(1, len(parts) + 1):
        try:
            spec = importlib.util.find_spec(".".join(parts[:i]))
        except (ImportError, ValueError):
            return False
        if spec is None or spec.submodule_search_locations is None:
            return False
    importlib.import_module(name)
    return True


@functools.lru_cache(maxsize=256)
def airflow_redirects(module: str) -> dict[str, str]:
    if not module.startswith("airflow.") or module.startswith(NEVER_IMPORT):
        return {}
    mod = sys.modules.get(module)
    if mod is None:
        for candidate in (module, module.rpartition(".")[0]):
            try:
                if _import_package(candidate):
                    break
            except Exception:
                return {}
        mod = sys.modules.get(module)
    if mod is None:
        return {}
    hook = vars(mod).get("__getattr__")
    if not (
        isinstance(hook, functools.partial)
        and getattr(hook.func, "__name__", "") == "getattr_with_deprecation"
        and hook.args
        and isinstance(hook.args[0], dict)
    ):
        return {}
    real = vars(mod)
    return {name: target for name, target in hook.args[0].items() if name not in real}


def deprecated_imports(tree: ast.Module) -> list[tuple[int, str, str]]:
    found = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.ImportFrom) or node.level or not node.module:
            continue
        redirects = airflow_redirects(node.module)
        for alias in node.names:
            target = redirects.get(alias.name)
            if target:
                found.append((node.lineno, f"{node.module}.{alias.name}", target))
    return sorted(found)


# --- start_date that changes on every parse -------------------------------------

# Functions that read the clock, by the last part of their name (datetime.now,
# pendulum.today, timezone.utcnow, a days_ago helper), and two that need their module.
CLOCK_CALLS = frozenset({"now", "utcnow", "today", "yesterday", "tomorrow", "days_ago"})
CLOCK_FUNCTIONS = frozenset({"time.time", "time.localtime"})


def _dotted(func: ast.expr) -> str:
    """``datetime.now`` for a call to ``datetime.now``: at most the last three parts."""
    parts: list[str] = []
    while isinstance(func, ast.Attribute):
        parts.append(func.attr)
        func = func.value
    if isinstance(func, ast.Name):
        parts.append(func.id)
    return ".".join(reversed(parts[:3]))


def _reads_clock(node: ast.AST) -> str | None:
    """The function, like ``datetime.now``, when ``node`` calls one that reads the clock."""
    if not isinstance(node, ast.Call):
        return None
    name = _dotted(node.func)
    if name.rpartition(".")[2] in CLOCK_CALLS or name in CLOCK_FUNCTIONS:
        return name
    return None


def _assign_targets(node: ast.AST) -> list[ast.expr]:
    if isinstance(node, ast.Assign):
        return node.targets
    if isinstance(node, ast.AnnAssign) and node.value is not None:
        return [node.target]
    return []


def _assignments(tree: ast.Module) -> dict[str, list[tuple[int, ast.expr]]]:
    """The values assigned to each plain name, in line order."""
    found: dict[str, list[tuple[int, ast.expr]]] = {}
    for node in ast.walk(tree):
        for target in _assign_targets(node):
            if isinstance(target, ast.Name):
                found.setdefault(target.id, []).append((node.lineno, node.value))
    for values in found.values():
        values.sort(key=lambda item: item[0])
    return found


def _value_of(assigned: dict[str, list[tuple[int, ast.expr]]], name: ast.Name) -> ast.expr | None:
    """What ``name`` was last set to before it is used, or its first value if set later."""
    values = assigned.get(name.id)
    if not values:
        return None
    before = [value for line, value in values if line < name.lineno]
    return before[-1] if before else values[0][1]


def _clock_read(
    expr: ast.expr, assigned: dict[str, list[tuple[int, ast.expr]]]
) -> tuple[ast.expr, ast.Call] | None:
    """Where ``expr`` reads the clock, directly or through variables.

    Returns the node in ``expr`` (the call itself, or the variable it goes through) and
    the clock call. Iterative, and each assigned value is followed once.
    """
    followed: set[int] = set()
    stack: list[tuple[ast.expr, ast.Name | None]] = [(expr, None)]
    while stack:
        current, via = stack.pop()
        for node in ast.walk(current):
            if _reads_clock(node):
                return (via or node), node
            if isinstance(node, ast.Name):
                value = _value_of(assigned, node)
                if value is not None and id(value) not in followed:
                    followed.add(id(value))
                    stack.append((value, via or node))
    return None


def _default_args_start_dates(
    expr: ast.expr, assigned: dict[str, list[tuple[int, ast.expr]]], followed: set[int]
) -> list[ast.expr]:
    """The start_date values a default_args expression sets.

    Follows dict literals, ``{**base}``, ``base | {...}``, ``dict(...)`` and variables.
    """
    found: list[ast.expr] = []
    stack = [expr]
    while stack:
        node = stack.pop()
        if id(node) in followed:
            continue
        followed.add(id(node))
        if isinstance(node, ast.Dict):
            for key, value in zip(node.keys, node.values, strict=True):
                if key is None:
                    stack.append(value)
                elif isinstance(key, ast.Constant) and key.value == "start_date":
                    found.append(value)
        elif isinstance(node, ast.BinOp) and isinstance(node.op, ast.BitOr):
            stack += [node.left, node.right]
        elif isinstance(node, ast.Call) and _dotted(node.func) == "dict":
            found += [k.value for k in node.keywords if k.arg == "start_date"]
            stack += [*node.args, *(k.value for k in node.keywords if k.arg is None)]
        elif isinstance(node, ast.Name) and (value := _value_of(assigned, node)) is not None:
            stack.append(value)
    return found


class _StartDateCalls(_ParseTimeCalls):
    """Calls that pass start_date=, and whether each one runs when the file is parsed."""

    def __init__(self, runs_at_parse) -> None:
        super().__init__(lambda func: False, runs_at_parse)
        self.found: list[tuple[ast.Call, bool]] = []

    def visit_Call(self, node: ast.Call) -> None:
        if any(keyword.arg == "start_date" for keyword in node.keywords):
            self.found.append((node, self.depth == 0))
        self.generic_visit(node)


def _builds_dag_or_task(call: ast.Call, is_dag) -> bool:
    """DAG(...), a DAG subclass, @dag(...), or a task (it has a task_id=)."""
    if is_dag(call) or any(keyword.arg == "task_id" for keyword in call.keywords):
        return True
    func = call.func
    name = func.id if isinstance(func, ast.Name) else getattr(func, "attr", "")
    return name.endswith(("DAG", "Dag"))


def _start_date_values(
    tree: ast.Module, assigned: dict[str, list[tuple[int, ast.expr]]]
) -> list[ast.expr]:
    """Every value given to a DAG's or task's start_date, directly or in default_args.

    Calls that build a DAG or a task count wherever they are (DAG factories build them
    inside functions); other calls only when they run at parse time, so a start_date=
    passed to an API inside a task's code is left alone.
    """
    is_dag = _dag_decorator(tree)
    calls = _StartDateCalls(is_dag)
    calls.visit(tree)
    values = [
        keyword.value
        for call, at_parse_time in calls.found
        if at_parse_time or _builds_dag_or_task(call, is_dag)
        for keyword in call.keywords
        if keyword.arg == "start_date"
    ]
    passed = {
        node.value.id
        for node in ast.walk(tree)
        if isinstance(node, ast.keyword)
        and node.arg == "default_args"
        and isinstance(node.value, ast.Name)
    }
    followed: set[int] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.keyword) and node.arg == "default_args":
            values += _default_args_start_dates(node.value, assigned, followed)
        for target in _assign_targets(node):
            if isinstance(target, ast.Name) and "default_args" in target.id.lower():
                values += _default_args_start_dates(node.value, assigned, followed)
            elif (  # default_args["start_date"] = ...
                isinstance(target, ast.Subscript)
                and isinstance(target.value, ast.Name)
                and ("default_args" in target.value.id.lower() or target.value.id in passed)
                and isinstance(target.slice, ast.Constant)
                and target.slice.value == "start_date"
            ):
                values.append(node.value)
    return values


def moving_start_dates(tree: ast.Module) -> list[tuple[int, str]]:
    """start_date values that read the clock, so they change on every parse.

    Each is ``(line, what)``: ``(12, "datetime.now()")``, or for a variable
    ``(20, "START (datetime.now() on line 5)")``.
    """
    assigned = _assignments(tree)
    checked: set[int] = set()
    found: set[tuple[int, str]] = set()
    for value in _start_date_values(tree, assigned):
        if id(value) in checked:
            continue
        checked.add(id(value))
        read = _clock_read(value, assigned)
        if read is None:
            continue
        site, call = read
        clock = f"{_reads_clock(call)}()"
        if isinstance(site, ast.Name):
            found.add((site.lineno, f"{site.id} ({clock} on line {call.lineno})"))
        else:
            found.add((call.lineno, clock))
    return sorted(found)
