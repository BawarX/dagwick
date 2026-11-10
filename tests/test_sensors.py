from __future__ import annotations

from textwrap import dedent

import pytest

from dagwick import Context
from dagwick.checks._sensors import sensor_modes, sensor_task_ids
from dagwick.checks._source import parse
from dagwick.core import score_dag


def modes(source: str, default_deferrable: bool = False):
    return sensor_modes(parse(dedent(source)), default_deferrable)


def check(dag, source, sensors, runs=None, default_deferrable=False):
    context = Context(
        source=dedent(source),
        sensor_tasks=sensors,
        sensor_runs=runs,
        default_deferrable=default_deferrable,
    )
    return next(c for c in score_dag(dag, context)["checks"] if c["id"] == "sensor_slots")


def test_sensor_task_ids_come_from_the_serialized_flag():
    data = {
        "dag": {
            "tasks": [
                {"__type": "operator", "__var": {"task_id": "wait", "_is_sensor": True}},
                {"__type": "operator", "__var": {"task_id": "load"}},
                {"task_id": "plain_wait", "_is_sensor": True},
            ]
        }
    }
    assert sensor_task_ids(data) == ("plain_wait", "wait")


@pytest.mark.parametrize("data", [None, {}, {"dag": {}}, "not a dict"])
def test_sensor_task_ids_unknown_without_serialized_tasks(data):
    assert sensor_task_ids(data) is None


def test_modes_from_keywords_class_names_and_defaults():
    assert modes(
        """
        a = S3KeySensor(task_id="poke_default")
        b = S3KeySensor(task_id="poke_explicit", mode="poke")
        c = S3KeySensor(task_id="resched", mode="reschedule")
        d = S3KeySensor(task_id="defer", deferrable=True)
        e = S3KeySensorAsync(task_id="async_class")
        f = S3KeySensor(task_id="dynamic", mode=MODE)
        g = S3KeySensor(task_id="defer_dynamic", deferrable=FLAG)
        h = PythonOperator(task_id="not_a_sensor")
        i = S3KeySensor(task_id=TASK)
        """
    ) == {
        "poke_default": "poke",
        "poke_explicit": "poke",
        "resched": "reschedule",
        "defer": "deferrable",
        "async_class": "deferrable",
        "dynamic": None,
        "defer_dynamic": None,
    }


def test_default_args_set_the_mode_for_every_sensor():
    assert modes(
        """
        default_args = {"mode": "reschedule"}
        with DAG("d", default_args=default_args):
            S3KeySensor(task_id="a")
            S3KeySensor(task_id="b", mode="poke")
        """
    ) == {"a": "reschedule", "b": "poke"}
    assert modes('DAG("d", default_args={"deferrable": True})\nS3KeySensor(task_id="a")\n') == {
        "a": "deferrable"
    }


def test_task_sensor_decorator():
    assert modes(
        """
        @task.sensor(poke_interval=60, mode="reschedule")
        def wait_for_file():
            return True

        @task.sensor
        def wait_quietly():
            return True

        @task.sensor(task_id="named")
        def other():
            return True
        """
    ) == {"wait_for_file": "reschedule", "wait_quietly": "poke", "named": "poke"}


def test_default_deferrable_config_makes_unset_sensors_unknown():
    assert modes(
        """
        S3KeySensor(task_id="unset")
        S3KeySensor(task_id="off", deferrable=False)
        S3KeySensor(task_id="resched", mode="reschedule")
        """,
        default_deferrable=True,
    ) == {"unset": None, "off": "poke", "resched": "reschedule"}


SOURCE = """
S3KeySensor(task_id="slow_poke")
S3KeySensor(task_id="quick_poke")
S3KeySensor(task_id="resched", mode="reschedule")
S3KeySensor(task_id="defer", deferrable=True)
"""


def test_warns_only_for_poke_sensors_that_wait_long(shining):
    runs = {"slow_poke": (1800.0, False), "quick_poke": (12.0, False), "resched": (5000.0, False)}
    result = check(shining, SOURCE, ("defer", "quick_poke", "resched", "slow_poke"), runs)
    assert result["status"] == "warn"
    assert result["items"] == ["slow_poke: holds a worker slot for about 30 min per run"]
    assert "deferrable" in result["fix"]


def test_reschedule_rows_prove_a_sensor_frees_its_slot(shining):
    runs = {"slow_poke": (1800.0, True)}
    assert check(shining, SOURCE, ("slow_poke",), runs)["status"] == "pass"


def test_quick_poke_sensors_pass(shining):
    assert (
        check(shining, SOURCE, ("quick_poke",), {"quick_poke": (59.0, False)})["status"] == "pass"
    )


@pytest.mark.parametrize(
    ("sensors", "runs", "message"),
    [
        (None, None, "not known"),
        ((), None, "no sensors"),
        (("slow_poke",), {}, "Not enough"),
        (("unseen",), {"unseen": (3000.0, False)}, "Not enough"),
    ],
)
def test_skips_when_it_cannot_judge(shining, sensors, runs, message):
    result = check(shining, SOURCE, sensors, runs)
    assert result["status"] == "skip"
    assert message in result["message"]


def test_long_wait_with_unknown_mode_is_not_blamed(shining):
    source = 'S3KeySensor(task_id="maybe", deferrable=FLAG)\n'
    assert check(shining, source, ("maybe",), {"maybe": (3600.0, False)})["status"] == "skip"


def test_sensor_check_can_be_acknowledged(shining):
    source = "# dagwick: ack sensor_slots -- must react within 10 s\n" + dedent(SOURCE)
    result = check(shining, source, ("slow_poke",), {"slow_poke": (1800.0, False)})
    assert result["status"] == "ack"


def test_sensor_band_changes_when_a_sensor_crosses_the_threshold():
    from dagwick.api import _sensor_band

    quick = _sensor_band({"a": (30.0, False)})
    slow = _sensor_band({"a": (300.0, False)})
    unknown = _sensor_band({"a": (None, False)})
    rescheduled = _sensor_band({"a": (300.0, True)})
    assert len({quick, slow, unknown, rescheduled}) == 4
    assert _sensor_band({"a": (30.0, False)}) == _sensor_band({"a": (45.0, False)})


def test_sensor_runs_degrade_to_nothing_when_the_database_fails(monkeypatch):
    from airflow.utils import session as airflow_session

    from dagwick import api

    def broken():
        raise RuntimeError("database is down")

    monkeypatch.setattr(airflow_session, "create_session", broken)
    assert api._sensor_runs("d", ("a",)) == {}
    assert api._sensor_runs("d", ()) == {}
