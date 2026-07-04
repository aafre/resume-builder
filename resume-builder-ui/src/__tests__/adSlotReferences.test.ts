import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcDir = join(process.cwd(), "src");
const adConfig = readFileSync(join(srcDir, "config/ads.ts"), "utf8");
const slotNames = Array.from(adConfig.matchAll(/^\s{4}([a-zA-Z0-9]+):\s"[^"]+"/gm), ([, name]) => name);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });

describe("ad slot references", () => {
  it("keeps every configured slot referenced by UI source", () => {
    const source = walk(srcDir)
      .filter((file) => /\.(ts|tsx)$/.test(file))
      .filter((file) => !file.replace(/\\/g, "/").endsWith("config/ads.ts"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(slotNames.length).toBeGreaterThan(0);

    for (const slotName of slotNames) {
      expect(source, slotName).toContain(`AD_CONFIG.slots.${slotName}`);
    }
  });

  it("places the mobile top slot after landing hero, not in the global side-rail wrapper", () => {
    const landing = readFileSync(join(srcDir, "components/LandingPage.tsx"), "utf8");
    const sideRail = readFileSync(join(srcDir, "components/ads/SideRailLayout.tsx"), "utf8");
    const heroHeadline = landing.indexOf("Free Resume Builder");
    const statsStart = landing.indexOf("{/* ═══════════ STATS");
    const mobileTop = landing.indexOf("AD_CONFIG.slots.mobileTop");

    expect(heroHeadline, "hero headline marker").toBeGreaterThan(-1);
    expect(statsStart, "stats section marker").toBeGreaterThan(-1);
    expect(mobileTop, "mobile top slot reference").toBeGreaterThan(-1);

    expect(mobileTop).toBeGreaterThan(heroHeadline);
    expect(mobileTop).toBeLessThan(statsStart);
    expect(sideRail).not.toContain("AD_CONFIG.slots.mobileTop");
  });
});
