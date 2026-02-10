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

// Generic job posting filler words — expanded to reduce noise
const JOB_FILLER = new Set([
  'experience', 'required', 'preferred', 'ability', 'skills', 'including',
  'work', 'working', 'position', 'role', 'company', 'team', 'opportunity',
  'responsibilities', 'requirements', 'qualifications', 'candidate',
  'apply', 'job', 'description', 'employment', 'equal', 'employer',
  'benefits', 'salary', 'competitive', 'full-time', 'part-time',
  'minimum', 'years', 'degree', 'bachelor', 'master', 'education',
  // Expanded: recruiter language
  'looking', 'seeking', 'ideal', 'someone', 'strong', 'excellent',
  'good', 'great', 'solid', 'knowledge', 'understanding', 'familiarity',
  'needs', 'plus', 'bonus', 'leading', 'firm', 'services',
  'include', 'includes', 'environment', 'culture', 'dynamic', 'fast-paced',
  'collaborate', 'collaboration', 'demonstrate', 'demonstrated', 'proven',
  'track', 'record', 'ensure', 'ensuring', 'responsible', 'well', 'based',
  'proficiency', 'proficient', 'relevant', 'related', 'across', 'within',
  // Benefits / admin noise
  'health', 'insurance', '401k', 'matching', 'dental', 'vision',
  'paid', 'time', 'off', 'pto', 'remote', 'hybrid', 'office', 'location',
  // Generic verbs and vague terms that inflate noise
  'particularly', 'concepts', 'tools', 'development', 'implement',
  'implementing', 'utilizing', 'various', 'multiple', 'develop',
  'developing', 'like', 'manage', 'managing', 'support', 'supporting',
  'needed', 'maintain', 'current'
]);

// Connector words — bigrams containing these are almost always noise
const CONNECTORS = new Set([
  'with', 'and', 'for', 'in', 'to', 'or', 'the', 'a', 'an',
  'at', 'on', 'by', 'from', 'of', 'as', 'is', 'are',
]);

// Known tech terms with special characters that normal tokenization destroys
const TECH_TERMS_PATTERN = /(?<=^|\W)(c\+\+|c#|\.net|node\.js|next\.js|vue\.js|react\.js|asp\.net|vb\.net|f#)(?=\W|$)/gi;

// Section headers that signal the start of requirements (signal) vs company blurb (noise)
const REQUIREMENTS_HEADER = /\b(requirements|qualifications|what you.ll need|what we.re looking for|must.have|key skills|responsibilities|your background)\b/i;

// Placement suggestions based on keyword type
const PLACEMENT_RULES: Array<{ pattern: RegExp; placement: string }> = [
  { pattern: /\b(python|java|javascript|typescript|c\+\+|ruby|go|rust|php|swift|kotlin|scala|r|matlab|sql|html|css|sass|less)\b/i, placement: 'Skills section — Technical Skills' },
  { pattern: /\b(react|angular|vue|node|express|django|flask|spring|rails|next\.?js|nuxt|svelte|laravel|asp\.net)\b/i, placement: 'Skills section — Frameworks' },
  { pattern: /\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd|git|linux|nginx|apache)\b/i, placement: 'Skills section — Tools & Infrastructure' },
  { pattern: /\b(excel|powerpoint|word|salesforce|hubspot|jira|confluence|slack|figma|sketch|photoshop|tableau|power\s?bi)\b/i, placement: 'Skills section — Software' },
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
 * Extract the requirements/qualifications portion of a JD.
 * If a section header is found, return text from that header onward.
 * Otherwise return the full text (best effort).
 */
function extractRequirementsSection(text: string): string {
  const match = REQUIREMENTS_HEADER.exec(text);
  if (match && match.index !== undefined) {
    // Use everything from the first requirements header onward
    return text.slice(match.index);
  }
  return text;
}

/**
 * Extract meaningful keyword phrases from job description text.
 * Uses single words and bigrams, with pre-processing for special tech terms.
 */
export function extractKeywords(jobDescription: string): string[] {
  const fullText = normalize(jobDescription);

  // Fix 5: Focus on requirements section when possible
  const text = extractRequirementsSection(fullText);

  const keywordSet = new Map<string, number>();

  // Fix 4: Pre-extract known tech terms before general tokenization
  const techMatches = text.match(TECH_TERMS_PATTERN) || [];
  for (const term of techMatches) {
    const lower = term.toLowerCase();
    keywordSet.set(lower, (keywordSet.get(lower) || 0) + 1);
  }

  // Split into sentences, then words
  const sentences = text.split(/[.!?;]\s+/);

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

    // Bigrams only (trigrams removed — too noisy)
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length > 1 && b.length > 1) {
        // Fix 3: Skip bigrams with connector words, stop words, or filler
        if (CONNECTORS.has(a) || CONNECTORS.has(b)) continue;
        if (STOP_WORDS.has(a) || STOP_WORDS.has(b)) continue;
        if (JOB_FILLER.has(a) || JOB_FILLER.has(b)) continue;

        const bigram = `${a} ${b}`;
        keywordSet.set(bigram, (keywordSet.get(bigram) || 0) + 1);
      }
    }
  }

  // Filter and rank keywords
  const sorted = [...keywordSet.entries()].sort((a, b) => b[1] - a[1]);

  // First pass: collect candidates
  const candidates: string[] = [];
  const added = new Set<string>();
  for (const [keyword, count] of sorted) {
    const wordCount = keyword.split(' ').length;

    // (A) Bigrams must appear 2+ times to be included — single-occurrence
    // bigrams are almost always noise (adjacent words, not real phrases)
    if (wordCount === 2 && count < 2) continue;

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
    candidates.push(keyword);

    if (candidates.length >= 40) break; // Cap at 40 keywords
  }

  // (B) Bidirectional subsumption: if bigram "machine learning" is in the
  // list, remove standalone "machine" and "learning" even if they ranked
  // higher. The first pass only catches lower-ranked singles.
  const bigrams = candidates.filter((k) => k.includes(' '));
  const subsumedWords = new Set<string>();
  for (const bigram of bigrams) {
    for (const word of bigram.split(' ')) {
      subsumedWords.add(word);
    }
  }
  const results = candidates.filter((k) => {
    if (k.includes(' ')) return true; // keep all bigrams
    return !subsumedWords.has(k);
  });

  return results;
}

/**
 * Count occurrences of a keyword in text (case-insensitive, word-boundary aware)
 */
function countOccurrences(keyword: string, text: string): number {
  // Escape special regex chars
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Use lookaround for single words to handle C++, C#, .NET etc.
  // \b fails when keywords end with non-word characters like + or #
  const pattern = keyword.includes(' ')
    ? new RegExp(escaped, 'gi')
    : new RegExp(`(?<=^|\\W)${escaped}(?=\\W|$)`, 'gi');
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
