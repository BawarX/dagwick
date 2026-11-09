from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

_path = Path(__file__).parents[1] / "scripts" / "release_notes.py"
_spec = importlib.util.spec_from_file_location("release_notes", _path)
release_notes = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(release_notes)

CHANGELOG = """# Changelog

## [Unreleased]

## [0.3.0] - unreleased

### Added

- Something new.

## [0.2.0] - 2026-11-20

### Added

- Seasonal moods.

### Fixed

- A bug.

## [0.1.0] - 2026-11-08

- First release.
"""


def test_extracts_only_that_version():
    notes = release_notes.notes_for("0.2.0", CHANGELOG)
    assert notes.startswith("Install: `pip install dagwick==0.2.0`")
    assert "Seasonal moods." in notes and "A bug." in notes
    assert "First release." not in notes and "Something new." not in notes


def test_last_section_runs_to_end_of_file():
    assert "First release." in release_notes.notes_for("0.1.0", CHANGELOG)


def test_undated_version_is_refused():
    with pytest.raises(SystemExit, match="not dated"):
        release_notes.notes_for("0.3.0", CHANGELOG)


def test_missing_version_is_refused():
    with pytest.raises(SystemExit, match="no section"):
        release_notes.notes_for("9.9.9", CHANGELOG)


def test_real_changelog_has_notes_for_the_released_version():
    assert "Dagwick tab" in release_notes.notes_for("0.1.0", release_notes.CHANGELOG.read_text())
