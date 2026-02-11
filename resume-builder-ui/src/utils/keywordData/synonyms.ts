/**
 * Synonym normalization map for ATS keyword matching.
 *
 * Maps ~80 variant spellings to canonical forms.
 * Applied during both keyword extraction (JD) and resume matching
 * so that "NodeJS" in a JD matches "Node.js" in a resume.
 */

/**
 * Map of lowercase variant → canonical lowercase form.
 * Multi-word keys use spaces (e.g. "ci cd").
 */
export const SYNONYMS: ReadonlyMap<string, string> = new Map([
  // --- JavaScript ecosystem ---
  // Note: avoid mapping bare "node"→"node.js" or "vue"→"vue.js" because
  // applyAllSynonyms would corrupt existing "node.js" into "node.js.js"
  ['nodejs', 'node.js'],
  ['reactjs', 'react'],
  ['react.js', 'react'],
  ['vuejs', 'vue.js'],
  ['nextjs', 'next.js'],
  ['nuxtjs', 'nuxt.js'],
  ['expressjs', 'express'],
  ['express.js', 'express'],
  ['angularjs', 'angular'],
  ['angular.js', 'angular'],
  ['sveltejs', 'svelte'],
  ['denojs', 'deno'],

  // --- .NET ecosystem ---
  ['dotnet', '.net'],
  ['dot net', '.net'],
  ['dot-net', '.net'],
  ['aspnet', 'asp.net'],
  ['asp net', 'asp.net'],
  ['vbnet', 'vb.net'],
  ['vb net', 'vb.net'],
  ['fsharp', 'f#'],
  ['csharp', 'c#'],
  ['c sharp', 'c#'],

  // --- Databases ---
  ['postgres', 'postgresql'],
  ['mongo', 'mongodb'],
  ['dynamodb', 'dynamodb'],
  ['mssql', 'sql server'],
  ['ms sql', 'sql server'],
  ['mysql', 'mysql'],

  // --- Cloud & DevOps ---
  ['k8s', 'kubernetes'],
  ['k8', 'kubernetes'],
  ['gcp', 'google cloud'],
  ['google cloud platform', 'google cloud'],
  ['amazonwebservices', 'aws'],
  ['amazon web services', 'aws'],
  ['ci cd', 'ci/cd'],
  ['cicd', 'ci/cd'],
  ['ci-cd', 'ci/cd'],
  ['gh actions', 'github actions'],

  // --- Languages ---
  ['golang', 'go'],
  ['cplusplus', 'c++'],
  ['c plus plus', 'c++'],
  ['py', 'python'],
  ['js', 'javascript'],
  ['ts', 'typescript'],

  // --- ML / AI ---
  ['ml', 'machine learning'],
  ['ai', 'artificial intelligence'],
  ['dl', 'deep learning'],
  ['nlp', 'natural language processing'],
  ['cv', 'computer vision'],
  ['llm', 'large language model'],
  ['genai', 'generative ai'],
  ['gen ai', 'generative ai'],
  ['scikit learn', 'scikit-learn'],
  ['sklearn', 'scikit-learn'],
  ['tf', 'tensorflow'],

  // --- Methodologies ---
  ['tdd', 'test-driven development'],
  ['bdd', 'behavior-driven development'],
  ['oop', 'object-oriented programming'],
  ['oops', 'object-oriented programming'],
  ['fp', 'functional programming'],

  // --- Tools ---
  ['vscode', 'visual studio code'],
  ['vs code', 'visual studio code'],
  ['intellij', 'intellij idea'],
  ['k8s helm', 'helm'],
  ['docker-compose', 'docker compose'],

  // --- Misc ---
  ['api', 'apis'],
  ['rest', 'rest apis'],
  ['restful', 'rest apis'],
  ['graphql', 'graphql'],
  ['websocket', 'websockets'],
  ['ui', 'user interface'],
  ['ux', 'user experience'],
  ['ui/ux', 'ui/ux design'],
  ['qa', 'quality assurance'],
  ['sre', 'site reliability engineering'],
  ['iac', 'infrastructure as code'],
  ['saas', 'software as a service'],
  ['cms', 'content management system'],
  ['sdk', 'software development kit'],
]);

/**
 * Multi-word synonym keys that need regex replacement on full text
 * before tokenization (single-word synonyms are applied per-token).
 */
export const MULTI_WORD_SYNONYM_KEYS: string[] = [...SYNONYMS.keys()].filter(
  (k) => k.includes(' ')
);

/**
 * Single-word synonym keys safe for full-text replacement.
 * Excludes very short keys (≤2 chars) like "js", "ts", "ai" that would
 * falsely match inside compound terms (e.g. "js" in "node.js").
 * Those short synonyms are still used for per-token normalization during extraction.
 */
export const SINGLE_WORD_SYNONYM_KEYS: string[] = [...SYNONYMS.keys()].filter(
  (k) => !k.includes(' ') && k.length > 2
);

/**
 * Normalize a single token through the synonym map.
 * Returns the canonical form if found, otherwise the original.
 */
export function normalizeSynonym(term: string): string {
  const lower = term.toLowerCase();
  return SYNONYMS.get(lower) ?? lower;
}

/**
 * Apply multi-word synonym replacements to full text.
 * Call this before tokenization so "ci cd" becomes "ci/cd", etc.
 */
export function applyMultiWordSynonyms(text: string): string {
  let result = text;
  for (const key of MULTI_WORD_SYNONYM_KEYS) {
    const canonical = SYNONYMS.get(key)!;
    // Word-boundary aware replacement
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<=^|\\W)${escaped}(?=\\W|$)`, 'gi');
    result = result.replace(pattern, canonical);
  }
  return result;
}

/**
 * Apply all synonyms (multi-word then single-word) to full text.
 * Used on resume text so variant spellings match canonical keyword forms.
 */
export function applyAllSynonyms(text: string): string {
  // Multi-word first (before tokenization would break them)
  let result = applyMultiWordSynonyms(text);
  // Single-word synonyms via word-boundary-aware replacement
  for (const key of SINGLE_WORD_SYNONYM_KEYS) {
    const canonical = SYNONYMS.get(key)!;
    if (key === canonical) continue; // skip identity mappings
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<=^|\\W)${escaped}(?=\\W|$)`, 'gi');
    result = result.replace(pattern, canonical);
  }
  return result;
}
