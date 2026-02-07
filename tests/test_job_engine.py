"""
Tests for job_engine.py — 3-tier search, scoring, and AI fallback.

Run tests:
    pytest tests/test_job_engine.py -v
"""
import pytest
from unittest.mock import patch, MagicMock
import json
import sys
import os
import time

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from job_engine import (
    TITLE_SYNONYMS,
    SKILL_ALIASES,
    MatchContext,
    JobScorer,
    JobMatchEngine,
    get_ai_search_terms,
    _ai_cache,
    _ALIAS_LOOKUP,
)


# =============================================================================
# Title Synonym Table
# =============================================================================


class TestTitleSynonyms:
    """Tests for TITLE_SYNONYMS lookup table."""

    def test_known_title_returns_alternates(self):
        syns = TITLE_SYNONYMS.get("software engineer")
        assert syns is not None
        assert len(syns) >= 1
        assert "software developer" in syns

    def test_unknown_title_returns_none(self):
        assert TITLE_SYNONYMS.get("chief meme officer") is None

    def test_case_sensitive_keys_are_lowercase(self):
        for key in TITLE_SYNONYMS:
            assert key == key.lower(), f"Key '{key}' should be lowercase"

    def test_devops_synonyms(self):
        syns = TITLE_SYNONYMS.get("devops engineer")
        assert "site reliability engineer" in syns

    def test_data_scientist_synonyms(self):
        syns = TITLE_SYNONYMS.get("data scientist")
        assert len(syns) >= 2


# =============================================================================
# Skill Alias Table
# =============================================================================


class TestSkillAliases:
    """Tests for SKILL_ALIASES and the bidirectional lookup."""

    def test_javascript_aliases(self):
        assert "js" in SKILL_ALIASES["javascript"]

    def test_kubernetes_alias(self):
        assert "k8s" in SKILL_ALIASES["kubernetes"]

    def test_bidirectional_lookup(self):
        # "js" should resolve back to "javascript"
        assert "javascript" in _ALIAS_LOOKUP.get("js", set())

    def test_csharp_aliases(self):
        assert "csharp" in SKILL_ALIASES["c#"]


# =============================================================================
# JobScorer — Title Scoring
# =============================================================================


class TestTitleScoring:
    """Tests for JobScorer._score_title()."""

    def _make_scorer(self, query: str) -> JobScorer:
        return JobScorer(MatchContext(query=query))

    def test_exact_match_gets_40(self):
        scorer = self._make_scorer("Software Engineer")
        assert scorer._score_title("Software Engineer") == 40

    def test_substring_match_gets_40(self):
        scorer = self._make_scorer("Software Engineer")
        assert scorer._score_title("Senior Software Engineer") == 40

    def test_partial_word_overlap_proportional(self):
        scorer = self._make_scorer("Senior Software Engineer")
        score = scorer._score_title("Software Architect")
        # "software" overlaps → 1/3 words → proportional but at least 15
        assert 15 <= score <= 35

    def test_synonym_hit_gets_30(self):
        scorer = self._make_scorer("software engineer")
        # "software developer" is a synonym
        score = scorer._score_title("software developer")
        assert score == 30

    def test_no_match_gets_0(self):
        scorer = self._make_scorer("Software Engineer")
        assert scorer._score_title("Registered Nurse") == 0

    def test_empty_title_gets_0(self):
        scorer = self._make_scorer("Software Engineer")
        assert scorer._score_title("") == 0


# =============================================================================
# JobScorer — Skill Scoring
# =============================================================================


class TestSkillScoring:
    """Tests for JobScorer._score_skills()."""

    def test_all_skills_matched_gets_30(self):
        scorer = JobScorer(MatchContext(query="dev", skills=["python", "react"]))
        score = scorer._score_skills("We need python and react experience")
        assert score == 30

    def test_partial_match_proportional(self):
        scorer = JobScorer(MatchContext(query="dev", skills=["python", "react", "go", "rust"]))
        score = scorer._score_skills("We need python and react")
        # 2/4 matched → 15
        assert score == 15

    def test_no_skills_gives_neutral_15(self):
        scorer = JobScorer(MatchContext(query="dev", skills=[]))
        assert scorer._score_skills("any description") == 15

    def test_alias_matching_works(self):
        scorer = JobScorer(MatchContext(query="dev", skills=["javascript"]))
        # "js" is an alias for "javascript"
        score = scorer._score_skills("Must know js and html")
        assert score == 30

    def test_no_description_gets_0(self):
        scorer = JobScorer(MatchContext(query="dev", skills=["python"]))
        assert scorer._score_skills("") == 0


# =============================================================================
# JobScorer — Salary Scoring
# =============================================================================


