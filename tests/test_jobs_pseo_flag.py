"""
JOBS_PSEO_ENABLED gates the programmatic job SEO pages (ADR-0001), independent of
the Adzuna credentials. No outbound HTTP: the renderer is replaced with a fake.
"""
import os
from unittest.mock import patch

import pytest

CRAWLER = {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}
HUMAN = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0"}
SHELL = '<html><body><div id="root">SPA shell</div></body></html>'
SSR = "<html><body><h1>Software Engineer jobs in London</h1></body></html>"


class FakeRenderer:
    def __init__(self, **kwargs):
        pass

    def resolve_url(self, segments):
        return "role_location", {}

    def get_page(self, page_type, page=1, **kwargs):
        return SSR

    matrix = {"roles": [{"slug": "software-engineer", "locations": ["london"]}],
              "locations": [{"slug": "london"}]}


@pytest.fixture
def pseo_app(flask_test_client, monkeypatch, tmp_path):
    client, _, flask_app = flask_test_client
    (tmp_path / "index.html").write_text(SHELL, encoding="utf-8")
    monkeypatch.setattr(flask_app.app, "static_folder", str(tmp_path))
    monkeypatch.setattr(flask_app, "FLASK_ENV", "production")
    monkeypatch.setattr(flask_app, "PseoRenderer", FakeRenderer)
    monkeypatch.setattr(flask_app, "_pseo_renderer", None)
    monkeypatch.setattr(flask_app, "load_vite_manifest", lambda _folder: {})
    return client


def env(flag):
    values = {"ADZUNA_APP_ID": "test-id", "ADZUNA_APP_KEY": "test-key"}
    if flag is not None:
        values["JOBS_PSEO_ENABLED"] = flag
    return values


@pytest.mark.parametrize("flag", [None, "", "false", "0"])
@pytest.mark.parametrize("path", ["/jobs", "/jobs/software-engineer/london"])
def test_flag_off_crawler_gets_app_shell(pseo_app, flag, path):
    with patch.dict(os.environ, env(flag), clear=False):
        if flag is None:
            os.environ.pop("JOBS_PSEO_ENABLED", None)
        resp = pseo_app.get(path, headers=CRAWLER)
    assert resp.status_code == 200
    assert resp.get_data(as_text=True) == SHELL


def test_flag_off_jobs_sitemap_404_and_not_in_index(pseo_app):
    with patch.dict(os.environ, env("false")):
        assert pseo_app.get("/sitemap-jobs-roles.xml").status_code == 404
        assert b"sitemap-jobs-roles.xml" not in pseo_app.get("/sitemap.xml").data


@pytest.mark.parametrize("path", ["/jobs", "/jobs/software-engineer/london"])
def test_flag_on_crawler_gets_server_rendered_page(pseo_app, path):
    with patch.dict(os.environ, env("true")):
        resp = pseo_app.get(path, headers=CRAWLER)
    assert resp.status_code == 200
    assert resp.get_data(as_text=True) == SSR


def test_flag_on_jobs_sitemap_served(pseo_app):
    with patch.dict(os.environ, env("true")):
        resp = pseo_app.get("/sitemap-jobs-roles.xml")
        index = pseo_app.get("/sitemap.xml")
    assert resp.status_code == 200
    assert b"/jobs/software-engineer/london" in resp.data
    assert b"sitemap-jobs-roles.xml" in index.data


@pytest.mark.parametrize("flag", ["false", "true"])
@pytest.mark.parametrize("path", ["/jobs", "/jobs/software-engineer/london"])
def test_humans_get_app_shell_either_way(pseo_app, flag, path):
    with patch.dict(os.environ, env(flag)):
        resp = pseo_app.get(path, headers=HUMAN)
    assert resp.get_data(as_text=True) == SHELL
