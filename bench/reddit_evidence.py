"""Turn a reddit_pull.py data dir into the evidence file behind /best-free-resume-builder-reddit.

Usage: python -I -X utf8 bench/reddit_evidence.py <pull data dir>
Writes resume-builder-ui/src/data/redditEvidence.json. Never hand-edit that file.

Only threads where the poster ASKS for a builder count (ASK_THREADS, picked by reading titles).
Quotes are chosen by comment id; their text, score and link come from the pull, verbatim.
"""
import json, re, sys
from pathlib import Path

DATA = Path(sys.argv[1]) if len(sys.argv) > 1 else None
OUT = Path(__file__).resolve().parents[1] / "resume-builder-ui/src/data/redditEvidence.json"

ASK_THREADS = [
    "1psx5ju", "1jrpq4p", "1h3idq5", "1sfs9i5", "1x9ffma", "1k233ov", "1x7bwxb",
    "1wsuhuj", "1lf1fp1", "1q4cdgu", "1hjukgb", "1iin1y4", "1jdft4r", "1jns6bb", "1m4tbrk", "1kmbco1",
]
# id -> group shown on the page: "skip" = use no builder, "builder" = names one, "us" = mentions EasyFreeResume
QUOTES = {"nve3nsv": "skip", "m39obzi": "skip", "nvdosvl": "skip", "lzrfr72": "skip", "oeznk1w": "skip",
          "nvcysaj": "builder", "nvfg4e9": "builder", "mb6vxdk": "builder", "nxccoes": "us"}
MD_LINK = re.compile(r"\[([^\]]+)\]\([^)]+\)")
SKIP_AUTHORS = {"AutoModerator", "[deleted]"}


def tools():
    src = (Path(__file__).parent / "reddit_pull.py").read_text(encoding="utf-8")
    block = re.search(r"TOOLS = \{(.*?)\n\}", src, re.S).group(1)
    return {k: re.compile(v, re.I) for k, v in re.findall(r'"([^"]+)": r"([^"]+)"', block)}


def build(summary, comments_by_thread):
    by_id = {t["id"]: t for t in summary["threads"]}
    ask = [by_id[i] for i in ASK_THREADS if i in by_id]
    rx = tools()
    agg = {k: {"threads": set(), "comments": 0, "upvotes": 0} for k in rx}
    cmap, seen = {}, set()
    for t in ask:
        for c in comments_by_thread[t["id"]]:
            body = c["body"].strip()
            if c.get("author") in SKIP_AUTHORS or body in seen:  # copy-pasted comments count once
                continue
            seen.add(body)
            cmap[c["id"]] = (t, c)
            for k, r in rx.items():
                if r.search(c["body"]):
                    a = agg[k]; a["threads"].add(t["id"]); a["comments"] += 1; a["upvotes"] += max(c.get("score") or 0, 0)
    rows = sorted(({"tool": k, "threads": len(v["threads"]), "comments": v["comments"], "upvotes": v["upvotes"]}
                   for k, v in agg.items() if v["comments"]), key=lambda r: (-r["upvotes"], -r["threads"]))
    quotes = []
    for cid, group in QUOTES.items():
        t, c = cmap[cid]  # KeyError = quote not in an ask thread
        quotes.append({"id": cid, "group": group, "sub": t["sub"], "thread": t["title"], "score": c["score"], "body": MD_LINK.sub(r"\1", c["body"]).strip(),
                       "url": f"{t['url'].rstrip('/')}/comment/{cid}/"})
    return {
        "pulled_utc": summary["pulled_utc"], "source": summary["source"], "subs": summary["subs"],
        "queries": summary["queries"], "from": summary["windows"][0][0], "to": summary["windows"][-1][1],
        "searches_skipped": len(summary["skipped_requests"]),
        "threads": [{k: t[k] for k in ("id", "sub", "title", "url", "score", "comments", "created_utc")} for t in ask],
        "comments_read": len(cmap), "mentions": rows, "quotes": quotes,
    }


def selfcheck():
    s = {"pulled_utc": "x", "source": "s", "subs": ["resumes"], "queries": ["q"], "windows": [["a", "b"]], "skipped_requests": [],
         "threads": [{"id": "1psx5ju", "sub": "jobs", "title": "T", "url": "https://www.reddit.com/r/jobs/comments/1psx5ju/t/",
                      "score": 1, "comments": 2, "created_utc": 0}]}
    cs = {"1psx5ju": [{"id": "nve3nsv", "author": "a", "score": 12, "body": "The default Google Docs template."},
                      {"id": "z", "author": "AutoModerator", "score": 99, "body": "google docs"},
                      {"id": "d", "author": "b", "score": 5, "body": "The default Google Docs template."}]}
    global QUOTES
    saved, QUOTES = QUOTES, {"nve3nsv": "skip"}
    out = build(s, cs)
    QUOTES = saved
    assert out["mentions"] == [{"tool": "Google Docs", "threads": 1, "comments": 1, "upvotes": 12}], out["mentions"]
    assert out["quotes"][0]["url"] == "https://www.reddit.com/r/jobs/comments/1psx5ju/t/comment/nve3nsv/"
    assert out["comments_read"] == 1
    assert MD_LINK.sub(r"\1", "try [a.com](http://a.com) now") == "try a.com now"


if __name__ == "__main__":
    selfcheck()
    if DATA:
        summary = json.loads((DATA / "summary.json").read_text(encoding="utf-8"))
        comments = {t["id"]: json.loads((DATA / f"comments_{t['id']}.json").read_text(encoding="utf-8")) for t in summary["threads"]}
        out = build(summary, comments)
        OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        for r in out["mentions"]:
            print(f"{r['tool']:28} threads={r['threads']:3} comments={r['comments']:4} upvotes={r['upvotes']}")
        print(len(out["threads"]), "threads,", out["comments_read"], "comments ->", OUT)
