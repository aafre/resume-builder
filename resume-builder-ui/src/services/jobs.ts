// src/services/jobs.ts

const API_BASE_URL = '/api';

export interface AdzunaJob {
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_is_predicted: boolean;
  url: string;
  created: string;
  match_score?: number;
}

export interface JobSearchResult {
  count: number;
  jobs: AdzunaJob[];
  ai_terms_used?: string[];
}

export interface RoleSuggestion {
  primary_role: string;
  alternative_roles: string[];
  confidence: number;
}

export interface JobSearchOptions {
  query: string;
  location: string;
  country: string;
  category?: string | null;
  skills?: string[];
  seniorityLevel?: string;
  yearsExperience?: number;
  titleOnly?: boolean;
  maxDaysOld?: number;
  salaryMin?: number;
  fullTime?: boolean;
  permanent?: boolean;
  sortBy?: 'relevance' | 'salary' | 'date';
}

/**
 * Search for jobs via the backend 3-tier matching engine.
 * Sends resume context as POST body for server-side scoring.
 * Throws on non-200 responses or network errors.
 */
export async function searchJobs(opts: JobSearchOptions): Promise<JobSearchResult> {
  const body: Record<string, unknown> = {
    query: opts.query,
    country: opts.country,
  };
  if (opts.location) body.location = opts.location;
  if (opts.category) body.category = opts.category;
  if (opts.skills && opts.skills.length > 0) body.skills = opts.skills;
  if (opts.seniorityLevel) body.seniority_level = opts.seniorityLevel;
  if (opts.yearsExperience) body.years_experience = opts.yearsExperience;
  if (opts.titleOnly) body.title_only = true;
  if (opts.maxDaysOld) body.max_days_old = opts.maxDaysOld;
  if (opts.salaryMin) body.salary_min = opts.salaryMin;
  if (opts.fullTime) body.full_time = true;
  if (opts.permanent) body.permanent = true;
  if (opts.sortBy && opts.sortBy !== 'relevance') body.sort_by = opts.sortBy;

  const response = await fetch(`${API_BASE_URL}/jobs/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Job search request failed');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Job search failed');
  }

  return data.data;
}

/**
 * Suggest alternative roles based on title, skills, and career history.
 * Returns null on any failure (non-critical feature).
 */
export async function suggestRoles(
  title: string,
  skills: string[],
  experienceTitles: string[],
): Promise<RoleSuggestion | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/suggest-roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        skills,
        experience_titles: experienceTitles,
      }),
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success) return null;

    return {
      primary_role: data.primary_role,
      alternative_roles: data.alternative_roles,
      confidence: data.confidence,
    };
  } catch {
    return null;
  }
}
