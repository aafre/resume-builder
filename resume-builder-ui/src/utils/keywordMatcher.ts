/**
 * Client-side keyword matching engine for ATS Resume Keyword Scanner
 * Extracts keywords from a job description and matches them against resume text.
 */

/** A single matched or missing keyword with metadata */
export interface KeywordResult {
  keyword: string;
  found: boolean;
  /** Number of times the keyword appears in the resume */
  count: number;
  /** Suggested section to place the keyword */
  suggestedPlacement?: string;
}

/** Full scan result */
export interface ScanResult {
  matchPercentage: number;
  totalKeywords: number;
  matchedCount: number;
  missingCount: number;
  matched: KeywordResult[];
  missing: KeywordResult[];
}

// Common English stop words to filter out
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
  'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it', 'its',
  'we', 'our', 'you', 'your', 'they', 'their', 'he', 'she', 'him', 'her',
  'not', 'no', 'nor', 'as', 'if', 'then', 'than', 'too', 'very', 'just',
  'about', 'above', 'after', 'again', 'all', 'also', 'am', 'any', 'because',
  'before', 'between', 'both', 'each', 'few', 'more', 'most', 'other',
  'over', 'same', 'so', 'some', 'such', 'through', 'under', 'until',
  'up', 'what', 'when', 'where', 'while', 'how', 'out', 'into', 'during',
  'here', 'there', 'only', 'own', 'my', 'me', 'i',
]);

// Generic job posting filler words
const JOB_FILLER = new Set([
  'experience', 'required', 'preferred', 'ability', 'skills', 'including',
  'work', 'working', 'position', 'role', 'company', 'team', 'opportunity',
  'responsibilities', 'requirements', 'qualifications', 'candidate',
  'apply', 'job', 'description', 'employment', 'equal', 'employer',
  'benefits', 'salary', 'competitive', 'full-time', 'part-time',
  'minimum', 'years', 'degree', 'bachelor', 'master', 'education',
]);

// Placement suggestions based on keyword type
const PLACEMENT_RULES: Array<{ pattern: RegExp; placement: string }> = [
  { pattern: /^(python|java|javascript|typescript|c\+\+|ruby|go|rust|php|swift|kotlin|scala|r|matlab|sql|html|css|sass|less)$/i, placement: 'Skills section — Technical Skills' },
  { pattern: /^(react|angular|vue|node|express|django|flask|spring|rails|next\.?js|nuxt|svelte|laravel|asp\.net)$/i, placement: 'Skills section — Frameworks' },
  { pattern: /^(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd|git|linux|nginx|apache)$/i, placement: 'Skills section — Tools & Infrastructure' },
  { pattern: /^(excel|powerpoint|word|salesforce|hubspot|jira|confluence|slack|figma|sketch|photoshop|tableau|power\s?bi)$/i, placement: 'Skills section — Software' },
  { pattern: /(certified|certification|license|cpa|pmp|scrum|cissp|aws\s+certified)/i, placement: 'Certifications section' },
  { pattern: /(managed|led|directed|oversaw|coordinated|supervised|mentored)/i, placement: 'Experience section — action verbs in bullet points' },
  { pattern: /(increased|decreased|improved|reduced|grew|achieved|delivered|generated|saved)/i, placement: 'Experience section — accomplishment bullets' },
  { pattern: /(agile|scrum|kanban|waterfall|lean|six\s+sigma|sdlc)/i, placement: 'Skills section — Methodologies' },
];

function getSuggestedPlacement(keyword: string): string {
  for (const rule of PLACEMENT_RULES) {
    if (rule.pattern.test(keyword)) {
      return rule.placement;
    }
  }
  return 'Skills section or Experience bullet points';
}

/**
 * Normalize text for comparison — lowercase, collapse whitespace
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/['']/g, "'").replace(/\s+/g, ' ').trim();
}

/**
 * Extract meaningful keyword phrases from job description text.
 * Uses a combination of single words and 2-3 word phrases (bigrams/trigrams).
 */
