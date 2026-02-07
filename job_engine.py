"""
Job Matching Engine — 3-tier search with backend re-ranking.

Tier 1: Primary title query (exact Adzuna search)
Tier 2: Static synonym expansion (catches standard variations)
Tier 3: AI fallback via Supabase Edge Function (eliminates zero-results for niche titles)

All tiers feed into JobScorer which ranks results by resume fit.
"""

import logging
import time
import math
from dataclasses import dataclass, field
from datetime import datetime, timezone

import requests as http_requests


# =============================================================================
# Title Synonym Table — Tier 2
# =============================================================================

TITLE_SYNONYMS: dict[str, list[str]] = {
    # Engineering
    "software engineer": ["software developer", "application developer", "programmer"],
    "software developer": ["software engineer", "application developer"],
    "frontend developer": ["front end developer", "react developer", "ui developer"],
    "frontend engineer": ["front end engineer", "ui engineer", "react developer"],
    "backend developer": ["back end developer", "server side developer", "api developer"],
    "backend engineer": ["back end engineer", "server side engineer"],
    "full stack developer": ["fullstack developer", "full stack engineer", "web developer"],
    "full stack engineer": ["fullstack engineer", "full stack developer"],
    "web developer": ["frontend developer", "full stack developer"],
    "devops engineer": ["site reliability engineer", "platform engineer", "infrastructure engineer"],
    "sre": ["site reliability engineer", "devops engineer", "platform engineer"],
    "site reliability engineer": ["sre", "devops engineer", "platform engineer"],
    "platform engineer": ["devops engineer", "infrastructure engineer", "cloud engineer"],
    "cloud engineer": ["cloud architect", "devops engineer", "infrastructure engineer"],
    "mobile developer": ["ios developer", "android developer", "mobile engineer"],
    "ios developer": ["mobile developer", "swift developer"],
    "android developer": ["mobile developer", "kotlin developer"],
    "embedded engineer": ["embedded software engineer", "firmware engineer"],
    "firmware engineer": ["embedded engineer", "embedded software engineer"],
    "qa engineer": ["quality assurance engineer", "test engineer", "sdet"],
    "sdet": ["qa engineer", "test automation engineer", "quality engineer"],
    "security engineer": ["cybersecurity engineer", "infosec engineer", "application security engineer"],
    "machine learning engineer": ["ml engineer", "ai engineer", "deep learning engineer"],
    "ml engineer": ["machine learning engineer", "ai engineer"],
    "ai engineer": ["machine learning engineer", "ml engineer"],

    # Data
    "data scientist": ["machine learning engineer", "data analyst", "research scientist"],
    "data analyst": ["business analyst", "data scientist", "analytics engineer"],
    "data engineer": ["etl developer", "analytics engineer", "big data engineer"],
    "business analyst": ["data analyst", "business intelligence analyst", "systems analyst"],
    "business intelligence analyst": ["bi analyst", "data analyst", "reporting analyst"],

    # Product / Design
    "product manager": ["product owner", "program manager"],
    "product owner": ["product manager", "scrum master"],
    "program manager": ["project manager", "product manager", "technical program manager"],
    "project manager": ["program manager", "project coordinator"],
    "scrum master": ["agile coach", "product owner"],
    "ux designer": ["ui designer", "product designer", "user experience designer"],
    "ui designer": ["ux designer", "visual designer", "product designer"],
    "product designer": ["ux designer", "ui designer"],
    "graphic designer": ["visual designer", "creative designer", "brand designer"],

    # Marketing / Sales
    "marketing manager": ["digital marketing manager", "marketing director", "growth manager"],
    "digital marketing manager": ["marketing manager", "online marketing manager"],
    "content writer": ["copywriter", "content creator", "content strategist"],
    "copywriter": ["content writer", "creative writer"],
    "seo specialist": ["seo analyst", "seo manager", "digital marketing specialist"],
    "sales representative": ["account executive", "sales associate", "business development representative"],
    "account executive": ["sales representative", "account manager"],
    "business development representative": ["bdr", "sales development representative", "sdr"],

    # Operations / Support
    "customer service representative": ["customer support specialist", "customer success associate"],
    "customer success manager": ["account manager", "client success manager"],
    "operations manager": ["operations director", "operations coordinator"],
    "office manager": ["administrative manager", "office coordinator"],
    "executive assistant": ["administrative assistant", "personal assistant"],

    # Finance / Accounting
    "accountant": ["staff accountant", "accounting specialist", "bookkeeper"],
    "financial analyst": ["finance analyst", "investment analyst"],
    "controller": ["accounting manager", "finance manager"],

    # Healthcare
    "registered nurse": ["rn", "staff nurse", "clinical nurse"],
    "nurse practitioner": ["np", "advanced practice nurse", "arnp"],
    "medical assistant": ["clinical assistant", "healthcare assistant"],

    # HR
    "recruiter": ["talent acquisition specialist", "hr recruiter", "sourcer"],
    "hr manager": ["human resources manager", "people manager", "hr business partner"],
    "hr business partner": ["hrbp", "hr manager", "people partner"],
}


