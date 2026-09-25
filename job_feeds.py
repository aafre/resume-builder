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
    search_url(query, location, country) -> the feed's own public search page,
        used as the outbound link when no listings can be served

Listings are normalised dicts: title, company, location, salary_min,
salary_max, salary_is_predicted, url, created, feed, plus the internal
`_description` (used for scoring, stripped before responses).
"""

import logging
import os
import re
from datetime import datetime, timezone
from typing import Protocol
from urllib.parse import urlencode

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

    def search_url(self, query: str, location: str, country: str) -> str: ...


# Feeds that hit their quota are skipped until the UTC date changes.
# ponytail: per-process memory; each worker learns about exhaustion on its own
# first 429, which costs one extra call per worker per day.
_exhausted_on: dict[str, str] = {}


def _utc_today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def is_exhausted(feed_name: str) -> bool:
    return _exhausted_on.get(feed_name) == _utc_today()


def mark_exhausted(feed_name: str) -> None:
    _exhausted_on[feed_name] = _utc_today()
    logging.warning(f"job_quota_exhausted feed={feed_name}: skipped until next UTC day")


_CREDENTIAL_PARAMS = re.compile(r"(app_id|app_key|api_key|key)=[^&\s'\"]+", re.IGNORECASE)


def _redact(message: object) -> str:
    """Error text from requests carries the full URL; strip credentials before it reaches logs."""
    return _CREDENTIAL_PARAMS.sub(lambda m: f"{m.group(1)}=[redacted]", str(message))


ADZUNA_COUNTRIES = frozenset({
    "gb", "us", "at", "au", "be", "br", "ca", "ch", "de", "es",
    "fr", "in", "it", "mx", "nl", "nz", "pl", "sg", "za",
})


# Adzuna's public site per country, for the outbound search link.
ADZUNA_SITES = {
    "gb": "www.adzuna.co.uk", "us": "www.adzuna.com", "at": "www.adzuna.at",
    "au": "www.adzuna.com.au", "be": "www.adzuna.be", "br": "www.adzuna.com.br",
    "ca": "www.adzuna.ca", "ch": "www.adzuna.ch", "de": "www.adzuna.de",
    "es": "www.adzuna.es", "fr": "www.adzuna.fr", "in": "www.adzuna.in",
    "it": "www.adzuna.it", "mx": "www.adzuna.com.mx", "nl": "www.adzuna.nl",
    "nz": "www.adzuna.co.nz", "pl": "www.adzuna.pl", "sg": "www.adzuna.sg",
    "za": "www.adzuna.co.za",
}


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

    def search_url(self, query: str, location: str, country: str) -> str:
        params = {"q": query}
        if location:
            params["w"] = location
        return f"https://{ADZUNA_SITES.get(country, ADZUNA_SITES['us'])}/search?{urlencode(params)}"

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
            # from None: the chained exception's message holds the unredacted URL
            raise FeedError(f"adzuna request failed: {_redact(e)}") from None

        # ponytail: Adzuna documents no quota error code; 429 is the standard one.
        if resp.status_code == 429:
            raise FeedQuotaExceeded("adzuna quota or rate limit reached")
        try:
            resp.raise_for_status()
            raw = resp.json()
        except (http_requests.RequestException, ValueError) as e:
            raise FeedError(f"adzuna error: {_redact(e)}") from None

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
