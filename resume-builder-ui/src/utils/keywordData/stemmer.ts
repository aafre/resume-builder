/**
 * Lightweight suffix-stripping stemmer for ATS keyword matching.
 *
 * NOT a full Porter stemmer — intentionally conservative to avoid
 * false positives on tech terms. Targets the ~15 most common English
 * suffixes that cause ATS mismatches (e.g. "managing" != "management").
 *
 * Critical rule: terms in the skipSet (known skills) are returned as-is
 * to prevent mangling ("React" -> "reac", "Docker" -> "dock").
 */

/** Set of lowercase terms that must never be stemmed */
let skipSet: ReadonlySet<string> | null = null;

/** Register known skills so the stemmer can skip them */
export function registerSkipTerms(terms: ReadonlySet<string>): void {
  skipSet = terms;
}

/**
 * Suffix rules ordered from longest to shortest.
 * Each rule: [suffix, minStemLength, replacement]
 * minStemLength prevents over-stemming short words.
 */
const SUFFIX_RULES: Array<[string, number, string]> = [
  // -ization / -isation → root (e.g. optimization → optim)
  ['ization', 4, ''],
  ['isation', 4, ''],
  // -ational → -ate (e.g. computational → compute... close enough)
  ['ational', 4, 'ate'],
  // -fulness → -ful
  ['fulness', 3, 'ful'],
  // -nesses → -ness... skip, rare
  // -ments → root (e.g. deployments → deploy)
  ['ments', 3, ''],
  // -ating → -ate (e.g. collaborating → collaborate)
  ['ating', 3, 'ate'],
  // -izing → root (e.g. optimizing → optim, matching -ization)
  ['izing', 3, ''],
  // -ized → root (e.g. optimized → optim, matching -ization)
  ['ized', 3, ''],
  // -ation → root (e.g. automation → autom, visualization → visualiz)
  ['ation', 3, ''],
  // -ment → root (e.g. management → manage... close via "manag")
  ['ment', 3, ''],
  // -tion → root (e.g. encryption → encryp)
  ['tion', 3, ''],
  // -sion → root (e.g. supervision → supervi)
  ['sion', 3, ''],
  // -ying → -y (e.g. deploying → deploy)
  ['ying', 3, 'y'],
  // -ated → root (e.g. automated → autom, matching -ation)
  ['ated', 3, ''],
  // -ies → -y (e.g. strategies → strategy)
  ['ies', 3, 'y'],
  // -ing → root (e.g. managing → manag, developing → develop)
  ['ing', 3, ''],
  // -ors → -or (e.g. supervisors → supervisor... not needed, but -or below)
  // -ers → root (e.g. developers → develop)
  ['ers', 3, ''],
  // -ed → root (e.g. developed → develop, managed → manag)
  ['ed', 3, ''],
  // -er → root (e.g. developer → develop)
  ['er', 3, ''],
  // -ly → root (e.g. effectively → effective... then -ive below)
  ['ly', 3, ''],
  // -al → root (e.g. technical → technic)
  ['al', 4, ''],
  // -ive → root (e.g. collaborative → collaborat)
  ['ive', 4, ''],
  // -es → root (e.g. processes → process)
  ['es', 3, ''],
  // -s → root (e.g. systems → system)
  ['s', 3, ''],
];

/**
 * Stem a single word. Returns the stemmed form, or the original word
 * if it's in the skip set or no rule applies.
 */
export function stem(word: string): string {
  const lower = word.toLowerCase();

  // Never stem known skills / tech terms
  if (skipSet?.has(lower)) return lower;

  // Don't stem very short words
  if (lower.length <= 4) return lower;

  for (const [suffix, minStem, replacement] of SUFFIX_RULES) {
    if (lower.endsWith(suffix)) {
      const stemPart = lower.slice(0, -suffix.length);
      if (stemPart.length >= minStem) {
        return stemPart + replacement;
      }
    }
  }

  return lower;
}

/**
 * Stem each word in a multi-word phrase independently.
 * Preserves word order and spacing.
 */
export function stemPhrase(phrase: string): string {
  return phrase
    .split(/\s+/)
    .map((w) => stem(w))
    .join(' ');
}