# =============================================================================
# Skill Alias Table — used for fuzzy skill matching in scoring
# =============================================================================

SKILL_ALIASES: dict[str, list[str]] = {
    "javascript": ["js", "es6", "es2015", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py", "python3"],
    "react": ["reactjs", "react.js"],
    "angular": ["angularjs", "angular.js"],
    "vue": ["vuejs", "vue.js"],
    "node": ["nodejs", "node.js"],
    "next": ["nextjs", "next.js"],
    "express": ["expressjs", "express.js"],
    "kubernetes": ["k8s"],
    "docker": ["containerization", "containers"],
    "aws": ["amazon web services"],
    "gcp": ["google cloud", "google cloud platform"],
    "azure": ["microsoft azure"],
    "c#": ["csharp", "c sharp", ".net"],
    "c++": ["cpp"],
    "golang": ["go"],
    "ruby on rails": ["rails", "ror"],
    "postgresql": ["postgres", "psql"],
    "mongodb": ["mongo"],
    "mysql": ["mariadb"],
    "redis": ["redis cache"],
    "elasticsearch": ["elastic", "es"],
    "graphql": ["gql"],
    "rest": ["restful", "rest api", "restful api"],
    "ci/cd": ["cicd", "continuous integration", "continuous deployment"],
    "terraform": ["tf", "iac"],
    "ansible": ["configuration management"],
    "jenkins": ["ci server"],
    "github actions": ["gha"],
    "machine learning": ["ml"],
    "deep learning": ["dl"],
    "natural language processing": ["nlp"],
    "computer vision": ["cv"],
    "tensorflow": ["tf"],
    "pytorch": ["torch"],
    "pandas": ["pd"],
    "sql": ["structured query language"],
    "nosql": ["no-sql"],
    "html": ["html5"],
    "css": ["css3", "stylesheets"],
    "sass": ["scss"],
    "tailwind": ["tailwindcss", "tailwind css"],
    "figma": ["figma design"],
    "sketch": ["sketch app"],
    "jira": ["atlassian jira"],
    "agile": ["agile methodology", "scrum", "kanban"],
    "linux": ["unix", "bash"],
    "git": ["github", "gitlab", "version control"],
    "power bi": ["powerbi"],
    "tableau": ["tableau desktop"],
    "excel": ["microsoft excel", "spreadsheets"],
    "salesforce": ["sfdc", "sf"],
    "sap": ["sap erp"],
}


# =============================================================================
# Data Classes
# =============================================================================

@dataclass
class MatchContext:
    """Resume context passed from frontend for scoring."""
    query: str
    location: str = ""
    country: str = "us"
    category: str = ""
    skills: list[str] = field(default_factory=list)
    seniority_level: str = ""
    years_experience: int = 0
    salary_min: int = 0
    title_only: bool = False
    max_days_old: int = 0
    full_time: bool = False
    permanent: bool = False
    sort_by: str = "relevance"


# =============================================================================
# AI Fallback — Tier 3 (Supabase Edge Function)
# =============================================================================

# Cache for AI-generated search terms (key=title, value=(terms, timestamp))
_ai_cache: dict[str, tuple[list[str], float]] = {}
_AI_CACHE_TTL = 900  # 15 minutes


def get_ai_search_terms(title: str, supabase) -> list[str]:
    """
    Call Supabase Edge Function to translate niche title into standard job titles.
    Returns [] on any failure (graceful degradation).
    """
    if not supabase:
        return []

    # Check cache
    cache_key = title.lower().strip()
    now = time.time()
    cached = _ai_cache.get(cache_key)
    if cached and (now - cached[1]) < _AI_CACHE_TTL:
        return cached[0]

    try:
        logging.info(f"Low results for '{title}' — asking AI for standard titles")
        response = supabase.functions.invoke(
            "translate-job-title",
            invoke_options={"body": {"title": title}},
        )

        # supabase-py returns bytes or str
        if isinstance(response, bytes):
            import json
            data = json.loads(response.decode("utf-8"))
        elif isinstance(response, str):
            import json
            data = json.loads(response)
        elif isinstance(response, dict):
            data = response
        else:
            logging.warning(f"Unexpected AI response type: {type(response)}")
            return []

        terms = data.get("terms", [])
        if isinstance(terms, list) and len(terms) > 0:
            terms = [t.strip() for t in terms if isinstance(t, str) and t.strip()][:3]
            _ai_cache[cache_key] = (terms, now)
            logging.info(f"AI translated '{title}' → {terms}")
            return terms

        return []

    except Exception as e:
        logging.warning(f"AI title translation failed (graceful skip): {e}")
        return []


# =============================================================================
# JobScorer — 0-100 scoring algorithm
# =============================================================================

def _build_alias_lookup() -> dict[str, set[str]]:
    """Build bidirectional alias map: every term → set of all equivalent terms."""
    lookup: dict[str, set[str]] = {}
    for canonical, aliases in SKILL_ALIASES.items():
        all_terms = {canonical.lower()} | {a.lower() for a in aliases}
        for term in all_terms:
            if term not in lookup:
                lookup[term] = set()
            lookup[term].update(all_terms)
    return lookup

_ALIAS_LOOKUP = _build_alias_lookup()


class JobScorer:
    """Score a job result against resume context (0-100 points)."""

    def __init__(self, context: MatchContext):
        self.query = context.query.lower().strip()
        self.query_words = set(self.query.split())
        self.skills = [s.lower().strip() for s in context.skills if s.strip()]
        self.salary_min = context.salary_min
        self.seniority = context.seniority_level.lower() if context.seniority_level else ""

        # Pre-compute synonym set for the query
        self.synonym_titles: set[str] = set()
        for title, syns in TITLE_SYNONYMS.items():
            if title == self.query:
                self.synonym_titles.update(s.lower() for s in syns)
            elif self.query in [s.lower() for s in syns]:
                self.synonym_titles.add(title)

    def score(self, job: dict) -> float:
        """Score a single job dict. Returns 0-100."""
        title_score = self._score_title(job.get("title", ""))
        skill_score = self._score_skills(job.get("_description", ""))
        salary_score = self._score_salary(job)
        freshness_score = self._score_freshness(job.get("created", ""))
        return round(title_score + skill_score + salary_score + freshness_score, 1)

    def _score_title(self, job_title: str) -> float:
        """Title match: 0-40 points."""
        jt = job_title.lower().strip()
        if not jt:
            return 0

        # Exact substring match
        if self.query in jt or jt in self.query:
            return 40

        # Synonym hit (check before word overlap — synonyms often share words)
        for syn in self.synonym_titles:
            if syn in jt or jt in syn:
                return 30

        # Word overlap
        jt_words = set(jt.split())
        overlap = self.query_words & jt_words
        if overlap:
            ratio = len(overlap) / max(len(self.query_words), 1)
            word_score = min(ratio * 35, 35)
            return max(word_score, 15)  # at least 15 if any word matches

        return 0

    def _score_skills(self, description: str) -> float:
        """Skill overlap: 0-30 points. No skills provided = neutral 15."""
        if not self.skills:
            return 15

        desc_lower = description.lower()
        if not desc_lower:
            return 0

        matched = 0
        for skill in self.skills:
            # Direct match
            if skill in desc_lower:
                matched += 1
                continue
            # Alias match
            aliases = _ALIAS_LOOKUP.get(skill, set())
            if any(alias in desc_lower for alias in aliases):
                matched += 1

        return round((matched / len(self.skills)) * 30, 1)

    def _score_salary(self, job: dict) -> float:
        """Salary quality: 0-20 points."""
        salary_min = job.get("salary_min")
        salary_max = job.get("salary_max")
        is_predicted = job.get("salary_is_predicted", True)

        if salary_min is None and salary_max is None:
            return 5  # no salary data at all

        score = 10.0  # has salary data
        if not is_predicted:
            score += 5  # real salary
        if self.salary_min and salary_min and salary_min >= self.salary_min:
            score += 5  # meets salary floor
        return score

    def _score_freshness(self, created: str) -> float:
        """Freshness: 0-10 points."""
        if not created:
            return 0
        try:
            # Adzuna dates: "2026-01-15T12:00:00Z"
            posted = datetime.fromisoformat(created.replace("Z", "+00:00"))
            days_old = (datetime.now(timezone.utc) - posted).days
            if days_old <= 1:
                return 10
            elif days_old <= 3:
                return 8
            elif days_old <= 7:
                return 6
            elif days_old <= 14:
                return 4
            elif days_old <= 30:
                return 2
            return 0
        except (ValueError, TypeError):
            return 0


_SENIORITY_PREFIXES = [
    "junior ", "jr ", "jr. ",
    "mid ", "mid-level ", "midlevel ",
    "senior ", "sr ", "sr. ",
    "lead ", "principal ", "staff ",
    "head of ", "entry level ", "entry-level ",
]


def _strip_seniority(title: str) -> str:
    """Strip seniority prefix from a title for synonym lookup."""
    t = title.lower().strip()
    for prefix in _SENIORITY_PREFIXES:
        if t.startswith(prefix):
            return t[len(prefix):]
    return t


# =============================================================================
# JobMatchEngine — 3-tier orchestrator
# =============================================================================

class JobMatchEngine:
    """
    3-tier job search with scoring.

    Tier 1: Primary query → if >= 5 results, score & return
    Tier 2: Synonym expansion → if >= 3 results, score & return
    Tier 3: AI fallback → score & return whatever we have
    """

    TIER1_THRESHOLD = 5
    TIER2_THRESHOLD = 3
    RESULTS_PER_QUERY = 20

    def __init__(self, adzuna_app_id: str, adzuna_app_key: str, supabase=None):
        self.app_id = adzuna_app_id
        self.app_key = adzuna_app_key
        self.supabase = supabase

    def search_and_rank(self, context: MatchContext) -> dict:
        """
        Execute 3-tier search and return scored results.
        Returns: { "count": int, "jobs": [...] }
        """
        scorer = JobScorer(context)
        seen_urls: set[str] = set()
        all_jobs: list[dict] = []

        # --- Tier 1: Primary query ---
        tier1 = self._fetch_adzuna(context, context.query)
        all_jobs = self._merge(all_jobs, tier1, seen_urls)

        if len(all_jobs) >= self.TIER1_THRESHOLD:
            result = self._finalize(all_jobs, scorer)
            result["ai_terms_used"] = []
            return result

        # --- Tier 2: Synonym expansion ---
        query_key = context.query.lower().strip()
        synonyms = TITLE_SYNONYMS.get(query_key) or TITLE_SYNONYMS.get(_strip_seniority(query_key), [])
        if synonyms:
            # Fetch first synonym only to limit API calls
            tier2 = self._fetch_adzuna(context, synonyms[0])
            all_jobs = self._merge(all_jobs, tier2, seen_urls)

        if len(all_jobs) >= self.TIER2_THRESHOLD:
            result = self._finalize(all_jobs, scorer)
            result["ai_terms_used"] = []
            return result

        # --- Tier 3: AI fallback ---
        ai_terms = get_ai_search_terms(context.query, self.supabase)
        for term in ai_terms:
            tier3 = self._fetch_adzuna(context, term)
            all_jobs = self._merge(all_jobs, tier3, seen_urls)

        result = self._finalize(all_jobs, scorer)
        result["ai_terms_used"] = ai_terms
        return result

    def _fetch_adzuna(self, context: MatchContext, query: str) -> list[dict]:
        """Fetch raw results from Adzuna API."""
        try:
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "what": query,
                "results_per_page": self.RESULTS_PER_QUERY,
                "sort_by": context.sort_by if context.sort_by in ("relevance", "salary", "date") else "relevance",
                "salary_include_unknown": "0",
            }
            if context.location:
                params["where"] = context.location
            if context.category:
                params["category"] = context.category
            if context.title_only:
                params["title_only"] = "1"
            if context.max_days_old:
                params["max_days_old"] = str(context.max_days_old)
            if context.salary_min:
                params["salary_min"] = str(context.salary_min)
            if context.full_time:
                params["full_time"] = "1"
            if context.permanent:
                params["permanent"] = "1"

            resp = http_requests.get(
                f"https://api.adzuna.com/v1/api/jobs/{context.country}/search/1",
                params=params,
                timeout=5,
            )
            resp.raise_for_status()
            raw = resp.json()

            jobs = []
            for r in raw.get("results", []):
                jobs.append({
                    "title": r.get("title", ""),
                    "company": (r.get("company", {}) or {}).get("display_name", ""),
                    "location": (r.get("location", {}) or {}).get("display_name", ""),
                    "salary_min": r.get("salary_min"),
                    "salary_max": r.get("salary_max"),
                    "salary_is_predicted": bool(r.get("salary_is_predicted")),
                    "url": r.get("redirect_url", ""),
                    "created": r.get("created", ""),
                    "_description": r.get("description", ""),  # used for scoring, stripped before response
                })
            return jobs

        except http_requests.RequestException as e:
            logging.error(f"Adzuna API error for query '{query}': {e}")
            return []

    def _merge(self, existing: list[dict], new: list[dict], seen_urls: set[str]) -> list[dict]:
        """Merge new results, dedup by URL."""
        for job in new:
            url = job.get("url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                existing.append(job)
        return existing

    def _finalize(self, jobs: list[dict], scorer: JobScorer) -> dict:
        """Score all jobs, sort by score desc, strip description."""
        for job in jobs:
            job["match_score"] = scorer.score(job)

        jobs.sort(key=lambda j: j["match_score"], reverse=True)

        # Strip internal description field
        for job in jobs:
            job.pop("_description", None)

        return {"count": len(jobs), "jobs": jobs}