class TestSalaryScoring:
    """Tests for JobScorer._score_salary()."""

    def test_real_salary_above_floor_gets_20(self):
        scorer = JobScorer(MatchContext(query="dev", salary_min=80000))
        score = scorer._score_salary({
            "salary_min": 90000,
            "salary_max": 120000,
            "salary_is_predicted": False,
        })
        assert score == 20

    def test_predicted_salary_gets_15(self):
        scorer = JobScorer(MatchContext(query="dev", salary_min=80000))
        score = scorer._score_salary({
            "salary_min": 90000,
            "salary_max": 110000,
            "salary_is_predicted": True,
        })
        assert score == 15  # 10 (has) + 5 (meets floor)

    def test_no_salary_data_gets_5(self):
        scorer = JobScorer(MatchContext(query="dev"))
        score = scorer._score_salary({"salary_min": None, "salary_max": None})
        assert score == 5

    def test_salary_below_floor(self):
        scorer = JobScorer(MatchContext(query="dev", salary_min=100000))
        score = scorer._score_salary({
            "salary_min": 60000,
            "salary_max": 80000,
            "salary_is_predicted": False,
        })
        assert score == 15  # 10 (has) + 5 (real) + 0 (below floor)


# =============================================================================
# JobScorer — Freshness Scoring
# =============================================================================


class TestFreshnessScoring:
    """Tests for JobScorer._score_freshness()."""

    def test_today_gets_10(self):
        from datetime import datetime, timezone, timedelta
        scorer = JobScorer(MatchContext(query="dev"))
        now = datetime.now(timezone.utc).isoformat()
        assert scorer._score_freshness(now) == 10

    def test_7_days_gets_6(self):
        from datetime import datetime, timezone, timedelta
        scorer = JobScorer(MatchContext(query="dev"))
        week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        assert scorer._score_freshness(week_ago) == 6

    def test_45_days_gets_0(self):
        from datetime import datetime, timezone, timedelta
        scorer = JobScorer(MatchContext(query="dev"))
        old = (datetime.now(timezone.utc) - timedelta(days=45)).isoformat()
        assert scorer._score_freshness(old) == 0

    def test_empty_string_gets_0(self):
        scorer = JobScorer(MatchContext(query="dev"))
        assert scorer._score_freshness("") == 0


# =============================================================================
# AI Fallback (Supabase Edge Function)
# =============================================================================


class TestAIFallback:
    """Tests for get_ai_search_terms() via Supabase Edge Function."""

    def setup_method(self):
        _ai_cache.clear()

    def test_successful_translation(self):
        mock_sb = MagicMock()
        mock_sb.functions.invoke.return_value = json.dumps({
            "success": True,
            "terms": ["Creative Director", "Art Director", "Brand Designer"],
        }).encode("utf-8")

        terms = get_ai_search_terms("Creative Wizard", mock_sb)
        assert terms == ["Creative Director", "Art Director", "Brand Designer"]

    def test_graceful_failure_on_exception(self):
        mock_sb = MagicMock()
        mock_sb.functions.invoke.side_effect = Exception("Network error")

        terms = get_ai_search_terms("Creative Wizard", mock_sb)
        assert terms == []

    def test_returns_empty_when_no_supabase(self):
        assert get_ai_search_terms("Creative Wizard", None) == []

    def test_caching_prevents_repeat_calls(self):
        mock_sb = MagicMock()
        mock_sb.functions.invoke.return_value = json.dumps({
            "success": True,
            "terms": ["A", "B", "C"],
        }).encode("utf-8")

        # First call
        terms1 = get_ai_search_terms("Niche Title", mock_sb)
        # Second call (should be cached)
        terms2 = get_ai_search_terms("Niche Title", mock_sb)

        assert terms1 == terms2
        assert mock_sb.functions.invoke.call_count == 1

    def test_dict_response_format(self):
        mock_sb = MagicMock()
        mock_sb.functions.invoke.return_value = {
            "success": True,
            "terms": ["PM", "Product Owner"],
        }

        terms = get_ai_search_terms("Chief Product Guru", mock_sb)
        assert "PM" in terms

    def test_limits_to_3_terms(self):
        mock_sb = MagicMock()
        mock_sb.functions.invoke.return_value = json.dumps({
            "success": True,
            "terms": ["A", "B", "C", "D", "E"],
        }).encode("utf-8")

        terms = get_ai_search_terms("Some Title", mock_sb)
        assert len(terms) <= 3


# =============================================================================
# 3-Tier Orchestration
# =============================================================================


