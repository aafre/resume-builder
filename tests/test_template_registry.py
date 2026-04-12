"""Tests for templates/registry.py — template catalogue and helpers."""

import pytest
from pathlib import Path

from templates.models import PDFOptions, TemplateConfig, TemplateEngine
from templates.registry import (
    TEMPLATES,
    get,
    get_dir,
    get_engine,
    get_sample_path,
    get_pdf_options,
    is_valid,
    all_ids,
    get_display_templates,
    validate_all,
)


# =============================================================================
# get()
# =============================================================================


class TestGet:
    """Registry lookup via get()."""

    def test_known_template_returns_config(self):
        cfg = get("modern-with-icons")
        assert isinstance(cfg, TemplateConfig)
        assert cfg.id == "modern-with-icons"

    def test_unknown_template_raises_key_error(self):
        with pytest.raises(KeyError, match="Available templates:"):
            get("nonexistent-template")

    def test_error_message_includes_template_name(self):
        with pytest.raises(KeyError, match="nonexistent-template"):
            get("nonexistent-template")


# =============================================================================
# get_dir()
# =============================================================================


class TestGetDir:
    """get_dir() maps template ID to its on-disk directory name."""

    def test_modern_with_icons_maps_to_modern(self):
        assert get_dir("modern-with-icons") == "modern"

    def test_ats_optimized_maps_to_self(self):
        assert get_dir("ats-optimized") == "ats-optimized"

    def test_classic_alex_rivera_maps_to_classic(self):
        assert get_dir("classic-alex-rivera") == "classic"


# =============================================================================
# get_engine()
# =============================================================================


class TestGetEngine:
    """get_engine() returns the correct rendering engine enum."""

    def test_html_engine_for_modern_with_icons(self):
        assert get_engine("modern-with-icons") is TemplateEngine.html

    def test_latex_engine_for_executive(self):
        assert get_engine("executive") is TemplateEngine.latex

    def test_html_engine_for_ats_optimized(self):
        assert get_engine("ats-optimized") is TemplateEngine.html

    def test_latex_engine_for_classic_alias(self):
        assert get_engine("classic") is TemplateEngine.latex


# =============================================================================
# get_sample_path()
# =============================================================================


class TestGetSamplePath:
    """get_sample_path() returns an absolute Path ending with .yml."""

    def test_returns_absolute_path(self):
        path = get_sample_path("modern-with-icons")
        assert isinstance(path, Path)
        assert path.is_absolute()

    def test_ends_with_yml(self):
        path = get_sample_path("ats-optimized")
        assert path.suffix == ".yml"

    def test_sample_file_actually_exists(self):
        path = get_sample_path("student")
        assert path.is_file(), f"Expected sample file to exist: {path}"


# =============================================================================
# get_pdf_options()
# =============================================================================


class TestGetPDFOptions:
    """get_pdf_options() returns the correct PDFOptions per template."""

    def test_uk_cv_uses_a4(self):
        opts = get_pdf_options("uk-cv")
        assert opts.page_size == "A4"

    def test_modern_with_icons_uses_letter(self):
        opts = get_pdf_options("modern-with-icons")
        assert opts.page_size == "Letter"

    def test_returns_pdf_options_instance(self):
        opts = get_pdf_options("student")
        assert isinstance(opts, PDFOptions)


# =============================================================================
# is_valid()
# =============================================================================


class TestIsValid:
    """is_valid() checks whether a template ID is registered."""

    def test_registered_template(self):
        assert is_valid("student") is True

    def test_unregistered_template(self):
        assert is_valid("nonexistent") is False

    def test_alias_is_valid(self):
        assert is_valid("modern") is True


# =============================================================================
# all_ids()
# =============================================================================


class TestAllIds:
    """all_ids() returns a sorted list of every registered template ID."""

    def test_returns_sorted_list(self):
        ids = all_ids()
        assert ids == sorted(ids)

    def test_includes_modern_alias(self):
        assert "modern" in all_ids()

    def test_includes_classic_alias(self):
        assert "classic" in all_ids()

    def test_includes_user_facing_templates(self):
        ids = all_ids()
        for expected in ("modern-with-icons", "ats-optimized", "student", "executive", "uk-cv"):
            assert expected in ids, f"{expected} missing from all_ids()"


# =============================================================================
# get_display_templates()
# =============================================================================


class TestGetDisplayTemplates:
    """get_display_templates() filters out internal aliases."""

    def test_excludes_modern_alias(self):
        display_ids = {t.id for t in get_display_templates()}
        assert "modern" not in display_ids

    def test_excludes_classic_alias(self):
        display_ids = {t.id for t in get_display_templates()}
        assert "classic" not in display_ids

    def test_excludes_two_column_alias(self):
        display_ids = {t.id for t in get_display_templates()}
        assert "two-column" not in display_ids

    def test_includes_modern_with_icons(self):
        display_ids = {t.id for t in get_display_templates()}
        assert "modern-with-icons" in display_ids

    def test_includes_executive(self):
        display_ids = {t.id for t in get_display_templates()}
        assert "executive" in display_ids

    def test_includes_uk_cv(self):
        display_ids = {t.id for t in get_display_templates()}
        assert "uk-cv" in display_ids

    def test_returns_template_config_instances(self):
        templates = get_display_templates()
        assert all(isinstance(t, TemplateConfig) for t in templates)


# =============================================================================
# validate_all()
# =============================================================================


class TestValidateAll:
    """validate_all() checks on-disk assets for every registered template."""

    def test_all_templates_valid(self):
        errors = validate_all()
        assert errors == [], f"Template validation errors: {errors}"


# =============================================================================
# Integrity checks
# =============================================================================


class TestRegistryIntegrity:
    """Cross-cutting integrity checks on the registry."""

    def test_no_duplicate_ids(self):
        """IDs in the TEMPLATES dict are inherently unique (dict keys),
        but verify the count matches what all_ids() reports."""
        assert len(TEMPLATES) == len(all_ids())

    def test_all_have_sample_field(self):
        for tid, cfg in TEMPLATES.items():
            assert cfg.sample, f"Template {tid!r} has no sample path"

    def test_all_have_preview_field(self):
        for tid, cfg in TEMPLATES.items():
            assert cfg.preview, f"Template {tid!r} has no preview filename"

    def test_all_ids_returns_list_of_strings(self):
        ids = all_ids()
        assert isinstance(ids, list)
        assert all(isinstance(i, str) for i in ids)
