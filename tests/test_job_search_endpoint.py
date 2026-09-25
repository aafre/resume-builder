"""
Job search endpoint (/api/jobs/search) through the Flask test client.

Outbound job feed HTTP is always faked: `requests.get` is patched with FakeAdzuna,
which answers from canned results keyed by the `what` query param.
"""
import json
import os
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
import requests

ADZUNA_ENV = {"ADZUNA_APP_ID": "test-id", "ADZUNA_APP_KEY": "test-key"}


def adzuna_job(title, company="Acme", location="London", url=None, days_old=1,
               description="", salary=None):
    created = (datetime.now(timezone.utc) - timedelta(days=days_old)).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {
        "title": title,
        "company": {"display_name": company},
        "location": {"display_name": location},
        "salary_min": salary,
        "salary_max": salary,
        "salary_is_predicted": "0",
        "redirect_url": url or f"https://adzuna.example/{title.replace(' ', '-')}-{company}",
        "created": created,
        "description": description,
    }


class FakeAdzuna:
    """Stands in for requests.get against the Adzuna API."""

    def __init__(self, by_query=None, status=200):
        self.by_query = by_query or {}
        self.status = status
        self.calls = []

    def __call__(self, url, params=None, timeout=None):
        assert "api.adzuna.com" in url, f"unexpected outbound call: {url}"
        self.calls.append({"url": url, "params": params or {}})
        results = self.by_query.get((params or {}).get("what"), [])
        resp = requests.Response()
        resp.status_code = self.status
        resp.url = url
        resp._content = json.dumps({"count": len(results) * 10, "results": results}).encode()
        return resp


@pytest.fixture
def jobs_client(flask_test_client):
    client, _, flask_app = flask_test_client
    with patch.dict(os.environ, ADZUNA_ENV):
        yield client, flask_app


def post_search(client, **body):
    body.setdefault("country", "gb")
    return client.post("/api/jobs/search", json=body)


def test_normal_search_returns_fresh_listings_tagged_with_feed(jobs_client):
    client, _ = jobs_client
    fake = FakeAdzuna({"Software Engineer": [adzuna_job(f"Software Engineer {i}") for i in range(6)]})

    with patch("requests.get", fake):
        resp = post_search(client, query="Software Engineer", location="London")

    assert resp.status_code == 200
    body = resp.get_json()
    assert body["success"] is True
    data = body["data"]
    assert data["status"] == "fresh"
    assert data["count"] == 6
    assert data["total_available"] == 60
    assert data["ai_terms_used"] == []
    for job in data["jobs"]:
        assert job["feed"] == "adzuna"
        assert set(job) >= {"title", "company", "location", "salary_min", "salary_max",
                            "salary_is_predicted", "url", "created", "match_score"}
        assert "_description" not in job
    assert len(fake.calls) == 1
    assert "/jobs/gb/search/1" in fake.calls[0]["url"]
    assert fake.calls[0]["params"]["where"] == "London"


def test_synonym_broadening_when_primary_query_is_thin(jobs_client):
    client, _ = jobs_client
    fake = FakeAdzuna({
        "software engineer": [adzuna_job(f"Software Engineer {i}") for i in range(2)],
        "software developer": [adzuna_job(f"Software Developer {i}") for i in range(3)],
    })

    with patch("requests.get", fake):
        data = post_search(client, query="software engineer").get_json()["data"]

    assert [c["params"]["what"] for c in fake.calls] == ["software engineer", "software developer"]
    assert data["count"] == 5
    assert all(j["feed"] == "adzuna" for j in data["jobs"])


def test_results_ranked_by_resume_match(jobs_client):
    client, _ = jobs_client
    fake = FakeAdzuna({"data scientist": [
        adzuna_job("Warehouse Operative", days_old=40),
        adzuna_job("Senior Data Scientist", description="python sql pandas", days_old=1, salary=90000),
        adzuna_job("Data Scientist", description="excel", days_old=10),
        adzuna_job("Chef", days_old=2),
        adzuna_job("Data Analyst", days_old=5),
    ]})

    with patch("requests.get", fake):
        data = post_search(client, query="data scientist", skills=["python", "sql"]).get_json()["data"]

    titles = [j["title"] for j in data["jobs"]]
    scores = [j["match_score"] for j in data["jobs"]]
    assert scores == sorted(scores, reverse=True)
    assert titles[0] == "Senior Data Scientist"
    assert titles[-1] in ("Warehouse Operative", "Chef")


