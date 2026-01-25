import { useMemo } from "react";

export interface WordCountResult {
  /**
   * Total word count of the content
   */
  wordCount: number;
  /**
   * Number of ads allowed based on word count
   * - <400 words: 0 ads
   * - 400-599 words: 1 ad
   * - 600+ words: 1 ad per 600 words, max 3
   */
  allowedAds: number;
  /**
   * Whether any ads are allowed
   */
  canShowAds: boolean;
  /**
   * Recommended positions for ad insertion (as percentages of content)
   * For 1 ad: [50%]
   * For 2 ads: [33%, 66%]
   * For 3 ads: [25%, 50%, 75%]
   */
  adPositions: number[];
}

export interface UseWordCountOptions {
  /**
   * Minimum words required to show any ads
   * Default: 400
   */
  minWordsForAds?: number;
  /**
   * Words per ad after minimum threshold
   * Default: 600
   */
  wordsPerAd?: number;
  /**
   * Maximum number of ads allowed
   * Default: 3
   */
  maxAds?: number;
}

/**
 * Counts words in a string, handling common edge cases.
 * Strips HTML tags and counts only actual words.
 */
const countWords = (content: string): number => {
  if (!content || typeof content !== "string") {
    return 0;
  }

  // Strip HTML tags
  const textOnly = content.replace(/<[^>]*>/g, " ");

  // Normalize whitespace and split into words
  const words = textOnly
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return words.length;
};

/**
 * Calculate ad positions as percentages of content length.
 * Distributes ads evenly throughout content.
 */
const calculateAdPositions = (numAds: number): number[] => {
  if (numAds <= 0) return [];
  if (numAds === 1) return [50];
  if (numAds === 2) return [33, 66];
  // For 3+ ads, distribute evenly
  const positions: number[] = [];
  const step = 100 / (numAds + 1);
  for (let i = 1; i <= numAds; i++) {
    positions.push(Math.round(step * i));
  }
  return positions;
};

/**
 * Hook for calculating word count and determining ad allowance for blog posts.
 *
 * Implements word-gating rules:
 * - <400 words: No ads (content too short)
 * - 400-599 words: 1 ad
 * - 600+ words: 1 ad per 600 words, maximum 3
 *
 * @param content - The text content to analyze (can include HTML)
 * @param options - Configuration options
 * @returns WordCountResult with count, allowed ads, and suggested positions
 *
 * @example
 * ```tsx
 * const BlogPost = ({ content }) => {
 *   const { canShowAds, allowedAds, adPositions } = useWordCount(content);
 *
 *   return (
 *     <article>
 *       {renderContentWithAds(content, canShowAds ? allowedAds : 0, adPositions)}
 *     </article>
 *   );
 * };
 * ```
 */
export const useWordCount = (
  content: string,
  options: UseWordCountOptions = {}
): WordCountResult => {
  const { minWordsForAds = 400, wordsPerAd = 600, maxAds = 3 } = options;

  return useMemo(() => {
    const wordCount = countWords(content);

    // No ads for short content
    if (wordCount < minWordsForAds) {
      return {
        wordCount,
        allowedAds: 0,
        canShowAds: false,
        adPositions: [],
      };
    }

    // Calculate number of ads based on word count
    // 400-599 words: 1 ad
    // 600-1199 words: 1 ad (at least 600 words)
    // 1200-1799 words: 2 ads (at least 1200 words)
    // etc.
    // If word count is above the minimum, allow at least 1 ad.
    const adsByWordCount = Math.floor(wordCount / wordsPerAd);
    const baseAds = adsByWordCount > 0 ? adsByWordCount : 1;
    const allowedAds = Math.min(baseAds, maxAds);

    const adPositions = calculateAdPositions(allowedAds);

    return {
      wordCount,
      allowedAds,
      canShowAds: allowedAds > 0,
      adPositions,
    };
  }, [content, minWordsForAds, wordsPerAd, maxAds]);
};

export default useWordCount;
