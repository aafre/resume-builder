from datetime import date

from scripts.indexnow_ping import changed_urls

XML = """<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://easyfreeresume.com/new</loc><lastmod>2026-10-30</lastmod></url>
  <url><loc>https://easyfreeresume.com/old</loc><lastmod>2026-02-10</lastmod></url>
  <url><loc>https://easyfreeresume.com/nodate</loc></url>
</urlset>"""


def test_only_recent_lastmod():
    assert changed_urls(XML, 14, date(2026, 11, 1)) == ["https://easyfreeresume.com/new"]


def test_days_zero_returns_all():
    assert len(changed_urls(XML, 0, date(2026, 11, 1))) == 3