class TestJobMatchEngine:
    """Tests for JobMatchEngine.search_and_rank()."""

    def _make_engine(self, supabase=None):
        return JobMatchEngine("test_id", "test_key", supabase=supabase)

    def _make_jobs(self, n, url_prefix="http://job"):
        """Create n fake job dicts."""
        from datetime import datetime, timezone
        return [
            {
                "title": f"Software Engineer {i}",
                "company": "TestCo",
                "location": "Remote",
                "salary_min": 80000,
                "salary_max": 120000,
                "salary_is_predicted": False,
                "url": f"{url_prefix}/{i}",
                "created": datetime.now(timezone.utc).isoformat(),
                "_description": "python react javascript aws",
            }
            for i in range(n)
        ]

    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_tier1_sufficient_skips_tier2_and_3(self, mock_fetch):
        """When Tier 1 returns >= 5 results, Tiers 2 and 3 are skipped."""
        mock_fetch.return_value = self._make_jobs(6)
        engine = self._make_engine()

        ctx = MatchContext(query="software engineer", skills=["python"])
        result = engine.search_and_rank(ctx)

        assert mock_fetch.call_count == 1
        assert len(result["jobs"]) == 6
        assert all("match_score" in j for j in result["jobs"])

    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_tier2_triggered_when_tier1_insufficient(self, mock_fetch):
        """When Tier 1 returns < 5 results, Tier 2 is triggered."""
        tier1_jobs = self._make_jobs(3, url_prefix="http://tier1")
        tier2_jobs = self._make_jobs(3, url_prefix="http://tier2")
        mock_fetch.side_effect = [tier1_jobs, tier2_jobs]

        engine = self._make_engine()
        ctx = MatchContext(query="software engineer")
        result = engine.search_and_rank(ctx)

        assert mock_fetch.call_count == 2
        assert len(result["jobs"]) == 6

    @patch("job_engine.get_ai_search_terms")
    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_tier3_triggered_when_tier2_insufficient(self, mock_fetch, mock_ai):
        """When Tier 1 + Tier 2 yield < 5 results, Tier 3 is triggered."""
        mock_fetch.side_effect = [
            self._make_jobs(1, "http://t1"),  # Tier 1: 1 result
            self._make_jobs(1, "http://t2"),  # Tier 2: 1 result
            self._make_jobs(2, "http://t3a"),  # Tier 3 term 1
            self._make_jobs(2, "http://t3b"),  # Tier 3 term 2
        ]
        mock_ai.return_value = ["Developer", "Programmer"]

        engine = self._make_engine()
        ctx = MatchContext(query="software engineer")
        result = engine.search_and_rank(ctx)

        assert mock_ai.called
        assert len(result["jobs"]) == 6

    @patch("job_engine.get_ai_search_terms")
    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_tier3_triggered_with_4_results_after_tier2(self, mock_fetch, mock_ai):
        """3-4 results after Tier 2 should still trigger Tier 3 (threshold=5)."""
        mock_fetch.side_effect = [
            self._make_jobs(2, "http://t1"),  # Tier 1: 2 results
            self._make_jobs(2, "http://t2"),  # Tier 2: 2 results (total=4)
            self._make_jobs(3, "http://t3"),  # Tier 3
        ]
        mock_ai.return_value = ["Developer"]

        engine = self._make_engine()
        ctx = MatchContext(query="software engineer")
        result = engine.search_and_rank(ctx)

        assert mock_ai.called
        assert len(result["jobs"]) == 7

    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_dedup_by_url(self, mock_fetch):
        """Duplicate URLs should be removed."""
        jobs = self._make_jobs(3, url_prefix="http://same")
        mock_fetch.side_effect = [jobs, jobs]  # Same URLs both tiers

        engine = self._make_engine()
        ctx = MatchContext(query="software engineer")
        result = engine.search_and_rank(ctx)

        assert len(result["jobs"]) == 3

    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_results_sorted_by_score_desc(self, mock_fetch):
        """Jobs should be sorted by match_score descending."""
        from datetime import datetime, timezone, timedelta
        jobs = [
            {
                "title": "Nurse",
                "company": "Hospital",
                "location": "NYC",
                "salary_min": None,
                "salary_max": None,
                "salary_is_predicted": True,
                "url": "http://a/1",
                "created": (datetime.now(timezone.utc) - timedelta(days=30)).isoformat(),
                "_description": "",
            },
            {
                "title": "Software Engineer",
                "company": "Google",
                "location": "Remote",
                "salary_min": 150000,
                "salary_max": 200000,
                "salary_is_predicted": False,
                "url": "http://a/2",
                "created": datetime.now(timezone.utc).isoformat(),
                "_description": "python react",
            },
        ]
        mock_fetch.return_value = jobs + self._make_jobs(4, "http://b")

        engine = self._make_engine()
        ctx = MatchContext(query="software engineer", skills=["python", "react"])
        result = engine.search_and_rank(ctx)

        scores = [j["match_score"] for j in result["jobs"]]
        assert scores == sorted(scores, reverse=True)

    @patch.object(JobMatchEngine, "_fetch_adzuna")
    def test_description_stripped_from_response(self, mock_fetch):
        """Internal _description field should not appear in results."""
        mock_fetch.return_value = self._make_jobs(6)

        engine = self._make_engine()
        ctx = MatchContext(query="software engineer")
        result = engine.search_and_rank(ctx)

        for job in result["jobs"]:
            assert "_description" not in job

    @patch("requests.get")
    def test_fetch_adzuna_includes_unknown_salary(self, mock_get):
        """_fetch_adzuna should send salary_include_unknown=1."""
        mock_resp = MagicMock()
        mock_resp.raise_for_status = MagicMock()
        mock_resp.json.return_value = {"results": []}
        mock_get.return_value = mock_resp

        engine = self._make_engine()
        ctx = MatchContext(query="python", country="gb")
        engine._fetch_adzuna(ctx, "python")

        call_params = mock_get.call_args[1]["params"]
        assert call_params["salary_include_unknown"] == "1"


