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
