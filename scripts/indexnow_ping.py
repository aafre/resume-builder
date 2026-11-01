"""Submit recently changed sitemap URLs to IndexNow (Bing, Yandex, etc.).

Runs after each prod deploy (.github/workflows/deploy.yml). Only the static
sitemap is used: the jobs sitemap stamps every URL with today's date, so it
would resubmit thousands of unchanged pages on every deploy.

    python scripts/indexnow_ping.py            # lastmod within 14 days
    python scripts/indexnow_ping.py --days 0   # everything (first go-live)
    python scripts/indexnow_ping.py --dry-run
"""

import argparse
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, timedelta

HOST = "easyfreeresume.com"
KEY = "7e472437201b2e44ece87de01b39e0cf"  # served at https://easyfreeresume.com/<KEY>.txt (resume-builder-ui/public)
SITEMAP = f"https://{HOST}/sitemap-static.xml"
ENDPOINT = "https://api.indexnow.org/indexnow"
# Cloudflare 403s the default Python-urllib User-Agent.
UA = {"User-Agent": "EasyFreeResume-IndexNow/1.0 (+https://easyfreeresume.com)"}
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def changed_urls(sitemap_xml: str, days: int, today: date) -> list[str]:
    """URLs whose <lastmod> is within `days` of today; days=0 → all URLs."""
    cutoff = today - timedelta(days=days)
    urls = []
    for url in ET.fromstring(sitemap_xml).findall("s:url", NS):
        loc = url.findtext("s:loc", namespaces=NS)
        lastmod = url.findtext("s:lastmod", namespaces=NS)
        if not loc:
            continue
        if days == 0 or (lastmod and date.fromisoformat(lastmod[:10]) >= cutoff):
            urls.append(loc.strip())
    return urls


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with urllib.request.urlopen(urllib.request.Request(SITEMAP, headers=UA), timeout=30) as r:
        urls = changed_urls(r.read().decode(), args.days, date.today())
    print(f"IndexNow: {len(urls)} URLs (lastmod within {args.days or 'all'} days)")
    if not urls or args.dry_run:
        print("\n".join(urls))
        return 0

    body = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": f"https://{HOST}/{KEY}.txt",
        "urlList": urls[:10000],
    }).encode()
    req = urllib.request.Request(
        ENDPOINT, data=body, headers={**UA, "Content-Type": "application/json; charset=utf-8"}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        print(f"IndexNow: HTTP {r.status}")  # 200 or 202 = accepted
    return 0


if __name__ == "__main__":
    sys.exit(main())