def test_unsupported_country_falls_back_to_us(jobs_client):
    client, _ = jobs_client
    fake = FakeAdzuna({"nurse": [adzuna_job(f"Nurse {i}") for i in range(5)]})

    with patch("requests.get", fake):
        resp = post_search(client, query="nurse", country="jp")

    assert resp.status_code == 200
    assert "/jobs/us/search/" in fake.calls[0]["url"]


def test_not_configured_returns_502(flask_test_client):
    client, _, _ = flask_test_client
    with patch.dict(os.environ, {"ADZUNA_APP_ID": "", "ADZUNA_APP_KEY": ""}), \
            patch("requests.get", FakeAdzuna()) as fake:
        resp = post_search(client, query="nurse")
    assert resp.status_code == 502
    assert fake.calls == []


def test_legacy_get_goes_through_feed(jobs_client):
    client, _ = jobs_client
    fake = FakeAdzuna({"dev": [adzuna_job("Dev")]})

    with patch("requests.get", fake):
        data = client.get("/api/jobs/search?query=dev&country=gb&what_or=python").get_json()["data"]

    assert data["jobs"][0]["feed"] == "adzuna"
    assert data["status"] == "fresh"
    assert "match_score" not in data["jobs"][0]
    assert "_description" not in data["jobs"][0]
    assert fake.calls[0]["params"]["what_or"] == "python"
    assert fake.calls[0]["params"]["results_per_page"] == 10


# =============================================================================
# Quota fallback (#823): skip exhausted feed for the UTC day, serve saved
# results as stale, else an explicit refreshing state.
# =============================================================================


@pytest.fixture(autouse=True)
def clean_job_state():
    import app as flask_app
    import job_feeds
    flask_app._saved_job_results.clear()
    flask_app._adzuna_cache.clear()
    job_feeds._exhausted_on.clear()
    yield
    flask_app._saved_job_results.clear()
    job_feeds._exhausted_on.clear()


NURSES = {"nurse": [adzuna_job(f"Nurse {i}") for i in range(5)]}


def test_quota_error_skips_adzuna_for_rest_of_utc_day(jobs_client, caplog):
    client, _ = jobs_client
    exhausted = FakeAdzuna(NURSES, status=429)

    with patch("requests.get", exhausted):
        post_search(client, query="nurse")
        assert len(exhausted.calls) == 1  # no tier 2/3 calls after the quota error
        post_search(client, query="nurse")
    assert len(exhausted.calls) == 1
    assert "job_quota_exhausted" in caplog.text

    tomorrow = FakeAdzuna(NURSES)
    with patch("requests.get", tomorrow), \
            patch("job_feeds._utc_today", return_value="2999-01-01"):
        data = post_search(client, query="nurse").get_json()["data"]
    assert len(tomorrow.calls) == 1
    assert data["status"] == "fresh"


def test_exhausted_with_saved_result_serves_stale(jobs_client, monkeypatch):
    client, flask_app = jobs_client
    with patch("requests.get", FakeAdzuna(NURSES)):
        fresh = post_search(client, query="nurse", location="Leeds").get_json()["data"]

    real_time = flask_app.time.time
    monkeypatch.setattr(flask_app.time, "time", lambda: real_time() + 20 * 60)  # past the 15-min cache
    with patch("requests.get", FakeAdzuna(NURSES, status=429)):
        data = post_search(client, query="nurse", location="Leeds").get_json()["data"]

    assert data["status"] == "stale"
    assert data["jobs"] == fresh["jobs"]
    fetched = datetime.fromisoformat(data["fetchedAt"])
    assert datetime.now(timezone.utc) - fetched < timedelta(minutes=1)


def test_saved_result_older_than_a_day_is_not_served(jobs_client, monkeypatch):
    client, flask_app = jobs_client
    with patch("requests.get", FakeAdzuna(NURSES)):
        post_search(client, query="nurse")

    real_time = flask_app.time.time
    monkeypatch.setattr(flask_app.time, "time", lambda: real_time() + 25 * 3600)
    with patch("requests.get", FakeAdzuna(NURSES, status=429)):
        data = post_search(client, query="nurse").get_json()["data"]
    assert data["status"] == "refreshing"


def test_exhausted_with_nothing_saved_returns_refreshing_with_search_url(jobs_client):
    client, _ = jobs_client
    with patch("requests.get", FakeAdzuna(NURSES, status=429)):
        resp = post_search(client, query="Staff Nurse", location="Leeds")

    assert resp.status_code == 200
    data = resp.get_json()["data"]
    assert data["status"] == "refreshing"
    assert data["jobs"] == [] and data["count"] == 0
    assert data["searchUrl"].startswith("https://www.adzuna.co.uk/")
    assert "Staff+Nurse" in data["searchUrl"] and "Leeds" in data["searchUrl"]


