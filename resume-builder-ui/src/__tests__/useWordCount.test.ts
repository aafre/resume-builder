import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useWordCount } from "../hooks/useWordCount";

describe("useWordCount", () => {
  describe("word counting", () => {
    it("counts words in simple text", () => {
      const { result } = renderHook(() => useWordCount("Hello world"));
      expect(result.current.wordCount).toBe(2);
    });

    it("handles empty string", () => {
      const { result } = renderHook(() => useWordCount(""));
      expect(result.current.wordCount).toBe(0);
    });

    it("handles whitespace only", () => {
      const { result } = renderHook(() => useWordCount("   \n\t  "));
      expect(result.current.wordCount).toBe(0);
    });

    it("handles multiple spaces between words", () => {
      const { result } = renderHook(() =>
        useWordCount("Hello    world   test")
      );
      expect(result.current.wordCount).toBe(3);
    });

    it("strips HTML tags from content", () => {
      const { result } = renderHook(() =>
        useWordCount("<p>Hello <strong>world</strong></p>")
      );
      expect(result.current.wordCount).toBe(2);
    });

    it("handles complex HTML content", () => {
      const content = `
        <div>
          <h1>Title</h1>
          <p>This is a paragraph with <a href="#">a link</a> and some text.</p>
          <ul>
            <li>Item one</li>
            <li>Item two</li>
          </ul>
        </div>
      `;
      const { result } = renderHook(() => useWordCount(content));
      // "Title This is a paragraph with a link and some text. Item one Item two" = 15 words
      expect(result.current.wordCount).toBe(15);
    });

    it("handles newlines in text", () => {
      const { result } = renderHook(() =>
        useWordCount("Hello\nworld\ntest")
      );
      expect(result.current.wordCount).toBe(3);
    });
  });

  describe("ad allowance - default settings", () => {
    it("returns 0 ads for content under 400 words", () => {
      const shortContent = "word ".repeat(399);
      const { result } = renderHook(() => useWordCount(shortContent));

      expect(result.current.allowedAds).toBe(0);
      expect(result.current.canShowAds).toBe(false);
      expect(result.current.adPositions).toEqual([]);
    });

    it("returns 1 ad for exactly 400 words", () => {
      const content = "word ".repeat(400);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(1);
      expect(result.current.canShowAds).toBe(true);
    });

    it("returns 1 ad for 400-599 words", () => {
      const content = "word ".repeat(500);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(1);
      expect(result.current.canShowAds).toBe(true);
    });

    it("returns 1 ad for exactly 600 words", () => {
      const content = "word ".repeat(600);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(1);
      expect(result.current.canShowAds).toBe(true);
    });

    it("returns 1 ad for 600-1199 words", () => {
      const content = "word ".repeat(1000);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(1);
      expect(result.current.canShowAds).toBe(true);
    });

    it("returns 2 ads for 1200+ words", () => {
      const content = "word ".repeat(1200);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(2);
      expect(result.current.canShowAds).toBe(true);
    });

    it("returns 3 ads for 1800+ words", () => {
      const content = "word ".repeat(1800);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(3);
      expect(result.current.canShowAds).toBe(true);
    });

    it("caps at 3 ads maximum for very long content", () => {
      const content = "word ".repeat(5000);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.allowedAds).toBe(3);
    });
  });

  describe("ad positions", () => {
    it("returns [50] for 1 ad", () => {
      const content = "word ".repeat(500);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.adPositions).toEqual([50]);
    });

    it("returns [33, 66] for 2 ads", () => {
      const content = "word ".repeat(1200);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.adPositions).toEqual([33, 66]);
    });

    it("returns [25, 50, 75] for 3 ads", () => {
      const content = "word ".repeat(1800);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.adPositions).toEqual([25, 50, 75]);
    });

    it("returns empty array for 0 ads", () => {
      const content = "word ".repeat(100);
      const { result } = renderHook(() => useWordCount(content));

      expect(result.current.adPositions).toEqual([]);
    });
  });

  describe("custom options", () => {
    it("respects custom minWordsForAds", () => {
      const content = "word ".repeat(200);

      // Default: no ads at 200 words
      const { result: defaultResult } = renderHook(() => useWordCount(content));
      expect(defaultResult.current.canShowAds).toBe(false);

      // Custom: allow ads at 100 words
      const { result: customResult } = renderHook(() =>
        useWordCount(content, { minWordsForAds: 100 })
      );
      expect(customResult.current.canShowAds).toBe(true);
      expect(customResult.current.allowedAds).toBe(1);
    });

    it("respects custom wordsPerAd", () => {
      const content = "word ".repeat(600);

      // Default: 1 ad at 600 words (600/600 = 1)
      const { result: defaultResult } = renderHook(() => useWordCount(content));
      expect(defaultResult.current.allowedAds).toBe(1);

      // Custom: 2 ads at 600 words with 300 wordsPerAd (600/300 = 2)
      const { result: customResult } = renderHook(() =>
        useWordCount(content, { wordsPerAd: 300 })
      );
      expect(customResult.current.allowedAds).toBe(2);
    });

    it("respects custom maxAds", () => {
      const content = "word ".repeat(5000);

      // Default: max 3 ads
      const { result: defaultResult } = renderHook(() => useWordCount(content));
      expect(defaultResult.current.allowedAds).toBe(3);

      // Custom: max 1 ad
      const { result: customResult } = renderHook(() =>
        useWordCount(content, { maxAds: 1 })
      );
      expect(customResult.current.allowedAds).toBe(1);
    });

    it("combines multiple custom options", () => {
      const content = "word ".repeat(300);

      const { result } = renderHook(() =>
        useWordCount(content, {
          minWordsForAds: 200,
          wordsPerAd: 100,
          maxAds: 2,
        })
      );

      // 300 words, min 200, 100 per ad = 3 ads, but max 2
      expect(result.current.allowedAds).toBe(2);
      expect(result.current.canShowAds).toBe(true);
      expect(result.current.adPositions).toEqual([33, 66]);
    });
  });

  describe("memoization", () => {
    it("returns same result object for same content", () => {
      const content = "word ".repeat(500);
      const { result, rerender } = renderHook(() => useWordCount(content));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it("recalculates when content changes", () => {
      const { result, rerender } = renderHook(
        ({ content }) => useWordCount(content),
        { initialProps: { content: "word ".repeat(500) } }
      );

      expect(result.current.wordCount).toBe(500);

      rerender({ content: "word ".repeat(1000) });

      expect(result.current.wordCount).toBe(1000);
    });
  });

  describe("edge cases", () => {
    it("handles null-like content gracefully", () => {
      // @ts-expect-error - testing runtime behavior with invalid input
      const { result } = renderHook(() => useWordCount(null));
      expect(result.current.wordCount).toBe(0);
    });

    it("handles undefined-like content gracefully", () => {
      // @ts-expect-error - testing runtime behavior with invalid input
      const { result } = renderHook(() => useWordCount(undefined));
      expect(result.current.wordCount).toBe(0);
    });

    it("handles content with only HTML tags", () => {
      const { result } = renderHook(() =>
        useWordCount("<div></div><span></span>")
      );
      expect(result.current.wordCount).toBe(0);
    });

    it("handles content with special characters", () => {
      const { result } = renderHook(() =>
        useWordCount("Hello! World? Test-case & more...")
      );
      // "Hello! World? Test-case & more..." = 5 words
      expect(result.current.wordCount).toBe(5);
    });

    it("handles content with numbers", () => {
      const { result } = renderHook(() =>
        useWordCount("I have 3 apples and 5 oranges")
      );
      expect(result.current.wordCount).toBe(7);
    });
  });
});