# =============================================================================
# Endpoint Integration
# =============================================================================


class TestSearchEndpoint:
    """Tests for the /api/jobs/search endpoint."""

    @patch("job_engine.JobMatchEngine.search_and_rank")
    @patch.dict(os.environ, {"ADZUNA_APP_ID": "test", "ADZUNA_APP_KEY": "test"})
    def test_post_returns_match_score(self, mock_search, flask_test_client):
        """POST should return jobs with match_score."""
        client, mock_sb, flask_app = flask_test_client

        mock_search.return_value = {
            "count": 1,
            "jobs": [
                {
                    "title": "Software Engineer",
                    "company": "TestCo",
                    "location": "Remote",
                    "salary_min": 100000,
                    "salary_max": 150000,
                    "salary_is_predicted": False,
                    "url": "http://example.com/1",
                    "created": "2026-01-15T12:00:00Z",
                    "match_score": 85.5,
                }
            ],
        }

        resp = client.post(
            "/api/jobs/search",
            json={"query": "Software Engineer", "country": "us"},
            content_type="application/json",
        )

        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert data["data"]["jobs"][0]["match_score"] == 85.5

    @patch.dict(os.environ, {"ADZUNA_APP_ID": "test", "ADZUNA_APP_KEY": "test"})
    def test_get_backward_compat(self, flask_test_client):
        """GET should still work with legacy passthrough (no scoring)."""
        client, mock_sb, flask_app = flask_test_client

        with patch("requests.get") as mock_get:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_resp.raise_for_status = MagicMock()
            mock_resp.json.return_value = {
                "count": 1,
                "results": [
                    {
                        "title": "Dev",
                        "company": {"display_name": "Co"},
                        "location": {"display_name": "NYC"},
                        "salary_min": 80000,
                        "salary_max": 100000,
                        "salary_is_predicted": False,
                        "redirect_url": "http://example.com/job1",
                        "created": "2026-01-15T12:00:00Z",
                    }
                ],
            }
            mock_get.return_value = mock_resp

            resp = client.get("/api/jobs/search?query=dev&country=us")

            assert resp.status_code == 200
            data = resp.get_json()
            assert data["success"] is True
            assert "match_score" not in data["data"]["jobs"][0]

    def test_post_missing_query_returns_400(self, flask_test_client):
        """POST without query should return 400."""
        client, mock_sb, flask_app = flask_test_client

        resp = client.post(
            "/api/jobs/search",
            json={"country": "us"},
            content_type="application/json",
        )

        assert resp.status_code == 400

    @patch("job_engine.JobMatchEngine.search_and_rank")
    @patch.dict(os.environ, {"ADZUNA_APP_ID": "test", "ADZUNA_APP_KEY": "test"})
    def test_post_description_not_in_response(self, mock_search, flask_test_client):
        """POST response should not include description field."""
        client, mock_sb, flask_app = flask_test_client

        mock_search.return_value = {
            "count": 1,
            "jobs": [
                {
                    "title": "Dev",
                    "company": "Co",
                    "location": "NYC",
                    "salary_min": 80000,
                    "salary_max": 100000,
                    "salary_is_predicted": False,
                    "url": "http://example.com/1",
                    "created": "2026-01-15T12:00:00Z",
                    "match_score": 70,
                }
            ],
        }

        resp = client.post(
            "/api/jobs/search",
            json={"query": "developer", "country": "us"},
            content_type="application/json",
        )

        data = resp.get_json()
        for job in data["data"]["jobs"]:
            assert "_description" not in job
            assert "description" not in job
