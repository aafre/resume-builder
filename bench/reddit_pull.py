"""Pull resume-builder threads from Reddit via Arctic Shift (free, no key) and count tool mentions.
Usage: python -I pull.py <outdir>
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

API = "https://arctic-shift.photon-reddit.com/api"
OUT = Path(sys.argv[1]); OUT.mkdir(exist_ok=True)
SUBS = ["resumes", "jobs", "cscareerquestions", "careerguidance", "jobsearchhacks", "recruitinghell"]
QUERIES = ["resume builder", "free resume", "resume template", "resume maker"]
AFTER = "2024-06-01"

# tool -> regex (word-boundary, case-insensitive)
TOOLS = {
    "Google Docs": r"google docs?|gdocs",
    "Microsoft Word": r"\bms word\b|microsoft word|\bword\b (?:doc|template)|\bin word\b",
    "LaTeX / Overleaf": r"overleaf|\blatex\b",
    "Jake's Resume (template)": r"jake'?s? (?:resume|template)",
    "FlowCV": r"flow ?cv",
    "Reactive Resume (RxResume)": r"reactive ?resume|rxresume|rx resume",
    "Teal": r"\bteal(?:hq)?\b",
    "Novoresume": r"novo ?resume",
    "Canva": r"\bcanva\b",
    "Zety": r"\bzety\b",
    "Resume.io": r"resume\.io",
    "Resume Genius": r"resume ?genius",
    "Kickresume": r"kick ?resume",
    "Enhancv": r"enhancv",
    "Resume Worded": r"resume ?worded",
    "RenderCV": r"render ?cv",
    "Typst": r"\btypst\b",
    "ChatGPT / AI": r"chat ?gpt|\bclaude\b|\bgemini\b",
    "Rezi": r"\brezi\b",
    "Huntr": r"\bhuntr\b",
    "EasyFreeResume": r"easy ?free ?resume",
}
TOOL_RE = {k: re.compile(v, re.I) for k, v in TOOLS.items()}
RELEVANT = re.compile(r"resume (?:builder|maker|template|site|app|tool)|build(?:ing)? (?:a|my) resume|free resume", re.I)


SKIPPED = []
WINDOWS = [("2024-06-01", "2025-01-01"), ("2025-01-01", "2025-07-01"), ("2025-07-01", "2026-01-01"), ("2026-01-01", "2026-07-01"), ("2026-07-01", "2026-11-15")]


def get(path, **params):
    cache = OUT / ("cache_" + re.sub(r"\W+", "_", path + "_" + "_".join(f"{k}{v}" for k, v in params.items())) + ".json")
    if cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))
    res = _get(path, **params)
    if res is not None:
        cache.write_text(json.dumps(res), encoding="utf-8")
    return res


def _get(path, **params):
    url = f"{API}/{path}?{urllib.parse.urlencode(params)}"
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "research-script/0.1"}), timeout=90) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:  # 422 = rate/timeout on their side
            time.sleep(5 * (attempt + 1))
    print("SKIP (timeout):", url, flush=True); SKIPPED.append(url)
    return None


def walk(nodes):
    for n in nodes or []:
        d = n.get("data", n)
        if d.get("body"):
            yield d
        rep = d.get("replies")
        if isinstance(rep, dict):
            yield from walk(rep.get("data", {}).get("children"))
        elif isinstance(rep, list):
            yield from walk(rep)
        yield from walk(n.get("children") if "data" in n else None)


posts = {}
for sub in SUBS:
    for q in QUERIES:
        for a, b in WINDOWS:
            res = get("posts/search", subreddit=sub, title=q, after=a, before=b, limit=100, sort="desc") or {}
            for p in res.get("data") or []:
                if p.get("num_comments", 0) >= 10 and RELEVANT.search(p["title"] + " " + (p.get("selftext") or "")):
                    posts[p["id"]] = p
            time.sleep(1.5)
print(f"candidate posts: {len(posts)}")
top = sorted(posts.values(), key=lambda p: p["num_comments"], reverse=True)[:40]
(OUT / "posts.json").write_text(json.dumps(top, indent=1), encoding="utf-8")

threads = []
for p in top:
    tree = get("comments/tree", link_id=p["id"], limit=9999)
    if tree is None:
        continue
    comments = list(walk(tree.get("data")))
    (OUT / f"comments_{p['id']}.json").write_text(json.dumps(comments, indent=1), encoding="utf-8")
    threads.append((p, comments))
    time.sleep(2)

# per tool: threads mentioning, comment mentions, summed comment score
agg = {k: {"threads": set(), "comments": 0, "score": 0} for k in TOOLS}
for p, comments in threads:
    for c in comments:
        for k, rx in TOOL_RE.items():
            if rx.search(c["body"]):
                agg[k]["threads"].add(p["id"]); agg[k]["comments"] += 1; agg[k]["score"] += max(c.get("score") or 0, 0)
rows = sorted(({"tool": k, "threads": len(v["threads"]), "comments": v["comments"], "upvotes": v["score"]} for k, v in agg.items()),
              key=lambda r: r["upvotes"], reverse=True)
summary = {
    "pulled_utc": time.strftime("%Y-%m-%dT%H:%MZ", time.gmtime()), "source": "arctic-shift.photon-reddit.com",
    "subs": SUBS, "skipped_requests": SKIPPED, "windows": WINDOWS, "queries": QUERIES, "after": AFTER,
    "threads": [{"id": p["id"], "sub": p["subreddit"], "title": p["title"], "url": "https://www.reddit.com" + p["permalink"],
                 "score": p["score"], "comments": p["num_comments"], "created_utc": p["created_utc"], "pulled_comments": len(c)} for p, c in threads],
    "mentions": rows,
}
(OUT / "summary.json").write_text(json.dumps(summary, indent=1), encoding="utf-8")
for r in rows:
    print(f"{r['tool']:28} threads={r['threads']:3} comments={r['comments']:4} upvotes={r['upvotes']}")
