"""
Job feeds: third-party sources of job listings (CONTEXT.md "Job feed").

Every feed has the same small surface, so the search flow never talks to a
feed's API directly:

    name        "adzuna"; stamped on every listing as `feed`
    countries   lowercase ISO-2 codes the feed can search
    configured  True when its credentials are present
    search(context, query) -> (listings, total_available)
        raises FeedQuotaExceeded on a quota/rate-limit response,
        FeedError on any other failure

Listings are normalised dicts: title, company, location, salary_min,
salary_max, salary_is_predicted, url, created, feed, plus the internal
`_description` (used for scoring, stripped before responses).
"""

import os
from typing import Protocol

import requests as http_requests


class FeedError(Exception):
    """A feed call failed (network, HTTP error, bad payload)."""


class FeedQuotaExceeded(FeedError):
    """A feed refused the call because its quota or rate limit is used up."""


class JobFeed(Protocol):
    name: str
    countries: frozenset[str]

    @property
    def configured(self) -> bool: ...

    def search(self, context, query: str) -> tuple[list[dict], int]: ...


ADZUNA_COUNTRIES = frozenset({
    "gb", "us", "at", "au", "be", "br", "ca", "ch", "de", "es",
    "fr", "in", "it", "mx", "nl", "nz", "pl", "sg", "za",
})


class AdzunaFeed:
    name = "adzuna"
    countries = ADZUNA_COUNTRIES
    DEFAULT_RESULTS_PER_PAGE = 20

    def __init__(self, app_id: str, app_key: str):
        self.app_id = app_id
        self.app_key = app_key

    @classmethod
    def from_env(cls) -> "AdzunaFeed":
        return cls(os.getenv("ADZUNA_APP_ID", ""), os.getenv("ADZUNA_APP_KEY", ""))

    @property
    def configured(self) -> bool:
        return bool(self.app_id and self.app_key)

    def params(self, context, query: str) -> dict:
        """Adzuna query params for a MatchContext and search term."""
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "results_per_page": context.results_per_page or self.DEFAULT_RESULTS_PER_PAGE,
            "sort_by": context.sort_by if context.sort_by in ("relevance", "salary", "date") else "relevance",
            "salary_include_unknown": "1",
        }
        # what_phrase (exact multi-word match) replaces what
        if context.what_phrase:
            params["what_phrase"] = context.what_phrase
        else:
            params["what"] = query
        optional = {
            "where": context.location,
            "category": context.category,
            "what_or": context.what_or,
            "title_only": "1" if context.title_only else "",
            "max_days_old": str(context.max_days_old) if context.max_days_old else "",
            "salary_min": str(context.salary_min) if context.salary_min else "",
            "salary_max": str(context.salary_max) if context.salary_max else "",
            "full_time": "1" if context.full_time else "",
            "permanent": "1" if context.permanent else "",
            "contract": "1" if context.contract else "",
            "part_time": "1" if context.part_time else "",
            "distance": str(context.distance) if context.distance else "",
            "sort_dir": context.sort_dir if context.sort_dir in ("up", "down") else "",
            "what_exclude": context.what_exclude,
            "company": context.company,
        }
        params.update({k: v for k, v in optional.items() if v})
        return params

    def search(self, context, query: str) -> tuple[list[dict], int]:
        page = max(context.page, 1)
        try:
            resp = http_requests.get(
                f"https://api.adzuna.com/v1/api/jobs/{context.country}/search/{page}",
                params=self.params(context, query),
                timeout=5,
            )
        except http_requests.RequestException as e:
            raise FeedError(f"adzuna request failed: {e}") from e

        # ponytail: Adzuna documents no quota error code; 429 is the standard one.
        if resp.status_code == 429:
            raise FeedQuotaExceeded("adzuna quota or rate limit reached")
        try:
            resp.raise_for_status()
            raw = resp.json()
        except (http_requests.RequestException, ValueError) as e:
            raise FeedError(f"adzuna error: {e}") from e

        listings = [
            {
                "title": r.get("title", ""),
                "company": (r.get("company") or {}).get("display_name", ""),
                "location": (r.get("location") or {}).get("display_name", ""),
                "salary_min": r.get("salary_min"),
                "salary_max": r.get("salary_max"),
                # Adzuna sends "0"/"1" strings; bool("0") would be True
                "salary_is_predicted": r.get("salary_is_predicted") in (1, "1"),
                "url": r.get("redirect_url", ""),
                "created": r.get("created", ""),
                "feed": self.name,
                "_description": r.get("description", ""),
            }
            for r in raw.get("results", [])
        ]
        return listings, raw.get("count", 0)
