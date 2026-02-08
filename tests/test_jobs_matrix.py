"""Tests for generate_jobs_matrix.py — slug safety, coverage, and validation."""

import json
import re
import sys
import os

import pytest

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from generate_jobs_matrix import (
    generate_matrix,
    validate_matrix,
    to_slug,
    LOCATIONS,
    LOCATION_BY_SLUG,
    ROLE_CATEGORIES,
    FILTER_MODIFIERS,
    SENIORITY_PREFIXES,
    SALARY_BANDS,
    ALL_CATEGORIES,
)
from job_engine import TITLE_SYNONYMS


SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


@pytest.fixture(scope="module")
def matrix():
    return generate_matrix()


# ---- Slug safety ----

class TestSlugSafety:
    def test_role_slugs_are_url_safe(self, matrix):
        for role in matrix["roles"]:
            assert SLUG_RE.match(role["slug"]), f"Invalid role slug: {role['slug']}"

    def test_location_slugs_are_url_safe(self, matrix):
        for loc in matrix["locations"]:
            assert SLUG_RE.match(loc["slug"]), f"Invalid location slug: {loc['slug']}"

    def test_role_slugs_unique(self, matrix):
        slugs = [r["slug"] for r in matrix["roles"]]
        assert len(slugs) == len(set(slugs)), f"Duplicate role slugs: {[s for s in slugs if slugs.count(s) > 1]}"

    def test_location_slugs_unique(self, matrix):
        slugs = [l["slug"] for l in matrix["locations"]]
        assert len(slugs) == len(set(slugs)), f"Duplicate location slugs: {[s for s in slugs if slugs.count(s) > 1]}"

    def test_filter_modifier_slugs_are_url_safe(self):
        for slug in FILTER_MODIFIERS:
            assert SLUG_RE.match(slug), f"Invalid filter modifier slug: {slug}"

    def test_salary_band_slugs_are_url_safe(self):
        for slug in SALARY_BANDS:
            assert SLUG_RE.match(slug), f"Invalid salary band slug: {slug}"


# ---- Coverage ----

class TestCoverage:
    def test_all_title_synonyms_covered(self, matrix):
        """Every TITLE_SYNONYMS key must have a matching slug in the matrix."""
        role_slugs = {r["slug"] for r in matrix["roles"]}
        for key in TITLE_SYNONYMS:
            slug = to_slug(key)
            assert slug in role_slugs, f"TITLE_SYNONYMS key '{key}' (slug: {slug}) not in matrix"

    def test_every_role_has_category(self, matrix):
        for role in matrix["roles"]:
            assert role["category"] in matrix["categories"], \
                f"Role '{role['key']}' has unknown category '{role['category']}'"

    def test_all_categories_represented(self, matrix):
        """Every category should have at least one role."""
        used_cats = {r["category"] for r in matrix["roles"]}
        for cat in ALL_CATEGORIES:
            assert cat in used_cats, f"Category '{cat}' has no roles"

    def test_role_categories_covers_all_synonyms(self):
        """Every TITLE_SYNONYMS key should have a ROLE_CATEGORIES entry."""
        for key in TITLE_SYNONYMS:
            assert key in ROLE_CATEGORIES, f"'{key}' missing from ROLE_CATEGORIES"


# ---- Structure ----

class TestStructure:
    def test_matrix_has_required_keys(self, matrix):
        assert "version" in matrix
        assert "roles" in matrix
        assert "locations" in matrix
        assert "categories" in matrix
        assert "filter_modifiers" in matrix
        assert "seniority_prefixes" in matrix
        assert "salary_bands" in matrix
        assert "combinations_count" in matrix
        assert "meta" in matrix

    def test_combinations_count_correct(self, matrix):
        expected = len(matrix["roles"]) * len(matrix["locations"])
        assert matrix["combinations_count"] == expected

    def test_role_has_required_fields(self, matrix):
        for role in matrix["roles"]:
            assert "key" in role
            assert "slug" in role
            assert "display_name" in role
            assert "category" in role
            assert "related_roles" in role

    def test_location_has_required_fields(self, matrix):
        for loc in matrix["locations"]:
            assert "name" in loc
            assert "slug" in loc
            assert "region" in loc
            assert "nearby" in loc

    def test_related_roles_max_8(self, matrix):
        for role in matrix["roles"]:
            assert len(role["related_roles"]) <= 8, \
                f"Role '{role['key']}' has {len(role['related_roles'])} related roles (max 8)"

    def test_nearby_locations_valid(self, matrix):
        loc_slugs = {l["slug"] for l in matrix["locations"]}
        for loc in matrix["locations"]:
            for nearby in loc["nearby"]:
                assert nearby in loc_slugs, \
                    f"Location '{loc['slug']}' has invalid nearby: '{nearby}'"


# ---- Validation function ----

class TestValidation:
    def test_validate_passes_for_valid_matrix(self, matrix):
        errors = validate_matrix(matrix)
        assert errors == [], f"Validation errors: {errors}"

    def test_validate_catches_duplicate_slugs(self):
        matrix = generate_matrix()
        # Inject a duplicate
        matrix["roles"].append(matrix["roles"][0].copy())
        errors = validate_matrix(matrix)
        assert any("Duplicate role slugs" in e for e in errors)


# ---- to_slug function ----

class TestToSlug:
    @pytest.mark.parametrize("input_name,expected", [
        ("Software Engineer", "software-engineer"),
        ("c++", "c"),  # ++ stripped by regex
        ("c#", "c"),
        ("QA Engineer", "qa-engineer"),
        ("iOS Developer", "ios-developer"),
        ("full stack developer", "full-stack-developer"),
        ("SRE", "sre"),
    ])
    def test_slug_generation(self, input_name, expected):
        assert to_slug(input_name) == expected


# ---- Constants ----

class TestConstants:
    def test_seniority_prefixes(self):
        assert set(SENIORITY_PREFIXES) == {"junior", "mid", "senior", "lead"}

    def test_salary_bands_ascending(self):
        values = list(SALARY_BANDS.values())
        assert values == sorted(values), "Salary bands should be in ascending order"

    def test_salary_bands_reasonable(self):
        for slug, value in SALARY_BANDS.items():
            assert value >= 10000, f"Salary band {slug} too low: {value}"
            assert value <= 500000, f"Salary band {slug} too high: {value}"

    def test_locations_count(self):
        assert len(LOCATIONS) == 21  # 20 cities + remote

    def test_remote_in_locations(self):
        assert "remote" in LOCATION_BY_SLUG
