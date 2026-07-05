import { describe, it, expect, beforeEach, vi } from "vitest";

const SELECTOR = 'script[data-trustpilot-loader]';

describe("ensureTrustpilotLoaded", () => {
  beforeEach(() => {
    // Fresh module each test so the internal load-promise cache resets.
    vi.resetModules();
    delete window.Trustpilot;
    document.head.querySelectorAll(SELECTOR).forEach((s) => s.remove());
  });

  it("injects the bootstrap script exactly once even when called twice", async () => {
    const { ensureTrustpilotLoaded } = await import("../trustpilot");
    const p1 = ensureTrustpilotLoaded();
    const p2 = ensureTrustpilotLoaded();

    const scripts = document.head.querySelectorAll(SELECTOR);
    expect(scripts.length).toBe(1);

    // Simulate the external script finishing load.
    window.Trustpilot = { loadFromElement: vi.fn() };
    scripts[0].dispatchEvent(new Event("load"));

    await Promise.all([p1, p2]);
    expect(window.Trustpilot).toBeDefined();
  });

  it("resolves immediately and injects nothing if Trustpilot is already present", async () => {
    window.Trustpilot = { loadFromElement: vi.fn() };
    const { ensureTrustpilotLoaded } = await import("../trustpilot");

    await ensureTrustpilotLoaded();
    expect(document.head.querySelectorAll(SELECTOR).length).toBe(0);
  });
});
