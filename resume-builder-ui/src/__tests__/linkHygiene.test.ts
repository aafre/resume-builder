/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { blogPosts } from "../data/blogPosts";

// app.py lives at the repo root, one level above resume-builder-ui/. Tests
// run with cwd = resume-builder-ui (npx vitest run), so this resolves the
// same way in CI and locally.
const APP_PY_PATH = resolve(process.cwd(), "../app.py");
const BLOG_INDEX_PATH = resolve(process.cwd(), "src/components/BlogIndex.tsx");
const LLMS_TXT_PATH = resolve(process.cwd(), "public/llms.txt");
const LLMS_FULL_TXT_PATH = resolve(process.cwd(), "public/llms-full.txt");

/**
 * Parse app.py's `@app.route(...)` handlers for 301 redirects and 410 Gone
 * routes. Each source path maps to either its redirect destination or the
 * literal "410".
 */
function parseRedirectAndGoneRoutes(appPySource: string): Map<string, string> {
  const routeToOutcome = new Map<string, string>();
  const routeBlocks = appPySource.split(/(?=@app\.route\()/);

  for (const block of routeBlocks) {
    const routeMatch = block.match(/^@app\.route\(\s*"([^"]+)"\s*(?:,|\))/);
    if (!routeMatch) continue;
    const source = routeMatch[1];
    if (source.includes("<")) continue; // dynamic routes, not link targets

    const redirectMatch = block.match(/redirect\(\s*"([^"]+)"\s*,\s*code=301\s*\)/);
    if (redirectMatch) {
      routeToOutcome.set(source, redirectMatch[1]);
      continue;
    }

    if (/\),\s*410\b/.test(block) || /^\s*return\s+"",\s*410/m.test(block)) {
      routeToOutcome.set(source, "410");
    }
  }

  return routeToOutcome;
}

/** Pull every https://easyfreeresume.com/... internal link out of a markdown/text file. */
function extractInternalPaths(text: string): string[] {
  const matches = text.matchAll(/https:\/\/easyfreeresume\.com(\/[a-zA-Z0-9/_-]*)/g);
  return Array.from(matches, (m) => m[1]);
}

describe("internal link hygiene", () => {
  const appPySource = readFileSync(APP_PY_PATH, "utf-8");
  const redirectsAndGone = parseRedirectAndGoneRoutes(appPySource);

  it("finds at least the known redirect/410 routes in app.py (parser sanity check)", () => {
    expect(redirectsAndGone.get("/blog/chatgpt-resume-prompts")).toBe("410");
    expect(redirectsAndGone.get("/blog/zety-vs-easy-free-resume")).toBe(
      "/easyfreeresume-vs-zety"
    );
  });

  it("llms.txt has no links to a redirect source or a 410 route", () => {
    const paths = extractInternalPaths(readFileSync(LLMS_TXT_PATH, "utf-8"));
    const stale = paths.filter((p) => redirectsAndGone.has(p));
    expect(stale).toEqual([]);
  });

  it("llms-full.txt has no links to a redirect source or a 410 route", () => {
    const paths = extractInternalPaths(readFileSync(LLMS_FULL_TXT_PATH, "utf-8"));
    const stale = paths.filter((p) => redirectsAndGone.has(p));
    expect(stale).toEqual([]);
  });

  it("BlogIndex renders every blogPosts slug through a link that is not a redirect source", () => {
    const blogIndexSource = readFileSync(BLOG_INDEX_PATH, "utf-8");

    // Pull the CANONICAL_LINK_OVERRIDE map out of BlogIndex.tsx so this test
    // fails if the override map ever drifts out of sync with the redirects
    // in app.py, without re-implementing React rendering here.
    const overrideBlockMatch = blogIndexSource.match(
      /CANONICAL_LINK_OVERRIDE: Record<string, string> = \{([\s\S]*?)\};/
    );
    const overrides: Record<string, string> = {};
    if (overrideBlockMatch) {
      for (const entryMatch of overrideBlockMatch[1].matchAll(
        /"([^"]+)":\s*"([^"]+)"/g
      )) {
        overrides[entryMatch[1]] = entryMatch[2];
      }
    }

    const staleLinks = blogPosts
      .map((post) => ({
        slug: post.slug,
        href: overrides[post.slug] ?? `/blog/${post.slug}`,
      }))
      .filter(({ href }) => redirectsAndGone.has(href));

    expect(staleLinks).toEqual([]);
  });
});
