/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { blogPosts } from "../data/blogPosts";

describe("blogPosts", () => {
  it("registers the AI resume prompts hub as a live post with current freshness metadata", () => {
    const hubPost = blogPosts.find((post) => post.slug === "ai-resume-prompts-hub");

    expect(hubPost).toMatchObject({
      slug: "ai-resume-prompts-hub",
      publishDate: "2026-05-13",
      lastUpdated: "2026-05-13",
      readTime: "12 min",
      category: "AI & Tools",
    });
    expect(hubPost).toBeDefined();
    expect("redirectTo" in hubPost!).toBe(false);
  });
});
