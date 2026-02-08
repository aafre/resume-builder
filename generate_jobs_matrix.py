"""
Generate the role × location matrix for Jobs pSEO pages.

Reads TITLE_SYNONYMS from job_engine.py, crosses with UK locations,
maps roles to categories, and outputs jobs_matrix.json.

Usage:
    python generate_jobs_matrix.py
"""

import json
import re
import sys
from pathlib import Path

from job_engine import TITLE_SYNONYMS


# =============================================================================
# Locations — 20 UK cities + remote
# =============================================================================

LOCATIONS: list[dict[str, str | list[str]]] = [
    {"name": "London", "slug": "london", "region": "south-east", "nearby": ["reading", "cambridge", "brighton"]},
    {"name": "Manchester", "slug": "manchester", "region": "north-west", "nearby": ["liverpool", "leeds", "sheffield"]},
    {"name": "Birmingham", "slug": "birmingham", "region": "west-midlands", "nearby": ["coventry", "nottingham", "leicester"]},
    {"name": "Leeds", "slug": "leeds", "region": "yorkshire", "nearby": ["manchester", "sheffield", "york"]},
    {"name": "Glasgow", "slug": "glasgow", "region": "scotland", "nearby": ["edinburgh"]},
    {"name": "Edinburgh", "slug": "edinburgh", "region": "scotland", "nearby": ["glasgow"]},
    {"name": "Bristol", "slug": "bristol", "region": "south-west", "nearby": ["cardiff", "bath"]},
    {"name": "Liverpool", "slug": "liverpool", "region": "north-west", "nearby": ["manchester"]},
    {"name": "Sheffield", "slug": "sheffield", "region": "yorkshire", "nearby": ["leeds", "manchester", "nottingham"]},
    {"name": "Newcastle", "slug": "newcastle", "region": "north-east", "nearby": []},
    {"name": "Nottingham", "slug": "nottingham", "region": "east-midlands", "nearby": ["birmingham", "sheffield", "leicester"]},
    {"name": "Cardiff", "slug": "cardiff", "region": "wales", "nearby": ["bristol"]},
    {"name": "Belfast", "slug": "belfast", "region": "northern-ireland", "nearby": []},
    {"name": "Leicester", "slug": "leicester", "region": "east-midlands", "nearby": ["nottingham", "birmingham", "coventry"]},
    {"name": "Coventry", "slug": "coventry", "region": "west-midlands", "nearby": ["birmingham", "leicester"]},
    {"name": "Cambridge", "slug": "cambridge", "region": "east", "nearby": ["london"]},
    {"name": "Reading", "slug": "reading", "region": "south-east", "nearby": ["london"]},
    {"name": "Brighton", "slug": "brighton", "region": "south-east", "nearby": ["london"]},
    {"name": "York", "slug": "york", "region": "yorkshire", "nearby": ["leeds"]},
    {"name": "Bath", "slug": "bath", "region": "south-west", "nearby": ["bristol"]},
    {"name": "Remote", "slug": "remote", "region": "remote", "nearby": []},
]

LOCATION_BY_SLUG = {loc["slug"]: loc for loc in LOCATIONS}

# =============================================================================
# Role → Category mapping
# =============================================================================

