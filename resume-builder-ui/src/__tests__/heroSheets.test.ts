import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(srcDir, "..", "public");
const landing = readFileSync(join(srcDir, "components/LandingPage.tsx"), "utf8");

const slugs = Array.from(
  landing.match(/const HERO_SHEETS = \[([^\]]*)\]/)?.[1].matchAll(/"([^"]+)"/g) ?? [],
  ([, slug]) => slug,
);

// The hero deals through pre-rendered previews of the real templates. They are
// plain files under public/, so a template rename or a tidy-up of public/hero
// breaks the hero silently — the sheets just render as blank white paper, which
// looks deliberate. These two checks are the cheap guard against that, and
// against the LCP budget quietly drifting: the face-up sheet is eager and
// high-priority on the page that carries most of the site's search traffic.
describe("hero template sheets", () => {
  it("has a file on disk for every sheet the hero deals", () => {
    expect(slugs.length).toBeGreaterThan(1);

    for (const slug of slugs) {
      const file = join(publicDir, "hero", `${slug}.webp`);
      expect(() => statSync(file), `${slug}.webp missing from public/hero`).not.toThrow();
    }
  });

  it("keeps the eagerly loaded face-up sheet inside its byte budget", () => {
    const faceUp = join(publicDir, "hero", `${slugs[0]}.webp`);
    expect(statSync(faceUp).size).toBeLessThan(60 * 1024);
  });
});