export function extractKeywords(jobDescription: string): string[] {
  const text = normalize(jobDescription);

  // Split into sentences, then words
  const sentences = text.split(/[.!?;]\s+/);
  const keywordSet = new Map<string, number>();

  for (const sentence of sentences) {
    const words = sentence
      .replace(/[^a-z0-9\s/+#.'-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    // Single words (skip stop words and filler)
    for (const word of words) {
      const clean = word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (clean.length > 2 && !STOP_WORDS.has(clean) && !JOB_FILLER.has(clean)) {
        keywordSet.set(clean, (keywordSet.get(clean) || 0) + 1);
      }
    }

    // Bigrams (2-word phrases)
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length > 1 && b.length > 1) {
        const bigram = `${a} ${b}`;
        // Only keep bigrams where at least one word is not a stop word
        if (!STOP_WORDS.has(a) || !STOP_WORDS.has(b)) {
          if (!STOP_WORDS.has(a) && !STOP_WORDS.has(b)) {
            keywordSet.set(bigram, (keywordSet.get(bigram) || 0) + 1);
          }
        }
      }
    }

    // Trigrams (3-word phrases)
    for (let i = 0; i < words.length - 2; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const c = words[i + 2].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length > 1 && b.length > 1 && c.length > 1) {
        if (!STOP_WORDS.has(a) && !STOP_WORDS.has(c)) {
          const trigram = `${a} ${b} ${c}`;
          keywordSet.set(trigram, (keywordSet.get(trigram) || 0) + 1);
        }
      }
    }
  }

  // Filter: keep keywords that appear 2+ times (for single words) or 1+ for phrases
  // Also deduplicate: if a bigram contains a frequent single word, prefer the bigram
  const results: string[] = [];
  const sorted = [...keywordSet.entries()].sort((a, b) => b[1] - a[1]);

  const added = new Set<string>();
  for (const [keyword, count] of sorted) {
    const wordCount = keyword.split(' ').length;

    // Single words need count >= 2 to be included (unless they look technical)
    if (wordCount === 1 && count < 2) {
      // Allow technical-looking terms even with count 1
      if (!/[+#\/.]/.test(keyword) && keyword.length < 5) continue;
    }

    // Skip single word if it is already part of a higher-ranked phrase
    if (wordCount === 1) {
      let subsumed = false;
      for (const existing of added) {
        if (existing.split(' ').length > 1 && existing.includes(keyword)) {
          subsumed = true;
          break;
        }
      }
      if (subsumed) continue;
    }

    added.add(keyword);
    results.push(keyword);

    if (results.length >= 40) break; // Cap at 40 keywords
  }

  return results;
}

/**
 * Count occurrences of a keyword in text (case-insensitive, word-boundary aware)
 */
function countOccurrences(keyword: string, text: string): number {
  // Escape special regex chars
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Use word boundary for single words, looser match for phrases
  const pattern = keyword.includes(' ')
    ? new RegExp(escaped, 'gi')
    : new RegExp(`\\b${escaped}\\b`, 'gi');
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Scan resume text against extracted job description keywords
 */
export function scanResume(resumeText: string, jobDescription: string): ScanResult {
  const keywords = extractKeywords(jobDescription);
  const normalizedResume = normalize(resumeText);

  const matched: KeywordResult[] = [];
  const missing: KeywordResult[] = [];

  for (const keyword of keywords) {
    const count = countOccurrences(keyword, normalizedResume);
    if (count > 0) {
      matched.push({ keyword, found: true, count });
    } else {
      missing.push({
        keyword,
        found: false,
        count: 0,
        suggestedPlacement: getSuggestedPlacement(keyword),
      });
    }
  }

  const total = keywords.length;
  const matchPercentage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return {
    matchPercentage,
    totalKeywords: total,
    matchedCount: matched.length,
    missingCount: missing.length,
    matched: matched.sort((a, b) => b.count - a.count),
    missing,
  };
}
