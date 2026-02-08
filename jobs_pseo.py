"""
pSEO rendering engine for Jobs pages.

Resolves URLs to page types, fetches data from Adzuna via JobMatchEngine,
generates structured data, renders Jinja2 HTML, and manages filesystem cache.
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import statistics
import time
from collections import Counter
from dataclasses import dataclass, field
from datetime import datetime, timezone, timedelta
from enum import Enum
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader

from job_engine import JobMatchEngine, MatchContext, TITLE_SYNONYMS
from jobs_content import get_intro_copy, get_faqs, format_salary_insight
from generate_jobs_matrix import (
    FILTER_MODIFIERS,
    SALARY_BANDS,
    SENIORITY_PREFIXES,
    LOCATION_BY_SLUG,
    to_slug,
)

logger = logging.getLogger(__name__)

# Stop words for skill extraction from job descriptions
_STOP_WORDS = frozenset({
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
    "have", "in", "is", "it", "its", "of", "on", "or", "that", "the", "to",
    "was", "were", "will", "with", "you", "your", "this", "they", "can",
    "all", "but", "not", "what", "who", "which", "their", "our", "we",
    "been", "had", "would", "about", "into", "over", "such", "than", "them",
    "then", "these", "those", "being", "each", "also", "more", "other",
    "some", "very", "just", "should", "could", "may", "do", "did", "does",
    "how", "when", "where", "why", "most", "must", "any", "both", "only",
    "work", "working", "role", "experience", "team", "ability", "skills",
    "looking", "including", "using", "new", "well", "within", "across",
    "join", "company", "part", "based", "good", "great", "make", "help",
    "use", "need", "like", "strong", "key", "right", "first", "one", "two",
    "per", "via", "etc", "e.g", "i.e", "day", "days", "year", "years",
    "time", "way", "see", "get", "set", "own", "end", "out", "up", "no",
})

# Known tech skills for extraction (lowercase)
_KNOWN_SKILLS = frozenset({
    "python", "java", "javascript", "typescript", "react", "angular", "vue",
    "node", "nodejs", "go", "golang", "rust", "ruby", "php", "swift",
    "kotlin", "c++", "c#", ".net", "sql", "nosql", "mongodb", "postgresql",
    "mysql", "redis", "elasticsearch", "aws", "azure", "gcp", "docker",
    "kubernetes", "terraform", "ansible", "jenkins", "git", "ci/cd",
    "graphql", "rest", "api", "microservices", "agile", "scrum", "jira",
    "figma", "sketch", "html", "css", "sass", "tailwind", "webpack",
    "linux", "bash", "pandas", "numpy", "tensorflow", "pytorch",
    "machine learning", "deep learning", "nlp", "data science",
    "power bi", "tableau", "excel", "sap", "salesforce",
    "spring", "django", "flask", "fastapi", "express", "nextjs",
    "vue.js", "react native", "flutter", "unity", "unreal",
})

BASE_URL = "https://easyfreeresume.com"


# =============================================================================
# Page type enum and data class
# =============================================================================

class PageType(Enum):
    ROLE_LOCATION = "role_location"
    ROLE_HUB = "role_hub"
    LOCATION_HUB = "location_hub"
    CATEGORY_HUB = "category_hub"
    COMPANY_PAGE = "company_page"
    FILTER_PAGE = "filter_page"
    SENIORITY_PAGE = "seniority_page"
    MAIN_HUB = "main_hub"


@dataclass
class SalaryStats:
    min: int = 0
    max: int = 0
    median: int = 0
    sample_size: int = 0
    currency: str = "£"

    def to_dict(self) -> dict:
        return {
            "min": self.min,
            "max": self.max,
            "median": self.median,
            "sample_size": self.sample_size,
            "currency": self.currency,
        }


@dataclass
class PageData:
    page_type: PageType
    role_slug: str | None = None
    role_display: str | None = None
    location_slug: str | None = None
    location_display: str | None = None
    modifier: str | None = None
    modifier_label: str | None = None
    seniority: str | None = None
    category: str | None = None
    company: str | None = None
    jobs: list[dict] = field(default_factory=list)
    total_count: int = 0
    salary_stats: SalaryStats = field(default_factory=SalaryStats)
    top_skills: list[str] = field(default_factory=list)
    related_roles: list[dict] = field(default_factory=list)
    related_locations: list[dict] = field(default_factory=list)
    internal_links: dict = field(default_factory=dict)
    intro_copy: str = ""
    faqs: list[dict] = field(default_factory=list)
    noindex: bool = False
    cached_at: str = ""

    # SEO fields
    title: str = ""
    meta_description: str = ""
    canonical_url: str = ""
    breadcrumbs: list[dict] = field(default_factory=list)
    structured_data: list[dict] = field(default_factory=list)
    prev_url: str | None = None
    next_url: str | None = None
    page_num: int = 1

    def to_dict(self) -> dict:
        """Serialize for JSON API and __PSEO_DATA__ script tag."""
        return {
            "page_type": self.page_type.value,
            "role_slug": self.role_slug,
            "role_display": self.role_display,
            "location_slug": self.location_slug,
            "location_display": self.location_display,
            "modifier": self.modifier,
            "modifier_label": self.modifier_label,
            "seniority": self.seniority,
            "category": self.category,
            "company": self.company,
            "jobs": self.jobs,
            "total_count": self.total_count,
            "salary_stats": self.salary_stats.to_dict(),
            "top_skills": self.top_skills,
            "related_roles": self.related_roles,
            "related_locations": self.related_locations,
            "internal_links": self.internal_links,
            "intro_copy": self.intro_copy,
            "faqs": self.faqs,
            "noindex": self.noindex,
            "cached_at": self.cached_at,
            "title": self.title,
            "meta_description": self.meta_description,
            "canonical_url": self.canonical_url,
            "breadcrumbs": self.breadcrumbs,
            "prev_url": self.prev_url,
            "next_url": self.next_url,
            "page_num": self.page_num,
        }


# =============================================================================
# Renderer
# =============================================================================

class PseoRenderer:
    """Core pSEO page renderer with filesystem cache."""

    RESULTS_PER_PAGE = 20
    MIN_RESULTS_FOR_INDEX = 5

    CACHE_TTL = {
        "default": 6 * 3600,        # 6 hours
        "freshness": 2 * 3600,      # 2 hours for posted-today/posted-this-week
        "hub": 12 * 3600,           # 12 hours for hub pages
    }

    def __init__(
        self,
        matrix: dict,
        adzuna_app_id: str,
        adzuna_app_key: str,
        cache_dir: str = "cache/jobs",
        templates_dir: str | None = None,
        vite_manifest: dict | None = None,
        supabase=None,
    ):
        self.matrix = matrix
        self.adzuna_app_id = adzuna_app_id
        self.adzuna_app_key = adzuna_app_key
        self.cache_dir = Path(cache_dir)
        self.vite_manifest = vite_manifest or {}
        self.supabase = supabase

        # Build lookup tables from matrix
        self._role_by_slug = {r["slug"]: r for r in matrix.get("roles", [])}
        self._loc_by_slug = {l["slug"]: l for l in matrix.get("locations", [])}

        # Jinja2 environment (standard delimiters — NOT LaTeX)
        tpl_dir = templates_dir or str(Path(__file__).parent / "templates" / "jobs")
        self.jinja_env = Environment(
            loader=FileSystemLoader(tpl_dir),
            autoescape=True,
        )
        self.jinja_env.globals["now"] = lambda: datetime.now(timezone.utc)
        self.jinja_env.globals["base_url"] = BASE_URL

    # ---- Public API --------------------------------------------------------

    def get_page(self, page_type: PageType, page: int = 1, **kwargs) -> str | None:
        """Return cached or freshly rendered HTML. None = 404."""
        # Check cache first
        cache_path = self._get_cache_path(page_type, page=page, **kwargs)
        if cache_path and self._is_cache_valid(cache_path, page_type):
            try:
                return cache_path.read_text(encoding="utf-8")
            except OSError:
                pass

        # Fetch data and render
        page_data = self._fetch_page_data(page_type, page=page, **kwargs)
        if page_data is None:
            return None

        # Apply noindex for thin content
        if page_data.total_count < self.MIN_RESULTS_FOR_INDEX and page_type != PageType.MAIN_HUB:
            page_data.noindex = True

        html = self._render_html(page_type, page_data)
        if html and cache_path:
            self._write_cache(cache_path, html)

        return html

    def get_page_data(self, page_type: PageType, page: int = 1, **kwargs) -> PageData | None:
        """Return structured data (for JSON API)."""
        return self._fetch_page_data(page_type, page=page, **kwargs)

    def resolve_url(self, path_segments: list[str]) -> tuple[PageType | None, dict]:
        """Parse URL path segments into (page_type, params). Returns (None, {}) for invalid URLs."""
        if not path_segments or (len(path_segments) == 1 and path_segments[0] == ""):
            return PageType.MAIN_HUB, {}

        seg0 = path_segments[0].lower()

        # /jobs/in/{location} — Location hub
        if seg0 == "in" and len(path_segments) == 2:
            loc_slug = path_segments[1].lower()
            if loc_slug in self._loc_by_slug:
                return PageType.LOCATION_HUB, {"location_slug": loc_slug}
            return None, {}

        # /jobs/category/{cat} or /jobs/category/{cat}/{location}
        if seg0 == "category" and len(path_segments) in (2, 3):
            cat = path_segments[1].lower()
            if cat in self.matrix.get("categories", []):
                if len(path_segments) == 3:
                    loc_slug = path_segments[2].lower()
                    if loc_slug in self._loc_by_slug:
                        return PageType.CATEGORY_HUB, {"category": cat, "location_slug": loc_slug}
                    return None, {}
                return PageType.CATEGORY_HUB, {"category": cat}
            return None, {}

        # /jobs/company/{co} or /jobs/company/{co}/{location}
        if seg0 == "company" and len(path_segments) in (2, 3):
            co_slug = path_segments[1].lower()
            if len(path_segments) == 3:
                loc_slug = path_segments[2].lower()
                if loc_slug in self._loc_by_slug:
                    return PageType.COMPANY_PAGE, {"company": co_slug, "location_slug": loc_slug}
                return None, {}
            return PageType.COMPANY_PAGE, {"company": co_slug}

        # /jobs/{seniority}/{role}/{location} — Seniority page
        if seg0 in SENIORITY_PREFIXES and len(path_segments) == 3:
            role_slug = path_segments[1].lower()
            loc_slug = path_segments[2].lower()
            if role_slug in self._role_by_slug and loc_slug in self._loc_by_slug:
                return PageType.SENIORITY_PAGE, {
                    "seniority": seg0,
                    "role_slug": role_slug,
                    "location_slug": loc_slug,
                }
            return None, {}

        # /jobs/{role} — Role hub (1 segment, must be in matrix)
        if len(path_segments) == 1 and seg0 in self._role_by_slug:
            return PageType.ROLE_HUB, {"role_slug": seg0}

        # /jobs/{role}/{location} — Primary pSEO page
        if len(path_segments) == 2:
            role_slug = seg0
            loc_slug = path_segments[1].lower()
            if role_slug in self._role_by_slug and loc_slug in self._loc_by_slug:
                return PageType.ROLE_LOCATION, {"role_slug": role_slug, "location_slug": loc_slug}
            return None, {}

        # /jobs/{role}/{location}/{modifier} — Filter page
        if len(path_segments) == 3:
            role_slug = seg0
            loc_slug = path_segments[1].lower()
            modifier = path_segments[2].lower()
            if (
                role_slug in self._role_by_slug
                and loc_slug in self._loc_by_slug
                and (modifier in FILTER_MODIFIERS or modifier in SALARY_BANDS)
            ):
                return PageType.FILTER_PAGE, {
                    "role_slug": role_slug,
                    "location_slug": loc_slug,
                    "modifier": modifier,
                }
            return None, {}

        return None, {}

    # ---- Data fetching ----------------------------------------------------

    def _fetch_page_data(self, page_type: PageType, page: int = 1, **kwargs) -> PageData | None:
        """Fetch data from Adzuna and build PageData."""
        try:
            if page_type == PageType.ROLE_LOCATION:
                return self._fetch_role_location(page=page, **kwargs)
            elif page_type == PageType.ROLE_HUB:
                return self._fetch_role_hub(page=page, **kwargs)
            elif page_type == PageType.LOCATION_HUB:
                return self._fetch_location_hub(page=page, **kwargs)
            elif page_type == PageType.FILTER_PAGE:
                return self._fetch_filter_page(page=page, **kwargs)
            elif page_type == PageType.SENIORITY_PAGE:
                return self._fetch_seniority_page(page=page, **kwargs)
            elif page_type == PageType.CATEGORY_HUB:
                return self._fetch_category_hub(page=page, **kwargs)
            elif page_type == PageType.COMPANY_PAGE:
                return self._fetch_company_page(page=page, **kwargs)
            elif page_type == PageType.MAIN_HUB:
                return self._fetch_main_hub()
            else:
                return None
        except Exception as e:
            logger.error(f"Error fetching page data for {page_type}: {e}")
            return None

    def _fetch_role_location(
        self, role_slug: str, location_slug: str, page: int = 1, **_
    ) -> PageData | None:
        """Fetch data for /jobs/{role}/{location}."""
        role = self._role_by_slug.get(role_slug)
        loc = self._loc_by_slug.get(location_slug)
        if not role or not loc:
            return None

        context = self._build_context(
            query=role["key"],
            location=loc["name"],
            page=page,
        )
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=True)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.ROLE_LOCATION,
            role_slug=role_slug,
            role_display=role["display_name"],
            location_slug=location_slug,
            location_display=loc["name"],
            category=role["category"],
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            top_skills=self._aggregate_top_skills(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        # Strip descriptions from jobs now that skills are extracted
        for job in page_data.jobs:
            job.pop("_description", None)

        # Build content
        slug_combo = f"{role_slug}/{location_slug}"
        page_data.intro_copy = get_intro_copy(
            category=role["category"],
            role_display=role["display_name"],
            location=loc["name"],
            num_jobs=total,
            slug_combo=slug_combo,
        )
        page_data.faqs = get_faqs(
            category=role["category"],
            role_display=role["display_name"],
            location=loc["name"],
            top_skills=page_data.top_skills,
            salary_stats=page_data.salary_stats.to_dict(),
        )

        # Build SEO
        page_data.title = self._build_title(page_data)
        page_data.meta_description = self._build_meta_description(page_data)
        page_data.canonical_url = f"{BASE_URL}/jobs/{role_slug}/{location_slug}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)

        # Internal links
        page_data.related_roles = self._build_related_roles(role, location_slug)
        page_data.related_locations = self._build_related_locations(role_slug, loc)
        page_data.internal_links = self._build_internal_links(page_data)

        # Pagination
        if page > 1:
            page_data.prev_url = f"{page_data.canonical_url}?page={page - 1}" if page > 2 else page_data.canonical_url
        if total > page * self.RESULTS_PER_PAGE:
            page_data.next_url = f"{page_data.canonical_url}?page={page + 1}"

        return page_data

    def _fetch_role_hub(self, role_slug: str, page: int = 1, **_) -> PageData | None:
        """Fetch data for /jobs/{role} — shows locations grid."""
        role = self._role_by_slug.get(role_slug)
        if not role:
            return None

        # Fetch nationwide data
        context = self._build_context(query=role["key"], page=page)
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=True)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.ROLE_HUB,
            role_slug=role_slug,
            role_display=role["display_name"],
            category=role["category"],
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            top_skills=self._aggregate_top_skills(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        for job in page_data.jobs:
            job.pop("_description", None)

        slug_combo = role_slug
        page_data.intro_copy = get_intro_copy(
            category=role["category"],
            role_display=role["display_name"],
            location="the UK",
            num_jobs=total,
            slug_combo=slug_combo,
        )
        page_data.faqs = get_faqs(
            category=role["category"],
            role_display=role["display_name"],
            location="the UK",
            top_skills=page_data.top_skills,
            salary_stats=page_data.salary_stats.to_dict(),
        )

        page_data.title = self._build_title(page_data)
        page_data.meta_description = self._build_meta_description(page_data)
        page_data.canonical_url = f"{BASE_URL}/jobs/{role_slug}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)

        # Location cards: link to each /jobs/{role}/{location}
        page_data.related_locations = [
            {"slug": loc["slug"], "name": loc["name"], "url": f"/jobs/{role_slug}/{loc['slug']}"}
            for loc in self.matrix.get("locations", [])
            if loc["slug"] != "remote"
        ]
        page_data.related_roles = self._build_related_roles(role, None)
        page_data.internal_links = self._build_internal_links(page_data)

        return page_data

    def _fetch_location_hub(self, location_slug: str, page: int = 1, **_) -> PageData | None:
        """Fetch data for /jobs/in/{location}."""
        loc = self._loc_by_slug.get(location_slug)
        if not loc:
            return None

        context = self._build_context(query="", location=loc["name"], page=page)
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=False)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.LOCATION_HUB,
            location_slug=location_slug,
            location_display=loc["name"],
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        page_data.title = f"Jobs in {loc['name']} ({_current_month_year()}) | EasyFreeResume"
        page_data.meta_description = (
            f"Browse {total}+ jobs in {loc['name']}. Find roles across engineering, "
            f"data, design, marketing and more. Updated {_current_month_year()}."
        )
        page_data.canonical_url = f"{BASE_URL}/jobs/in/{location_slug}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)

        # Role links grouped by category
        page_data.related_roles = [
            {"slug": r["slug"], "name": r["display_name"], "category": r["category"],
             "url": f"/jobs/{r['slug']}/{location_slug}"}
            for r in self.matrix.get("roles", [])
            if r["category"] in ("engineering", "data", "design", "management")
        ][:30]
        page_data.internal_links = self._build_internal_links(page_data)

        return page_data

    def _fetch_filter_page(
        self, role_slug: str, location_slug: str, modifier: str, page: int = 1, **_
    ) -> PageData | None:
        """Fetch data for /jobs/{role}/{location}/{modifier}."""
        role = self._role_by_slug.get(role_slug)
        loc = self._loc_by_slug.get(location_slug)
        if not role or not loc:
            return None

        # Build context with filter applied
        extra_kwargs: dict[str, Any] = {}
        modifier_label = modifier

        if modifier in FILTER_MODIFIERS:
            mod_info = FILTER_MODIFIERS[modifier]
            modifier_label = mod_info["label"]
            param = mod_info["adzuna_param"]
            value = mod_info["adzuna_value"]
            if param == "permanent":
                extra_kwargs["permanent"] = True
            elif param == "contract":
                extra_kwargs["contract"] = True
            elif param == "full_time":
                extra_kwargs["full_time"] = True
            elif param == "part_time":
                extra_kwargs["part_time"] = True
            elif param == "max_days_old":
                extra_kwargs["max_days_old"] = value
        elif modifier in SALARY_BANDS:
            extra_kwargs["salary_min"] = SALARY_BANDS[modifier]
            modifier_label = f"£{SALARY_BANDS[modifier] // 1000}k+"

        context = self._build_context(
            query=role["key"],
            location=loc["name"],
            page=page,
            **extra_kwargs,
        )
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=True)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.FILTER_PAGE,
            role_slug=role_slug,
            role_display=role["display_name"],
            location_slug=location_slug,
            location_display=loc["name"],
            modifier=modifier,
            modifier_label=modifier_label,
            category=role["category"],
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            top_skills=self._aggregate_top_skills(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        for job in page_data.jobs:
            job.pop("_description", None)

        slug_combo = f"{role_slug}/{location_slug}/{modifier}"
        salary_label = modifier_label if modifier in SALARY_BANDS else None
        page_data.intro_copy = get_intro_copy(
            category=role["category"],
            role_display=role["display_name"],
            location=loc["name"],
            num_jobs=total,
            slug_combo=slug_combo,
            modifier=modifier if modifier in FILTER_MODIFIERS else None,
            salary_label=salary_label,
        )
        page_data.faqs = get_faqs(
            category=role["category"],
            role_display=role["display_name"],
            location=loc["name"],
            top_skills=page_data.top_skills,
            salary_stats=page_data.salary_stats.to_dict(),
        )

        page_data.title = self._build_title(page_data)
        page_data.meta_description = self._build_meta_description(page_data)
        page_data.canonical_url = f"{BASE_URL}/jobs/{role_slug}/{location_slug}/{modifier}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)
        page_data.related_roles = self._build_related_roles(role, location_slug)
        page_data.related_locations = self._build_related_locations(role_slug, loc)
        page_data.internal_links = self._build_internal_links(page_data)

        return page_data

    def _fetch_seniority_page(
        self, seniority: str, role_slug: str, location_slug: str, page: int = 1, **_
    ) -> PageData | None:
        """Fetch data for /jobs/{seniority}/{role}/{location}."""
        role = self._role_by_slug.get(role_slug)
        loc = self._loc_by_slug.get(location_slug)
        if not role or not loc:
            return None

        # Use what_phrase for "senior {role}"
        context = self._build_context(
            query=f"{seniority} {role['key']}",
            location=loc["name"],
            page=page,
        )
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=True)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.SENIORITY_PAGE,
            role_slug=role_slug,
            role_display=role["display_name"],
            location_slug=location_slug,
            location_display=loc["name"],
            seniority=seniority,
            category=role["category"],
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            top_skills=self._aggregate_top_skills(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        for job in page_data.jobs:
            job.pop("_description", None)

        slug_combo = f"{seniority}/{role_slug}/{location_slug}"
        page_data.intro_copy = get_intro_copy(
            category=role["category"],
            role_display=role["display_name"],
            location=loc["name"],
            num_jobs=total,
            slug_combo=slug_combo,
            seniority=seniority,
        )
        page_data.faqs = get_faqs(
            category=role["category"],
            role_display=role["display_name"],
            location=loc["name"],
            top_skills=page_data.top_skills,
            salary_stats=page_data.salary_stats.to_dict(),
        )

        seniority_display = seniority.title()
        page_data.title = self._build_title(page_data)
        page_data.meta_description = self._build_meta_description(page_data)
        page_data.canonical_url = f"{BASE_URL}/jobs/{seniority}/{role_slug}/{location_slug}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)
        page_data.related_roles = self._build_related_roles(role, location_slug)
        page_data.related_locations = self._build_related_locations(role_slug, loc)
        page_data.internal_links = self._build_internal_links(page_data)

        return page_data

    def _fetch_category_hub(self, category: str, location_slug: str | None = None, page: int = 1, **_) -> PageData | None:
        """Fetch data for /jobs/category/{cat} or /jobs/category/{cat}/{location}."""
        loc = self._loc_by_slug.get(location_slug) if location_slug else None
        location_name = loc["name"] if loc else "the UK"

        context = self._build_context(
            query="",
            location=location_name if loc else "",
            category=category,
            page=page,
        )
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=False)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.CATEGORY_HUB,
            category=category,
            location_slug=location_slug,
            location_display=location_name,
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        cat_display = category.replace("-", " ").title()
        loc_suffix = f" in {location_name}" if loc else ""
        page_data.title = f"{cat_display} Jobs{loc_suffix} ({_current_month_year()}) | EasyFreeResume"
        page_data.meta_description = (
            f"Browse {total}+ {category} jobs{loc_suffix}. "
            f"Find the best opportunities updated {_current_month_year()}."
        )
        canon_path = f"/jobs/category/{category}"
        if location_slug:
            canon_path += f"/{location_slug}"
        page_data.canonical_url = f"{BASE_URL}{canon_path}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)

        # Related roles in this category
        page_data.related_roles = [
            {"slug": r["slug"], "name": r["display_name"],
             "url": f"/jobs/{r['slug']}/{location_slug}" if location_slug else f"/jobs/{r['slug']}"}
            for r in self.matrix.get("roles", [])
            if r["category"] == category
        ]
        page_data.internal_links = self._build_internal_links(page_data)

        return page_data

    def _fetch_company_page(self, company: str, location_slug: str | None = None, page: int = 1, **_) -> PageData | None:
        """Fetch data for /jobs/company/{co} or /jobs/company/{co}/{location}."""
        loc = self._loc_by_slug.get(location_slug) if location_slug else None
        company_display = company.replace("-", " ").title()
        location_name = loc["name"] if loc else ""

        context = self._build_context(
            query="",
            location=location_name,
            company=company_display,
            page=page,
        )
        engine = self._get_engine()
        result = engine.search_and_rank(context, keep_description=False)

        jobs = result.get("jobs", [])
        total = result.get("total_available", len(jobs))

        page_data = PageData(
            page_type=PageType.COMPANY_PAGE,
            company=company,
            location_slug=location_slug,
            location_display=location_name or "the UK",
            jobs=self._clean_jobs(jobs),
            total_count=total,
            salary_stats=self._aggregate_salary_stats(jobs),
            page_num=page,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )

        loc_suffix = f" in {location_name}" if loc else ""
        page_data.title = f"{company_display} Jobs{loc_suffix} ({_current_month_year()}) | EasyFreeResume"
        page_data.meta_description = (
            f"Browse {total}+ jobs at {company_display}{loc_suffix}. "
            f"Find the latest openings updated {_current_month_year()}."
        )
        canon_path = f"/jobs/company/{company}"
        if location_slug:
            canon_path += f"/{location_slug}"
        page_data.canonical_url = f"{BASE_URL}{canon_path}"
        page_data.breadcrumbs = self._build_breadcrumbs(page_data)
        page_data.structured_data = self._build_structured_data(page_data)
        page_data.internal_links = self._build_internal_links(page_data)

        return page_data

    def _fetch_main_hub(self) -> PageData:
        """Data for /jobs main hub — minimal, mostly internal links."""
        page_data = PageData(
            page_type=PageType.MAIN_HUB,
            cached_at=datetime.now(timezone.utc).isoformat(),
        )
        page_data.title = f"Job Search ({_current_month_year()}) | Find Jobs | EasyFreeResume"
        page_data.meta_description = (
            "Search thousands of UK jobs across engineering, data, design, marketing and more. "
            "Filter by location, salary, contract type. Updated daily."
        )
        page_data.canonical_url = f"{BASE_URL}/jobs"
        page_data.breadcrumbs = [
            {"name": "Home", "url": f"{BASE_URL}/"},
            {"name": "Jobs", "url": None},
        ]
        return page_data

    # ---- Helper: build MatchContext ----------------------------------------

    def _build_context(self, query: str, location: str = "", page: int = 1, **kwargs) -> MatchContext:
        """Build a MatchContext for Adzuna search."""
        return MatchContext(
            query=query,
            location=location,
            country="gb",
            page=page,
            results_per_page=self.RESULTS_PER_PAGE,
            **kwargs,
        )

    def _get_engine(self) -> JobMatchEngine:
        return JobMatchEngine(self.adzuna_app_id, self.adzuna_app_key, supabase=self.supabase)

    def _clean_jobs(self, jobs: list[dict]) -> list[dict]:
        """Clean job data for rendering (keep _description temporarily for skill extraction)."""
        cleaned = []
        for j in jobs:
            cleaned.append({
                "title": j.get("title", ""),
                "company": j.get("company", ""),
                "location": j.get("location", ""),
                "salary_min": j.get("salary_min"),
                "salary_max": j.get("salary_max"),
                "salary_is_predicted": j.get("salary_is_predicted", True),
                "url": j.get("url", ""),
                "created": j.get("created", ""),
                "_description": j.get("_description", ""),
            })
        return cleaned

    # ---- Aggregation -------------------------------------------------------

    def _aggregate_salary_stats(self, jobs: list[dict]) -> SalaryStats:
        """Compute salary stats from non-predicted salaries."""
        salaries = []
        for j in jobs:
            if not j.get("salary_is_predicted") and j.get("salary_min") and j.get("salary_max"):
                avg = (j["salary_min"] + j["salary_max"]) / 2
                if 10000 < avg < 500000:  # sanity bounds
                    salaries.append(int(avg))

        if len(salaries) < 3:
            return SalaryStats()

        return SalaryStats(
            min=min(salaries),
            max=max(salaries),
            median=int(statistics.median(salaries)),
            sample_size=len(salaries),
        )

    def _aggregate_top_skills(self, jobs: list[dict]) -> list[str]:
        """Extract top 5-8 skills from job descriptions via keyword matching."""
        word_counts: Counter = Counter()

        for j in jobs:
            desc = (j.get("_description") or "").lower()
            if not desc:
                continue
            # Match known skills (exact match in description)
            for skill in _KNOWN_SKILLS:
                if skill in desc:
                    word_counts[skill] += 1

        # Return top skills, at least mentioned in 2+ jobs
        top = [skill for skill, count in word_counts.most_common(8) if count >= 2]
        return top

    # ---- SEO builders ------------------------------------------------------

    def _build_title(self, data: PageData) -> str:
        """Build SEO title tag."""
        month_year = _current_month_year()
        count_prefix = f"{data.total_count}+ " if data.total_count >= 3 else ""

        if data.page_type == PageType.SENIORITY_PAGE:
            return (
                f"{count_prefix}{data.seniority.title()} {data.role_display} Jobs in "
                f"{data.location_display} ({month_year}) — EasyFreeResume"
            )

        if data.page_type == PageType.FILTER_PAGE:
            if data.modifier in SALARY_BANDS:
                return (
                    f"{data.role_display} Jobs in {data.location_display} Paying "
                    f"{data.modifier_label} ({month_year}) — EasyFreeResume"
                )
            return (
                f"{count_prefix}{data.modifier_label} {data.role_display} Jobs in "
                f"{data.location_display} ({month_year}) — EasyFreeResume"
            )

        if data.page_type == PageType.ROLE_HUB:
            return (
                f"{count_prefix}{data.role_display} Jobs ({month_year}) "
                f"| Salary & Market Data — EasyFreeResume"
            )

        if data.page_type == PageType.ROLE_LOCATION:
            return (
                f"{count_prefix}{data.role_display} Jobs in {data.location_display} "
                f"({month_year}) | Salary & Market Data — EasyFreeResume"
            )

        return f"Jobs ({month_year}) — EasyFreeResume"

    def _build_meta_description(self, data: PageData) -> str:
        """Build meta description."""
        role = data.role_display or "jobs"
        loc = data.location_display or "the UK"
        month_year = _current_month_year()

        salary_bit = ""
        if data.salary_stats.median:
            salary_bit = f" Median salary: £{data.salary_stats.median:,}."

        if data.seniority:
            return (
                f"Find {data.seniority} {role} jobs in {loc}. "
                f"{data.total_count}+ openings updated {month_year}.{salary_bit}"
            )

        modifier_bit = f" {data.modifier_label}" if data.modifier_label else ""
        return (
            f"Browse {data.total_count}+{modifier_bit} {role} jobs in {loc}. "
            f"Updated {month_year}.{salary_bit} Filter by salary, contract type, and more."
        )

    def _build_breadcrumbs(self, data: PageData) -> list[dict]:
        """Build breadcrumb trail."""
        crumbs = [{"name": "Home", "url": f"{BASE_URL}/"}]

        if data.page_type == PageType.MAIN_HUB:
            crumbs.append({"name": "Jobs", "url": None})
            return crumbs

        crumbs.append({"name": "Jobs", "url": f"{BASE_URL}/jobs"})

        if data.category:
            cat_display = data.category.replace("-", " ").title()
            crumbs.append({
                "name": cat_display,
                "url": f"{BASE_URL}/jobs/category/{data.category}",
            })

        if data.page_type in (PageType.LOCATION_HUB,):
            crumbs.append({"name": data.location_display, "url": None})
            return crumbs

        if data.role_display:
            if data.location_display and data.page_type != PageType.ROLE_HUB:
                crumbs.append({
                    "name": data.role_display,
                    "url": f"{BASE_URL}/jobs/{data.role_slug}",
                })
                crumbs.append({
                    "name": data.location_display,
                    "url": f"{BASE_URL}/jobs/{data.role_slug}/{data.location_slug}" if data.modifier or data.seniority else None,
                })
            else:
                crumbs.append({"name": data.role_display, "url": None})

        if data.seniority:
            crumbs.append({"name": data.seniority.title(), "url": None})
        elif data.modifier_label and data.modifier:
            crumbs.append({"name": data.modifier_label, "url": None})

        return crumbs

    def _build_structured_data(self, data: PageData) -> list[dict]:
        """Build JSON-LD structured data."""
        schemas = []

        # BreadcrumbList
        if data.breadcrumbs:
            items = []
            for i, crumb in enumerate(data.breadcrumbs):
                item = {
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": crumb["name"],
                }
                if crumb.get("url"):
                    item["item"] = crumb["url"]
                items.append(item)
            schemas.append({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": items,
            })

        # JobPosting for each job (max 20)
        for job in data.jobs[:20]:
            posting = self._build_job_posting_schema(job, data)
            if posting:
                schemas.append(posting)

        # FAQPage
        if data.faqs:
            schemas.append({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": faq["question"],
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq["answer"],
                        },
                    }
                    for faq in data.faqs
                ],
            })

        # WebPage
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": data.title,
            "description": data.meta_description,
            "url": data.canonical_url,
            "isPartOf": {"@type": "WebSite", "name": "EasyFreeResume", "url": BASE_URL},
        })

        return schemas

    def _build_job_posting_schema(self, job: dict, data: PageData) -> dict | None:
        """Build JobPosting schema for a single job."""
        if not job.get("title"):
            return None

        posting: dict[str, Any] = {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": job["title"],
            "url": job.get("url", ""),
            "datePosted": job.get("created", ""),
        }

        # validThrough: +30 days from created
        if job.get("created"):
            try:
                created = datetime.fromisoformat(job["created"].replace("Z", "+00:00"))
                posting["validThrough"] = (created + timedelta(days=30)).isoformat()
            except (ValueError, TypeError):
                pass

        if job.get("company"):
            posting["hiringOrganization"] = {
                "@type": "Organization",
                "name": job["company"],
            }

        if job.get("location"):
            posting["jobLocation"] = {
                "@type": "Place",
                "address": {"@type": "PostalAddress", "addressLocality": job["location"]},
            }

        # Only include salary if NOT predicted
        if not job.get("salary_is_predicted") and job.get("salary_min") and job.get("salary_max"):
            posting["baseSalary"] = {
                "@type": "MonetaryAmount",
                "currency": "GBP",
                "value": {
                    "@type": "QuantitativeValue",
                    "minValue": job["salary_min"],
                    "maxValue": job["salary_max"],
                    "unitText": "YEAR",
                },
            }

        # employmentType based on page modifier
        if data.modifier in ("permanent", "full-time"):
            posting["employmentType"] = "FULL_TIME"
        elif data.modifier == "contract":
            posting["employmentType"] = "CONTRACTOR"
        elif data.modifier == "part-time":
            posting["employmentType"] = "PART_TIME"

        return posting

    # ---- Internal linking --------------------------------------------------

    def _build_related_roles(self, role: dict, location_slug: str | None) -> list[dict]:
        """Build related role links."""
        links = []
        for related_slug in role.get("related_roles", [])[:6]:
            related = self._role_by_slug.get(related_slug)
            if related:
                url = f"/jobs/{related_slug}/{location_slug}" if location_slug else f"/jobs/{related_slug}"
                links.append({"slug": related_slug, "name": related["display_name"], "url": url})
        return links

    def _build_related_locations(self, role_slug: str, loc: dict) -> list[dict]:
        """Build related location links."""
        links = []
        # Nearby locations first
        for nearby_slug in loc.get("nearby", []):
            nearby = self._loc_by_slug.get(nearby_slug)
            if nearby:
                links.append({
                    "slug": nearby_slug,
                    "name": nearby["name"],
                    "url": f"/jobs/{role_slug}/{nearby_slug}",
                })
        # Fill with other major cities
        major = ["london", "manchester", "birmingham", "edinburgh", "bristol"]
        for slug in major:
            if slug != loc["slug"] and slug not in [l["slug"] for l in links]:
                other = self._loc_by_slug.get(slug)
                if other:
                    links.append({
                        "slug": slug,
                        "name": other["name"],
                        "url": f"/jobs/{role_slug}/{slug}",
                    })
            if len(links) >= 5:
                break
        return links

    def _build_internal_links(self, data: PageData) -> dict:
        """Build parent/sibling/child internal links."""
        links: dict[str, Any] = {}

        # Parent link
        if data.page_type in (PageType.FILTER_PAGE, PageType.SENIORITY_PAGE):
            links["parent"] = {
                "url": f"/jobs/{data.role_slug}/{data.location_slug}",
                "label": f"All {data.role_display} jobs in {data.location_display}",
            }
        elif data.page_type == PageType.ROLE_LOCATION:
            links["parent"] = {
                "url": f"/jobs/{data.role_slug}",
                "label": f"All {data.role_display} jobs",
            }
        elif data.page_type == PageType.ROLE_HUB:
            links["parent"] = {"url": "/jobs", "label": "All jobs"}

        # Sibling links (opposite modifiers)
        if data.page_type == PageType.FILTER_PAGE and data.modifier:
            siblings = []
            opposite_map = {
                "permanent": "contract",
                "contract": "permanent",
                "full-time": "part-time",
                "part-time": "full-time",
            }
            opp = opposite_map.get(data.modifier)
            if opp:
                opp_label = FILTER_MODIFIERS.get(opp, {}).get("label", opp.title())
                siblings.append({
                    "url": f"/jobs/{data.role_slug}/{data.location_slug}/{opp}",
                    "label": f"{opp_label} {data.role_display} jobs",
                })
            # Adjacent salary bands
            if data.modifier in SALARY_BANDS:
                bands = list(SALARY_BANDS.keys())
                idx = bands.index(data.modifier)
                if idx > 0:
                    prev_band = bands[idx - 1]
                    siblings.append({
                        "url": f"/jobs/{data.role_slug}/{data.location_slug}/{prev_band}",
                        "label": f"£{SALARY_BANDS[prev_band] // 1000}k+ {data.role_display} jobs",
                    })
                if idx < len(bands) - 1:
                    next_band = bands[idx + 1]
                    siblings.append({
                        "url": f"/jobs/{data.role_slug}/{data.location_slug}/{next_band}",
                        "label": f"£{SALARY_BANDS[next_band] // 1000}k+ {data.role_display} jobs",
                    })
            links["siblings"] = siblings

        # Seniority siblings
        if data.page_type == PageType.SENIORITY_PAGE:
            siblings = []
            for level in SENIORITY_PREFIXES:
                if level != data.seniority:
                    siblings.append({
                        "url": f"/jobs/{level}/{data.role_slug}/{data.location_slug}",
                        "label": f"{level.title()} {data.role_display} jobs",
                    })
            links["siblings"] = siblings

        # CTA
        links["cta"] = {"url": "/templates", "label": "Build your resume"}

        return links

    # ---- Caching -----------------------------------------------------------

    def _get_cache_path(self, page_type: PageType, page: int = 1, **kwargs) -> Path | None:
        """Map page type + params to filesystem cache path."""
        parts = [page_type.value]
        for key in sorted(kwargs.keys()):
            if kwargs[key] is not None:
                parts.append(f"{key}={kwargs[key]}")
        if page > 1:
            parts.append(f"page={page}")

        filename = hashlib.md5("_".join(parts).encode()).hexdigest() + ".html"
        return self.cache_dir / page_type.value / filename

    def _is_cache_valid(self, cache_path: Path, page_type: PageType) -> bool:
        """Check if cache file exists and is within TTL."""
        if not cache_path.is_file():
            return False
        try:
            age = time.time() - cache_path.stat().st_mtime
            ttl = self._get_cache_ttl(page_type)
            return age < ttl
        except OSError:
            return False

    def _get_cache_ttl(self, page_type: PageType) -> int:
        """Variable TTL by page type."""
        if page_type in (PageType.ROLE_HUB, PageType.LOCATION_HUB, PageType.CATEGORY_HUB, PageType.MAIN_HUB):
            return self.CACHE_TTL["hub"]
        # Check if filter page is freshness type (handled by caller providing modifier)
        return self.CACHE_TTL["default"]

    def _write_cache(self, cache_path: Path, html: str) -> None:
        """Write HTML to cache file."""
        try:
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(html, encoding="utf-8")
        except OSError as e:
            logger.warning(f"Failed to write cache {cache_path}: {e}")

    # ---- HTML rendering ----------------------------------------------------

    def _render_html(self, page_type: PageType, data: PageData) -> str | None:
        """Render Jinja2 template for page type."""
        template_map = {
            PageType.ROLE_LOCATION: "landing_page.html",
            PageType.ROLE_HUB: "role_hub.html",
            PageType.LOCATION_HUB: "location_hub.html",
            PageType.FILTER_PAGE: "landing_page.html",  # shares template with role_location
            PageType.SENIORITY_PAGE: "landing_page.html",
            PageType.CATEGORY_HUB: "category_hub.html",
            PageType.COMPANY_PAGE: "company_page.html",
            PageType.MAIN_HUB: "main_hub.html",
        }
        template_name = template_map.get(page_type)
        if not template_name:
            return None

        try:
            template = self.jinja_env.get_template(template_name)
            return template.render(
                data=data,
                page_data_json=json.dumps(data.to_dict(), default=str),
                vite_manifest=self.vite_manifest,
                structured_data=data.structured_data,
            )
        except Exception as e:
            logger.error(f"Template render error for {template_name}: {e}")
            return None


# =============================================================================
# Utility functions
# =============================================================================

def _current_month_year() -> str:
    """Return e.g. 'Feb 2026'."""
    now = datetime.now(timezone.utc)
    return now.strftime("%b %Y")


def load_vite_manifest(static_dir: str) -> dict:
    """Load Vite manifest.json for hashed asset paths."""
    manifest_path = os.path.join(static_dir, ".vite", "manifest.json")
    if not os.path.isfile(manifest_path):
        # Try alternate location
        manifest_path = os.path.join(static_dir, "manifest.json")
    if os.path.isfile(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            logger.warning(f"Failed to load Vite manifest: {e}")
    return {}
