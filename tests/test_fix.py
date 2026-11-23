"""dagwick fix: automatic fixes for DAG files, without importing them."""

from __future__ import annotations

import io
from textwrap import dedent

import pytest

from dagwick import cli
from dagwick.cli import BELOW_GRADE, LOAD_ERROR, OK, fixable_hint, main, python_files
from dagwick.fix import FIXERS, Edit, Fix, apply_edits, fix_source


def fixed(text: str, unsafe: bool = True) -> str:
    return fix_source(dedent(text), unsafe=unsafe).text


def run(*args):
    out, err = io.StringIO(), io.StringIO()
    code = main(list(args), out=out, err=err)
    return code, out.getvalue(), err.getvalue()


# --- current_imports (safe) --------------------------------------------------


def test_import_moves_to_the_current_path():
    assert fixed("from airflow.operators.bash import BashOperator\n") == (
        "from airflow.providers.standard.operators.bash import BashOperator\n"
    )


def test_import_with_moved_and_unmoved_names_is_split():
    out = fixed("from airflow.decorators import dag, task\n")
    assert out == "from airflow.sdk import dag, task\n"
    out = fixed("from airflow.operators.python import PythonOperator, get_current_context\n")
    assert out == (
        "from airflow.providers.standard.operators.python import PythonOperator\n"
        "from airflow.sdk import get_current_context\n"
    )


def test_import_keeps_aliases_and_the_trailing_comment():
    out = fixed("from airflow.operators.bash import BashOperator as Bash  # ops\n")
    new = "airflow.providers.standard.operators.bash"
    assert out == f"from {new} import BashOperator as Bash  # ops\n"


def test_multiline_import_stays_multiline_and_indented():
    source = """\
    if True:
        from airflow.operators.python import (
            PythonOperator,
            BranchPythonOperator,
        )
    """
    assert fixed(source) == dedent(
        """\
        if True:
            from airflow.providers.standard.operators.python import (
                PythonOperator,
                BranchPythonOperator,
            )
        """
    )


@pytest.mark.parametrize(
    "source",
    [
        "from airflow.operators.python import (\n    PythonOperator,  # keep me\n)\n",
        "import os; from airflow.operators.bash import BashOperator\n",
        "from airflow.operators.bash import BashOperator; import os\n",
        "if True: from airflow.operators.bash import BashOperator\n",
        "from .operators.bash import BashOperator\n",
        "from airflow.operators.bash import *\n",
        "from airflow.models import DAG\n",
    ],
)
def test_import_left_alone_when_unsure_or_current(source):
    assert fixed(source) == source


def test_imports_are_safe_fixes():
    result = fix_source("from airflow.operators.bash import BashOperator\n", unsafe=False)
    assert [f.check_id for f in result.applied] == ["current_imports"]
    assert result.unsafe_skipped == []


# --- retries (unsafe) --------------------------------------------------------


@pytest.mark.parametrize(
    ("source", "expected"),
    [
        (
            'default_args = {\n    "owner": "data",\n    "email": ["a@b.c"],  # who\n}\n',
            'default_args = {\n    "owner": "data",\n    "email": ["a@b.c"],  # who\n'
            '    "retries": 2,\n}\n',
        ),
        (
            "DAG('x', default_args={\n    'owner': 'data'  # who\n})\n",
            "DAG('x', default_args={\n    'owner': 'data',  # who\n    'retries': 2\n})\n",
        ),
        (
            'DAG("x", default_args={"owner": "data"})\n',
            'DAG("x", default_args={"owner": "data", "retries": 2})\n',
        ),
        ("default_args = {}\n", 'default_args = {"retries": 2}\n'),
        (
            "default_args: dict = {r'owner': 'x'}\n",
            "default_args: dict = {r'owner': 'x', 'retries': 2}\n",
        ),
        (
            'default_args = {\r\n    "owner": "x",\r\n}\r\n',
            'default_args = {\r\n    "owner": "x",\r\n    "retries": 2,\r\n}\r\n',
        ),
        ('default_args = {"owner": "Hêvî"}\n', 'default_args = {"owner": "Hêvî", "retries": 2}\n'),
    ],
)
def test_retries_added_to_default_args(source, expected):
    assert fix_source(source, unsafe=True).text == expected


@pytest.mark.parametrize(
    "source",
    [
        'default_args = {"retries": 0}\n',  # set on purpose
        'default_args = {"owner": "x"}\nBashOperator(task_id="t", retries=3)\n',
        'default_args = {"owner": "x", **base}\n',
        'default_args = {"owner": "x"}\nDAG("d", **kwargs)\n',
        'default_args = dict(owner="x")\n',
        'DAG("d")\n',
        'default_args = {"owner": "x"}  # dagwick: ack retries -- inserts are not idempotent\n',
    ],
)
def test_retries_left_alone(source):
    assert fix_source(source, unsafe=True).text == source


def test_retries_is_unsafe():
    result = fix_source('default_args = {"owner": "x"}\n', unsafe=False)
    assert result.applied == []
    assert [f.check_id for f in result.unsafe_skipped] == ["retries"]
    assert result.text == 'default_args = {"owner": "x"}\n'