def test_feed_failure_also_falls_back(jobs_client):
    client, _ = jobs_client
    with patch("requests.get", FakeAdzuna(NURSES, status=500)):
        data = post_search(client, query="nurse").get_json()["data"]
    assert data["status"] == "refreshing"


def test_genuinely_empty_search_stays_fresh(jobs_client):
    client, _ = jobs_client
    with patch("requests.get", FakeAdzuna({})):
        data = post_search(client, query="underwater basket weaver").get_json()["data"]
    assert data["status"] == "fresh"
    assert data["jobs"] == []


def test_legacy_get_respects_quota(jobs_client):
    client, _ = jobs_client
    fake = FakeAdzuna({"dev": [adzuna_job("Dev")]}, status=429)
    with patch("requests.get", fake):
        assert client.get("/api/jobs/search?query=dev").status_code == 502
        assert client.post("/api/jobs/search", json={"query": "dev"}).get_json()["data"]["status"] == "refreshing"
    assert len(fake.calls) == 1


def test_repeat_search_within_15_minutes_is_served_from_cache(jobs_client):
    # The editor badge, the post-download modal and /jobs often run the same search.
    client, _ = jobs_client
    fake = FakeAdzuna(NURSES)
    with patch("requests.get", fake):
        first = post_search(client, query="nurse").get_json()["data"]
        second = post_search(client, query="nurse").get_json()["data"]
    assert len(fake.calls) == 1
    assert second == first


# =============================================================================
# Country gating (#824): CF-IPCountry decides whether the jobs feature shows.
# =============================================================================


@pytest.mark.parametrize("header, available", [
    ("GB", True),
    ("us", True),
    ("JP", False),
    ("XX", False),  # Cloudflare: unknown
    ("T1", False),  # Cloudflare: Tor
])
def test_availability_follows_cf_country(jobs_client, header, available):
    client, _ = jobs_client
    data = client.get("/api/jobs/availability", headers={"CF-IPCountry": header}).get_json()
    assert data == {"available": available, "country": header.lower()}


def test_availability_fails_open_without_header(jobs_client):
    client, _ = jobs_client
    assert client.get("/api/jobs/availability").get_json() == {"available": True, "country": None}


def test_availability_false_when_no_feed_configured(flask_test_client):
    client, _, _ = flask_test_client
    with patch.dict(os.environ, {"ADZUNA_APP_ID": "", "ADZUNA_APP_KEY": ""}):
        data = client.get("/api/jobs/availability", headers={"CF-IPCountry": "GB"}).get_json()
    assert data["available"] is False


def test_cache_is_shared_across_resume_contexts_and_rescored(jobs_client):
    # Post-download searches carry per-resume skills; the feed query is what matters.
    client, _ = jobs_client
    fake = FakeAdzuna({"data scientist": [
        adzuna_job("Data Scientist A", description="python pandas"),
        adzuna_job("Data Scientist B", description="excel tableau"),
        *[adzuna_job(f"Data Scientist {i}") for i in range(3)],
    ]})
    with patch("requests.get", fake):
        py = post_search(client, query="data scientist", skills=["python"], seniority_level="senior").get_json()["data"]
        xl = post_search(client, query="data scientist", skills=["excel"], years_experience=2).get_json()["data"]

    assert len(fake.calls) == 1
    score = lambda data, title: next(j["match_score"] for j in data["jobs"] if j["title"] == title)  # noqa: E731
    assert score(py, "Data Scientist A") > score(py, "Data Scientist B")
    assert score(xl, "Data Scientist B") > score(xl, "Data Scientist A")
    assert all("_description" not in j for j in py["jobs"] + xl["jobs"])


def test_stale_fallback_is_shared_across_resume_contexts(jobs_client, monkeypatch):
    client, flask_app = jobs_client
    with patch("requests.get", FakeAdzuna(NURSES)):
        post_search(client, query="nurse", skills=["triage"])

    real_time = flask_app.time.time
    monkeypatch.setattr(flask_app.time, "time", lambda: real_time() + 20 * 60)
    with patch("requests.get", FakeAdzuna(NURSES, status=429)):
        data = post_search(client, query="nurse", skills=["icu"]).get_json()["data"]
    assert data["status"] == "stale"
    assert data["count"] == 5
