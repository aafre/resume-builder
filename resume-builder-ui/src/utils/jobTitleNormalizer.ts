// src/utils/jobTitleNormalizer.ts

export interface NormalizedTitle {
  query: string;
  category: string | null;
  seniority: string | null;
}

// Category keyword map — order matters: more specific categories first
const CATEGORY_KEYWORDS: [string[], string][] = [
  // IT before engineering so "Software Engineer" → it-jobs
  [
    ['software', 'developer', 'devops', 'frontend', 'backend', 'fullstack',
     'full-stack', 'data engineer', 'cloud', 'cybersecurity', 'web developer',
     'mobile developer', 'qa engineer', 'machine learning', 'sre',
     'programmer', 'coder', 'data scientist', 'data analyst', 'architect'],
    'it-jobs',
  ],
  [
    ['mechanical engineer', 'civil engineer', 'electrical engineer',
     'chemical engineer', 'aerospace', 'structural engineer'],
    'engineering-jobs',
  ],
  [
    ['accountant', 'finance', 'financial', 'auditor', 'tax', 'banking', 'investment'],
    'accounting-finance-jobs',
  ],
  [['sales', 'account executive', 'business development'], 'sales-jobs'],
  [
    ['marketing', 'seo', 'content', 'social media', 'brand', 'copywriter'],
    'marketing-jobs',
  ],
  [
    ['designer', 'graphic', 'ux', 'ui', 'creative', 'art director'],
    'creative-design-jobs',
  ],
  [
    ['nurse', 'healthcare', 'medical', 'physician', 'therapist', 'pharmacist', 'doctor'],
    'healthcare-nursing-jobs',
  ],
  [['teacher', 'professor', 'instructor', 'education', 'tutor'], 'teaching-jobs'],
  [['human resources', 'recruiter', 'talent', 'hr manager', 'hr director'], 'hr-jobs'],
  [['lawyer', 'attorney', 'legal', 'paralegal', 'compliance'], 'legal-jobs'],
  [['consultant', 'consulting', 'advisory'], 'consultancy-jobs'],
  [['admin', 'administrator', 'receptionist', 'office manager', 'secretary'], 'admin-jobs'],
  [['retail', 'store manager', 'cashier', 'merchandiser'], 'retail-jobs'],
  [['logistics', 'supply chain', 'warehouse', 'driver', 'delivery'], 'logistics-warehouse-jobs'],
  [['construction', 'plumber', 'electrician', 'carpenter', 'foreman'], 'construction-jobs'],
  [['scientist', 'researcher', 'laboratory', 'biologist', 'chemist', 'physicist'], 'scientific-qa-jobs'],
  [['engineer', 'engineering'], 'engineering-jobs'],
];

const EXEC_PREFIXES = /^(?:vice\s+president|vp|svp|evp|director|head|chief)\b/i;
const EXEC_CONNECTORS = /^(?:of|for)\b/i;
const NOISE_WORDS = new Set(['of', 'for', 'the', '&', 'and']);
const SENIORITY_WORDS = new Set(['senior', 'junior', 'lead', 'principal', 'staff', 'associate']);
const LEVEL_SUFFIX = /\s+(?:[IVX]{1,4}|level\s*\d+|grade\s*\d+)$/i;
const PARENS_SUFFIX = /\s*\([^)]*\)\s*$/;
const COMPOUND_SEPARATORS = /\s+[-/|]\s+/;

function detectCategory(title: string): string | null {
  const lower = title.toLowerCase();
  for (const [keywords, category] of CATEGORY_KEYWORDS) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return category;
    }
  }
  return null;
}

/**
 * Normalizes a raw job title for Adzuna search and detects the best category.
 *
 * Pipeline:
 * 1. Basic cleanup (trim, collapse whitespace, strip parenthesized suffixes)
 * 2. Split compound titles on separators, pick best segment
 * 3. Strip executive prefixes (VP, Director of, etc.)
 * 4. Strip noise words (of, for, the, &, and)
 * 5. Strip level indicators (III, Level 2, Grade 3)
 * 6. Detect seniority word, conditional trimming (only if > 4 words)
 * 7. Final safety: keep first 3 words if still > 4
 */
export function normalizeJobTitle(rawTitle: string): NormalizedTitle {
  if (!rawTitle || !rawTitle.trim()) {
    return { query: '', category: null, seniority: null };
  }

  // 1. Basic cleanup
  let title = rawTitle.trim().replace(/\s+/g, ' ');
  title = title.replace(PARENS_SUFFIX, '').trim();

  // 2. Split compound titles, pick the segment with most recognizable keywords
  if (COMPOUND_SEPARATORS.test(title)) {
    const segments = title.split(COMPOUND_SEPARATORS).map((s) => s.trim()).filter(Boolean);
    if (segments.length > 1) {
      // Pick the segment that maps to a category, or the last one (usually more specific)
      let best = segments[segments.length - 1];
      for (const seg of segments) {
        if (detectCategory(seg)) {
          best = seg;
          break;
        }
      }
      title = best;
    }
  }

  // Detect category from the chosen segment (before further stripping)
  const category = detectCategory(title);

  // 3. Strip executive prefixes
  const execMatch = title.match(EXEC_PREFIXES);
  if (execMatch) {
    let rest = title.slice(execMatch[0].length).trim();
    // Remove connector words (of, for)
    const connectorMatch = rest.match(EXEC_CONNECTORS);
    if (connectorMatch) {
      rest = rest.slice(connectorMatch[0].length).trim();
    }
    // Only strip if there's something left
    if (rest) {
      title = rest;
    }
  }

  // 4. Strip noise words
  let words = title.split(/\s+/);
  words = words.filter((w) => !NOISE_WORDS.has(w.toLowerCase()));
  title = words.join(' ');

  // 5. Strip level indicators
  title = title.replace(LEVEL_SUFFIX, '').trim();

  // 6. Detect seniority word (before potential stripping)
  words = title.split(/\s+/);
  const seniority = words.length > 0 && SENIORITY_WORDS.has(words[0].toLowerCase())
    ? words[0]
    : null;

  // Conditional seniority trimming — only if > 4 words
  while (words.length > 4 && SENIORITY_WORDS.has(words[0].toLowerCase())) {
    words.shift();
  }

  // 7. Final safety — if still > 4 words, keep first 3
  if (words.length > 4) {
    words = words.slice(0, 3);
  }

  const query = words.join(' ');

  return { query, category, seniority };
}