def test_an_ack_without_a_reason_does_not_stop_the_fix():
    source = 'default_args = {"owner": "x"}  # dagwick: ack retries\n'
    assert fix_source(source, unsafe=True).text != source


# --- every fixer -------------------------------------------------------------

MESSY = dedent(
    """\
    from airflow.decorators import dag, task
    from airflow.operators.python import (
        PythonOperator,
        get_current_context as ctx,
    )

    default_args = {
        "owner": "data-team"  # team
    }
    """
)


def test_fixes_are_idempotent():
    once = fix_source(MESSY, unsafe=True)
    assert len(once.applied) == 3
    twice = fix_source(once.text, unsafe=True)
    assert twice.applied == [] and twice.unsafe_skipped == []
    assert twice.text == once.text


def test_every_fixer_names_a_real_check():
    from dagwick.core import registered_checks

    ids = {s.id for s in registered_checks()}
    assert set(FIXERS) <= ids


def test_invalid_python_is_refused():
    with pytest.raises(SyntaxError):
        fix_source("def f(:\n")


def test_overlapping_edits_keep_the_first_from_the_end():
    fixes = [
        Fix("a", 1, "a", (Edit(0, 5, "AAAAA"),)),
        Fix("b", 1, "b", (Edit(3, 8, "BBBBB"),)),
    ]
    assert apply_edits("0123456789", fixes) == "012BBBBB89"


# --- CLI ---------------------------------------------------------------------


@pytest.fixture
def dag_file(tmp_path):
    path = tmp_path / "dags" / "legacy.py"
    path.parent.mkdir()
    path.write_text(MESSY, encoding="utf-8")
    return path


def test_cli_shows_a_diff_and_changes_nothing(dag_file):
    code, out, _ = run("fix", str(dag_file))
    assert code == BELOW_GRADE  # 1: there is something to fix
    assert f"--- a/{dag_file}" in out and "+from airflow.sdk import dag, task" in out
    assert f"{dag_file}:1: current_imports:" in out
    assert "retries=2" in out and "[--unsafe-fixes]" in out
    assert "Would fix 2 problems in 1 file." in out
    assert "1 more fix with --unsafe-fixes" in out
    assert dag_file.read_text(encoding="utf-8") == MESSY


def test_cli_write_applies_safe_fixes_only(dag_file):
    code, out, _ = run("fix", "--write", str(dag_file))
    assert code == OK
    assert "Fixed 2 problems in 1 file." in out
    text = dag_file.read_text(encoding="utf-8")
    assert "from airflow.sdk import dag, task" in text
    assert "retries" not in text


def test_cli_unsafe_fixes(dag_file):
    code, out, _ = run("fix", "--write", "--unsafe-fixes", str(dag_file))
    assert code == OK and "Fixed 3 problems in 1 file." in out
    assert '"retries": 2' in dag_file.read_text(encoding="utf-8")
    assert run("fix", "--unsafe-fixes", str(dag_file))[:2] == (OK, "Nothing to fix.\n")


def test_cli_keeps_crlf_line_endings(tmp_path):
    path = tmp_path / "crlf.py"
    path.write_bytes(b"from airflow.operators.bash import BashOperator\r\nx = 1\r\n")
    assert run("fix", "--write", str(path))[0] == OK
    assert path.read_bytes() == (
        b"from airflow.providers.standard.operators.bash import BashOperator\r\nx = 1\r\n"
    )


def test_cli_reports_files_it_cannot_fix(tmp_path, dag_file):
    bad = tmp_path / "dags" / "broken.py"
    bad.write_text("def f(:\n", encoding="utf-8")
    code, out, err = run("fix", "--write", str(dag_file.parent))
    assert code == LOAD_ERROR
    assert f"can't fix {bad}: SyntaxError" in err
    assert "Fixed 2 problems in 1 file." in out  # the other file is still fixed


def test_cli_missing_path():
    with pytest.raises(SystemExit) as exc:
        run("fix", "no/such/dir")
    assert exc.value.code == 2


def test_cli_warns_when_airflow_is_missing(monkeypatch, tmp_path):
    real = cli.importlib.util.find_spec
    monkeypatch.setattr(
        cli.importlib.util,
        "find_spec",
        lambda name, *a: None if name == "airflow" else real(name, *a),
    )
    (tmp_path / "x.py").write_text("x = 1\n", encoding="utf-8")
    code, _, err = run("fix", str(tmp_path))
    assert code == OK
    assert "Airflow is not installed here" in err


def test_python_files_skips_hidden_and_cache_folders(tmp_path):
    for rel in ["a.py", "sub/b.py", ".venv/c.py", "sub/__pycache__/d.py", "notes.txt"]:
        path = tmp_path / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("", encoding="utf-8")
    found = [p.relative_to(tmp_path).as_posix() for p in python_files([tmp_path])]
    assert found == ["a.py", "sub/b.py"]


def test_check_output_says_which_checks_are_fixable():
    assert fixable_hint("current_imports") == " [dagwick fix]"
    assert fixable_hint("retries") == " [dagwick fix --unsafe-fixes]"
    assert fixable_hint("owner") == ""