ROLE_CATEGORIES: dict[str, str] = {
    # Engineering
    "software engineer": "engineering",
    "software developer": "engineering",
    "frontend developer": "engineering",
    "frontend engineer": "engineering",
    "backend developer": "engineering",
    "backend engineer": "engineering",
    "full stack developer": "engineering",
    "full stack engineer": "engineering",
    "web developer": "engineering",
    "devops engineer": "engineering",
    "sre": "engineering",
    "site reliability engineer": "engineering",
    "platform engineer": "engineering",
    "cloud engineer": "engineering",
    "mobile developer": "engineering",
    "ios developer": "engineering",
    "android developer": "engineering",
    "embedded engineer": "engineering",
    "firmware engineer": "engineering",
    "qa engineer": "qa",
    "sdet": "qa",
    "security engineer": "security",
    "machine learning engineer": "engineering",
    "ml engineer": "engineering",
    "ai engineer": "engineering",
    # Data
    "data scientist": "data",
    "data analyst": "data",
    "data engineer": "data",
    "business analyst": "data",
    "business intelligence analyst": "data",
    # Product / Design
    "product manager": "management",
    "product owner": "management",
    "program manager": "management",
    "project manager": "management",
    "scrum master": "management",
    "ux designer": "design",
    "ui designer": "design",
    "product designer": "design",
    "graphic designer": "design",
    # Marketing / Sales
    "marketing manager": "marketing",
    "digital marketing manager": "marketing",
    "content writer": "marketing",
    "copywriter": "marketing",
    "seo specialist": "marketing",
    "sales representative": "marketing",
    "account executive": "marketing",
    "business development representative": "marketing",
    # Operations / Support
    "customer service representative": "support",
    "customer success manager": "support",
    "operations manager": "management",
    "office manager": "support",
    "executive assistant": "support",
    # Finance / Accounting
    "accountant": "finance",
    "financial analyst": "finance",
    "controller": "finance",
    # Healthcare
    "registered nurse": "healthcare",
    "nurse practitioner": "healthcare",
    "medical assistant": "healthcare",
    # HR
    "recruiter": "hr",
    "hr manager": "hr",
    "hr business partner": "hr",
    # Skills / Languages → same category as their primary title target
    "python": "engineering",
    "java": "engineering",
    "javascript": "engineering",
    "typescript": "engineering",
    "react": "engineering",
    "angular": "engineering",
    "vue": "engineering",
    "node": "engineering",
    "golang": "engineering",
    "go": "engineering",
    "rust": "engineering",
    "ruby": "engineering",
    "php": "engineering",
    "swift": "engineering",
    "kotlin": "engineering",
    "c++": "engineering",
    "c#": "engineering",
    "sql": "data",
    "aws": "engineering",
    "docker": "engineering",
    "kubernetes": "engineering",
    "terraform": "engineering",
}

ALL_CATEGORIES = sorted(set(ROLE_CATEGORIES.values()))

# =============================================================================
# Filter modifiers for URL patterns
# =============================================================================

FILTER_MODIFIERS: dict[str, dict] = {
    # Contract type
    "permanent": {"adzuna_param": "permanent", "adzuna_value": 1, "label": "Permanent"},
    "contract": {"adzuna_param": "contract", "adzuna_value": 1, "label": "Contract"},
    # Schedule
    "full-time": {"adzuna_param": "full_time", "adzuna_value": 1, "label": "Full-time"},
    "part-time": {"adzuna_param": "part_time", "adzuna_value": 1, "label": "Part-time"},
    # Freshness
    "posted-today": {"adzuna_param": "max_days_old", "adzuna_value": 1, "label": "Posted Today"},
    "posted-this-week": {"adzuna_param": "max_days_old", "adzuna_value": 7, "label": "Posted This Week"},
}

SENIORITY_PREFIXES = ["junior", "mid", "senior", "lead"]

SALARY_BANDS: dict[str, int] = {
    "20k-plus": 20000,
    "30k-plus": 30000,
    "40k-plus": 40000,
    "50k-plus": 50000,
    "60k-plus": 60000,
    "80k-plus": 80000,
    "100k-plus": 100000,
}

# =============================================================================
# Slug generation
# =============================================================================

_SLUG_RE = re.compile(r"[^a-z0-9]+")


def to_slug(name: str) -> str:
    """Convert a role or location name to a URL-safe slug."""
    slug = _SLUG_RE.sub("-", name.lower()).strip("-")
    return slug


# =============================================================================
# Related roles (same category, excluding self)
# =============================================================================

def _build_related_roles(role_key: str, category: str) -> list[str]:
    """Return slugs of related roles in the same category (max 8)."""
    related = []
    # First: synonym targets from TITLE_SYNONYMS
    for syn in TITLE_SYNONYMS.get(role_key, []):
        slug = to_slug(syn)
        if slug != to_slug(role_key) and slug not in related:
            related.append(slug)
    # Then: same-category roles
    for other_key, other_cat in ROLE_CATEGORIES.items():
        if other_cat == category and other_key != role_key:
            slug = to_slug(other_key)
            if slug not in related:
                related.append(slug)
        if len(related) >= 8:
            break
    return related[:8]


# =============================================================================
# Main matrix generation
# =============================================================================

