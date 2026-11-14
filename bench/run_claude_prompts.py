"""Run every prompt published on /blog/claude-resume-prompts through Claude and save the raw outputs.

Prompts are read from the page source itself, so the tested text is always the published text.
Placeholders are filled from bench/fills.json (a fictional sample candidate).

    python bench/run_claude_prompts.py [--model claude-sonnet-5-5] [--only 3,7]

Calls `claude -p` with no tools, no settings, no MCP and a one-line system prompt. claude.ai adds its own
system prompt, so chat-app output can differ a little.
"""
import argparse, html, json, re, subprocess, sys, tempfile, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "resume-builder-ui/src/components/blog/ClaudeResumePrompts.tsx"
OUT = ROOT / "resume-builder-ui/src/data/claudePromptRuns.json"
FIX = ROOT / "bench/fixtures"
SYSTEM = "You are Claude, an AI assistant made by Anthropic."
BLOCK = re.compile(r'<CopyablePrompt title="Prompt #(\d+): ([^"]+)"[^>]*>(.*?)</CopyablePrompt>', re.S)
LEFTOVER = re.compile(r"\[[A-Z][^\]]*\]")


def extract(src: str) -> list[dict]:
    out = []
    for n, title, body in BLOCK.findall(src):
        text = " ".join(l.strip() for l in body.splitlines() if l.strip())  # JSX whitespace rule
        text = html.unescape(re.sub(r" ?<br\s*/> ?", "\n", text))
        out.append({"n": int(n), "title": title, "template": text.strip()})
    return out


def fill(template: str, values: dict) -> str:
    for k, v in values.items():
        v = (FIX / v[1:]).read_text(encoding="utf-8").strip() if v.startswith("@") else v
        template = template.replace(f"[{k}]", v)
    if m := LEFTOVER.search(template):
        raise ValueError(f"unfilled placeholder {m.group()}")
    return template


def run(prompt: str, model: str) -> str:
    with tempfile.TemporaryDirectory() as d:  # empty cwd: no CLAUDE.md or project context
        r = subprocess.run(
            ["claude", "-p", "--setting-sources", "", "--tools", "", "--strict-mcp-config",
             "--disable-slash-commands", "--no-session-persistence", "--model", model, "--system-prompt", SYSTEM],
            input=prompt, capture_output=True, text=True, encoding="utf-8", cwd=d, timeout=600, shell=sys.platform == "win32")
    if r.returncode or not r.stdout.strip():
        raise RuntimeError(r.stderr or "empty output")
    return r.stdout.strip()


def selfcheck():
    s = '<CopyablePrompt title="Prompt #9: T" bestFor="x">\n  Hi [NAME]<br />\n  &quot;ok&quot;\n</CopyablePrompt>'
    p = extract(s)
    assert p == [{"n": 9, "title": "T", "template": 'Hi [NAME]\n"ok"'}], p
    assert fill(p[0]["template"], {"NAME": "Sam"}) == 'Hi Sam\n"ok"'
    try:
        fill("Hi [NAME]", {}); raise AssertionError("leftover not caught")
    except ValueError:
        pass


if __name__ == "__main__":
    selfcheck()
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="claude-sonnet-5-5")
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    prompts = extract(PAGE.read_text(encoding="utf-8"))
    assert [p["n"] for p in prompts] == list(range(1, 26)), [p["n"] for p in prompts]
    fills = json.loads((ROOT / "bench/fills.json").read_text(encoding="utf-8"))
    for p in prompts:
        p["prompt"] = fill(p["template"], fills[str(p["n"])])  # fail before spending any calls
    only = {int(x) for x in a.only.split(",") if x}
    todo = [p for p in prompts if not only or p["n"] in only]

    prev = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {"results": []}
    done = {r["n"]: r for r in prev["results"] if r.get("model") == a.model}

    def go(p):
        t = time.time(); o = run(p["prompt"], a.model)
        print(f"#{p['n']:>2} {time.time() - t:5.0f}s {len(o.split()):4}w", flush=True)
        return {"n": p["n"], "title": p["title"], "prompt": p["prompt"], "output": o, "model": a.model,
                "ran_utc": time.strftime("%Y-%m-%d", time.gmtime())}

    with ThreadPoolExecutor(4) as ex:
        for r in ex.map(go, todo):
            done[r["n"]] = r
    ver = subprocess.run(["claude", "--version"], capture_output=True, text=True, shell=sys.platform == "win32").stdout.strip()
    OUT.write_text(json.dumps({"cli": ver, "system_prompt": SYSTEM, "results": [done[k] for k in sorted(done)]},
                              indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} ({len(done)} prompts)")
