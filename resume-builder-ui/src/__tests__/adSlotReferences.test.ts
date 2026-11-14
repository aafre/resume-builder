import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const adConfig = readFileSync(join(srcDir, "config/ads.ts"), "utf8");
const slotsBlock = adConfig.match(/slots:\s*\{([\s\S]*?)\}/)?.[1] ?? "";
const slotNames = Array.from(slotsBlock.matchAll(/^\s*([a-zA-Z0-9]+):\s*"[^"]+"/gm), ([, name]) => name);

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

  it("keeps the global mobile top slot, suppressed only on routes that render it themselves", () => {
    const landing = readFileSync(join(srcDir, "components/LandingPage.tsx"), "utf8");
    const sideRail = readFileSync(join(srcDir, "components/ads/SideRailLayout.tsx"), "utf8");
    const app = readFileSync(join(srcDir, "App.tsx"), "utf8");
    const heroHeadline = landing.indexOf("Free Resume Builder");
    const statsStart = landing.indexOf("{/* ═══════════ STATS");
    const mobileTop = landing.indexOf("AD_CONFIG.slots.mobileTop");

    expect(heroHeadline, "hero headline marker").toBeGreaterThan(-1);
    expect(statsStart, "stats section marker").toBeGreaterThan(-1);
    expect(mobileTop, "mobile top slot reference").toBeGreaterThan(-1);

    // Landing renders its own mobile-top below the hero (UX: hero stays ad-free)
    expect(mobileTop).toBeGreaterThan(heroHeadline);
    expect(mobileTop).toBeLessThan(statsStart);

    // All other non-editor pages keep the global mobile-top (revenue inventory)
    expect(sideRail).toContain("AD_CONFIG.slots.mobileTop");

    // Opt-out routes must not double-serve the slot, and each must render it itself
    expect(app).toContain('const SELF_MOBILE_TOP_ROUTES = new Set(["/", "/resume-keyword-scanner"]);');
    expect(app).toContain("showMobileTop={!SELF_MOBILE_TOP_ROUTES.has(location.pathname)}");

    // Scanner renders it below the tool and results, so the tool stays above the fold on phones
    const scanner = readFileSync(join(srcDir, "components/tools/ResumeKeywordScanner.tsx"), "utf8");
    const scannerSlot = scanner.indexOf("AD_CONFIG.slots.mobileTop");
    expect(scannerSlot, "scanner mobile top slot").toBeGreaterThan(scanner.indexOf("{/* Results */}"));
  });

  it("runs no explicit ad slots on the low-ad student page (seo-growth ticket 07)", () => {
    const app = readFileSync(join(srcDir, "App.tsx"), "utf8");
    expect(app).toContain('const LOW_AD_ROUTES = new Set(["/free-resume-builder-for-students"]);');
    expect(app).toContain("enabled={!isEditorPage && !LOW_AD_ROUTES.has(location.pathname)}");
    const page = readFileSync(join(srcDir, "components/seo/ResumeBuilderForStudents.tsx"), "utf8");
    expect(page).not.toMatch(/InContentAd|InFeedAd|AdContainer/);
  });
});