def generate_matrix() -> dict:
    """Generate the complete jobs matrix."""
    # Deduplicate roles by slug (e.g. "go" and "golang" both → "go" slug)
    seen_slugs: set[str] = set()
    roles: list[dict] = []

    for key in TITLE_SYNONYMS:
        slug = to_slug(key)
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        category = ROLE_CATEGORIES.get(key, "engineering")
        display_name = key.title()
        # Special display names for acronyms/tech
        if key in ("sre", "sdet", "qa engineer", "ml engineer", "ai engineer"):
            display_name = key.upper() if len(key) <= 4 else key.title()
        if key in ("c++", "c#"):
            display_name = key
        if key in ("aws", "sql", "php", "ios developer"):
            parts = key.split()
            display_name = " ".join(p.upper() if len(p) <= 3 and p.isalpha() else p.title() for p in parts)

        roles.append({
            "key": key,
            "slug": slug,
            "display_name": display_name,
            "category": category,
            "related_roles": _build_related_roles(key, category),
        })

    locations = []
    for loc in LOCATIONS:
        locations.append({
            "name": loc["name"],
            "slug": loc["slug"],
            "region": loc["region"],
            "nearby": loc["nearby"],
        })

    # Build combinations count
    combo_count = len(roles) * len(locations)

    return {
        "version": 1,
        "roles": roles,
        "locations": locations,
        "categories": ALL_CATEGORIES,
        "filter_modifiers": FILTER_MODIFIERS,
        "seniority_prefixes": SENIORITY_PREFIXES,
        "salary_bands": SALARY_BANDS,
        "combinations_count": combo_count,
        "meta": {
            "total_roles": len(roles),
            "total_locations": len(locations),
            "total_categories": len(ALL_CATEGORIES),
        },
    }


def validate_matrix(matrix: dict) -> list[str]:
    """Validate the generated matrix. Returns list of errors (empty = valid)."""
    errors = []
    slug_re = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")

    # Check slug uniqueness
    role_slugs = [r["slug"] for r in matrix["roles"]]
    if len(role_slugs) != len(set(role_slugs)):
        dupes = [s for s in role_slugs if role_slugs.count(s) > 1]
        errors.append(f"Duplicate role slugs: {set(dupes)}")

    loc_slugs = [l["slug"] for l in matrix["locations"]]
    if len(loc_slugs) != len(set(loc_slugs)):
        dupes = [s for s in loc_slugs if loc_slugs.count(s) > 1]
        errors.append(f"Duplicate location slugs: {set(dupes)}")

    # Check slug format
    for role in matrix["roles"]:
        if not slug_re.match(role["slug"]):
            errors.append(f"Invalid role slug: {role['slug']}")

    for loc in matrix["locations"]:
        if not slug_re.match(loc["slug"]):
            errors.append(f"Invalid location slug: {loc['slug']}")

    # Check every role has a category
    for role in matrix["roles"]:
        if role["category"] not in matrix["categories"]:
            errors.append(f"Role '{role['key']}' has unknown category '{role['category']}'")

    # Check related roles reference valid slugs
    valid_role_slugs = set(role_slugs)
    for role in matrix["roles"]:
        for related in role["related_roles"]:
            if related not in valid_role_slugs:
                # Related roles can include synonym targets not in the matrix
                pass

    # Check nearby locations reference valid slugs
    valid_loc_slugs = set(loc_slugs)
    for loc in matrix["locations"]:
        for nearby in loc["nearby"]:
            if nearby not in valid_loc_slugs:
                errors.append(f"Location '{loc['slug']}' has invalid nearby: '{nearby}'")

    # Check all TITLE_SYNONYMS keys are covered
    for key in TITLE_SYNONYMS:
        slug = to_slug(key)
        if slug not in valid_role_slugs:
            errors.append(f"TITLE_SYNONYMS key '{key}' (slug: {slug}) not in matrix roles")

    return errors


def main():
    matrix = generate_matrix()

    # Validate
    errors = validate_matrix(matrix)
    if errors:
        print("Validation errors:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        sys.exit(1)

    # Write output
    output_path = Path(__file__).parent / "jobs_matrix.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(matrix, f, indent=2, ensure_ascii=False)

    print(f"Generated {output_path}")
    print(f"  Roles: {matrix['meta']['total_roles']}")
    print(f"  Locations: {matrix['meta']['total_locations']}")
    print(f"  Categories: {matrix['meta']['total_categories']}")
    print(f"  Combinations: {matrix['combinations_count']}")


if __name__ == "__main__":
    main()
