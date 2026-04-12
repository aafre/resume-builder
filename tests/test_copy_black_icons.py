"""Tests for _copy_black_icons() in app.py."""
import shutil
from pathlib import Path
from unittest.mock import patch

import pytest


# Import the function under test — patch ICONS_DIR to control the source
from app import _copy_black_icons


class TestCopyBlackIcons:
    """Tests for copying black monochrome icon variants to session directory."""

    def test_copies_matching_icons(self, tmp_path: Path):
        """Copies icons that exist in the source black/ directory."""
        # Setup: create source icons/black with some icons
        icons_dir = tmp_path / "icons"
        black_src = icons_dir / "black"
        black_src.mkdir(parents=True)
        (black_src / "email.png").write_bytes(b"fake-email-icon")
        (black_src / "phone.png").write_bytes(b"fake-phone-icon")
        (black_src / "location.png").write_bytes(b"fake-location-icon")

        # Setup: create session icons dir
        session_dir = tmp_path / "session_icons"
        session_dir.mkdir()

        with patch("app.ICONS_DIR", icons_dir):
            _copy_black_icons(session_dir, ["email.png", "phone.png"])

        # Verify: only requested icons are copied
        dst = session_dir / "black"
        assert dst.is_dir()
        assert (dst / "email.png").read_bytes() == b"fake-email-icon"
        assert (dst / "phone.png").read_bytes() == b"fake-phone-icon"
        assert not (dst / "location.png").exists()  # Not in base_contact_icons list

    def test_skips_missing_source_icons(self, tmp_path: Path):
        """Icons in the list that don't exist in source are silently skipped."""
        icons_dir = tmp_path / "icons"
        black_src = icons_dir / "black"
        black_src.mkdir(parents=True)
        (black_src / "email.png").write_bytes(b"icon-data")

        session_dir = tmp_path / "session_icons"
        session_dir.mkdir()

        with patch("app.ICONS_DIR", icons_dir):
            _copy_black_icons(session_dir, ["email.png", "nonexistent.png"])

        dst = session_dir / "black"
        assert (dst / "email.png").exists()
        assert not (dst / "nonexistent.png").exists()

    def test_no_error_when_source_dir_missing(self, tmp_path: Path):
        """No error when icons/black directory doesn't exist."""
        icons_dir = tmp_path / "icons"  # No black/ subdirectory
        icons_dir.mkdir()

        session_dir = tmp_path / "session_icons"
        session_dir.mkdir()

        with patch("app.ICONS_DIR", icons_dir):
            # Should not raise
            _copy_black_icons(session_dir, ["email.png"])

        # No black/ dir created in session
        assert not (session_dir / "black").exists()

    def test_empty_icon_list(self, tmp_path: Path):
        """Empty icon list creates directory but copies nothing."""
        icons_dir = tmp_path / "icons"
        black_src = icons_dir / "black"
        black_src.mkdir(parents=True)
        (black_src / "email.png").write_bytes(b"icon-data")

        session_dir = tmp_path / "session_icons"
        session_dir.mkdir()

        with patch("app.ICONS_DIR", icons_dir):
            _copy_black_icons(session_dir, [])

        dst = session_dir / "black"
        assert dst.is_dir()
        # Directory exists but is empty
        assert list(dst.iterdir()) == []

    def test_creates_destination_directory(self, tmp_path: Path):
        """Creates session_icons/black/ even if it doesn't exist yet."""
        icons_dir = tmp_path / "icons"
        black_src = icons_dir / "black"
        black_src.mkdir(parents=True)
        (black_src / "email.png").write_bytes(b"data")

        session_dir = tmp_path / "session_icons"
        session_dir.mkdir()
        # black/ subdirectory does not exist yet

        with patch("app.ICONS_DIR", icons_dir):
            _copy_black_icons(session_dir, ["email.png"])

        assert (session_dir / "black" / "email.png").exists()
