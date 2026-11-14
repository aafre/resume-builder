"""Recovery prune 2026-12 (seo-tracking/prune-2026-12.md, baseline branch).

Guards the KEEP set: a kept page that starts redirecting or noindexing loses its
place in the index, so every one is checked against the real serve() path.
"""

import pytest

PROD = "https://easyfreeresume.com"

KEEP = [
    "/", "/best-free-resume-builder-reddit", "/free-cv-builder-no-sign-up",
    "/free-resume-builder-no-payment", "/free-resume-builder-for-students",
    "/free-resume-builder-no-sign-up", "/resume-keyword-scanner",
    "/templates", "/templates/modern-resume-templates", "/cv-templates/ats-friendly",
    "/ats-resume-templates", "/templates/minimalist-resume-templates", "/cv-templates",
    "/templates/ats-friendly", "/templates/resume-templates-for-students",
    "/examples", "/resume-keywords",
    "/blog", "/blog/return-to-work-programs", "/blog/claude-resume-prompts",
    "/blog/best-free-resume-builders-2026", "/blog/resume-no-experience",
    "/blog/ai-resume-writing-guide", "/blog/how-to-write-a-resume-guide",
    "/blog/how-why-easyfreeresume-completely-free", "/blog/ai-resume-prompts-hub",
    "/blog/resume-action-verbs", "/blog/professional-summary-examples",
    "/blog/ats-resume-optimization", "/blog/resume-employment-gaps",
    "/blog/behavioral-interview-questions",
    "/easyfreeresume-vs-zety", "/blog/resume-io-vs-easy-free-resume",
    "/easyfreeresume-vs-indeed-resume-builder", "/blog/novoresume-vs-easy-free-resume",
    "/blog/flowcv-vs-easy-free-resume", "/blog/resume-vs-cv-difference",
    "/blog/canva-resume-vs-easy-free-resume", "/blog/resume-genius-vs-easy-free-resume",
    "/blog/enhancv-vs-easy-free-resume",
    "/about", "/terms-of-service", "/privacy-policy", "/contact",
]

NOINDEX = [
    "/examples/receptionist", "/examples/registered-nurse", "/examples/high-school-student",
    "/resume-keywords/software-engineer", "/resume-keywords/customer-service",
    "/blog/cover-letter-guide", "/blog/remote-work-resume", "/blog/tech-resume-guide",
]


@pytest.fixture
def client(flask_test_client, tmp_path, monkeypatch):
    client, _, flask_app = flask_test_client
    (tmp_path / "index.html").write_text("<html></html>")
    monkeypatch.setattr(flask_app.app, "static_folder", str(tmp_path))
    return client, flask_app


def test_keep_set_size():
    assert len(KEEP) == len(set(KEEP)) == 44


@pytest.mark.parametrize("path", KEEP)
def test_kept_page_is_indexable(client, path):
    c, _ = client
    resp = c.get(path, base_url=PROD)
    assert resp.status_code == 200, path
    assert resp.headers.get("X-Robots-Tag") is None, path


@pytest.mark.parametrize("path", NOINDEX)
def test_pruned_page_is_noindexed_but_live(client, path):
    c, _ = client
    resp = c.get(path, base_url=PROD)
    assert resp.status_code == 200
    assert resp.headers.get("X-Robots-Tag") == "noindex, follow"


def test_every_redirect_lands_on_a_kept_page(client):
    c, flask_app = client
    for src in (f"/{p}" for p in flask_app.PRUNE_REDIRECTS):
        resp = c.get(src, base_url=PROD)
        assert resp.status_code == 301, src
        target = resp.headers["Location"].replace(PROD, "")
        assert target in KEEP, f"{src} -> {target} is not a KEEP page"


@pytest.mark.parametrize("legacy", [
    "/blog/customer-service-resume-keywords", "/blog/software-engineer-resume-keywords",
    "/blog/resume-keywords-by-industry", "/blog/how-to-use-resume-keywords-to-beat-ats",
    "/blog/how-to-list-skills-on-resume", "/blog/career-change-resume",
])
def test_legacy_redirects_skip_pruned_hops(client, legacy):
    c, _ = client
    resp = c.get(legacy, base_url=PROD)
    assert resp.status_code == 301
    assert resp.headers["Location"].replace(PROD, "") in KEEP


def test_client_prune_map_matches_server(flask_test_client):
    """The client <Navigate> fallbacks (pruneRedirects.ts) must mirror app.py."""
    import re
    from pathlib import Path

    _, _, flask_app = flask_test_client
    ts = (Path(__file__).parent.parent / "resume-builder-ui/src/data/pruneRedirects.ts").read_text(encoding="utf8")
    client = dict(re.findall(r"  '/([^']+)': '([^']+)',", ts))
    assert client == flask_app.PRUNE_REDIRECTS
    noindex = set(re.findall(r"  '/([^']+)',\n", ts))
    assert noindex == flask_app.NOINDEX_ROUTES - {"blog/ai-cover-letter-prompts"}
